const MonthlySummary = require('../models/MonthlySummary');
const Transaction = require('../models/Transaction');

// @desc    Get or generate monthly summary
// @route   GET /api/summary/check
// @access  Private
exports.checkMonthlySummary = async (req, res) => {
    try {
        const now = new Date();
        // Check for previous month
        let month = now.getMonth() - 1;
        let year = now.getFullYear();

        if (month < 0) {
            month = 11;
            year -= 1;
        }

        // Check if summary already exists for previous month
        let summary = await MonthlySummary.findOne({ userId: req.user.id, month, year });

        if (!summary) {
            // Calculate totals for that month
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);

            const transactions = await Transaction.find({
                userId: req.user.id,
                date: { $gte: startDate, $lte: endDate }
            });

            let totalIncome = 0;
            let totalExpenses = 0;

            transactions.forEach(t => {
                if (t.type === 'income') {
                    totalIncome += t.amount;
                } else {
                    totalExpenses += t.amount;
                }
            });

            summary = await MonthlySummary.create({
                userId: req.user.id,
                month,
                year,
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                status: 'pending',
                notified: false
            });
        }

        // Return the latest pending summary if it hasn't been notified
        const pendingSummaries = await MonthlySummary.find({
            userId: req.user.id,
            status: 'pending',
            notified: false
        });

        return res.status(200).json({
            success: true,
            data: pendingSummaries
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Update summary status (save or delete)
// @route   PUT /api/summary/:id
// @access  Private
exports.updateSummaryStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'saved' or 'deleted'

        let summary = await MonthlySummary.findById(req.params.id);

        if (!summary) {
            return res.status(404).json({ success: false, error: 'Summary not found' });
        }

        if (summary.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        summary.status = status;
        summary.notified = true;
        await summary.save();

        return res.status(200).json({
            success: true,
            data: summary
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc    Get all saved summaries
// @route   GET /api/summary/history
// @access  Private
exports.getSummaryHistory = async (req, res) => {
    try {
        const summaries = await MonthlySummary.find({ userId: req.user.id, status: 'saved' }).sort({ year: -1, month: -1 });

        return res.status(200).json({
            success: true,
            data: summaries
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
}
