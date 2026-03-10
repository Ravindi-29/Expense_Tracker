const express = require('express');
const router = express.Router();
const { checkMonthlySummary, updateSummaryStatus, getSummaryHistory } = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');

router.get('/check', protect, checkMonthlySummary);
router.get('/history', protect, getSummaryHistory);
router.put('/:id', protect, updateSummaryStatus);

module.exports = router;
