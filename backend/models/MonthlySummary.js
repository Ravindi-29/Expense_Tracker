const mongoose = require('mongoose');

const MonthlySummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number, // 0-11
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalIncome: {
        type: Number,
        required: true
    },
    totalExpenses: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'saved', 'deleted'],
        default: 'pending'
    },
    notified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MonthlySummary', MonthlySummarySchema);
