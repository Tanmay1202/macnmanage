const asyncHandler = require('express-async-handler');
const ProductionLog = require('../models/ProductionLog');

// @desc    Get production logs
// @route   GET /api/production
// @access  Private
const getLogs = asyncHandler(async (req, res) => {
    const logs = await ProductionLog.find({ user: req.user.id })
        .populate('resource', 'name type')
        .sort('-createdAt');
    res.status(200).json(logs);
});

// @desc    Add production log
// @route   POST /api/production
// @access  Private
const addLog = asyncHandler(async (req, res) => {
    if (!req.body.resource || !req.body.action) {
        res.status(400);
        throw new Error('Please add resource and action');
    }

    const log = await ProductionLog.create({
        user: req.user.id,
        resource: req.body.resource,
        action: req.body.action,
        quantityProduced: req.body.quantityProduced,
        efficiency: req.body.efficiency,
        notes: req.body.notes,
    });

    res.status(200).json(log);
});

module.exports = {
    getLogs,
    addLog,
};
