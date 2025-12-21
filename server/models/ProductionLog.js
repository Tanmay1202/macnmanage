const mongoose = require('mongoose');

const productionLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Resource', // The machine or line involved
    },
    action: {
        type: String,
        required: true,
        enum: ['Start', 'Stop', 'Output', 'Maintenance', 'Issue'],
    },
    quantityProduced: {
        type: Number,
        default: 0,
    },
    efficiency: {
        type: Number, // 0-100%
        default: 100,
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('ProductionLog', productionLogSchema);
