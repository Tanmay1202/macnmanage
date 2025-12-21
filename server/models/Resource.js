const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true, // e.g., 'Raw Material', 'Machine', 'Tool'
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    unit: {
        type: String,
        required: true, // e.g., 'kg', 'pcs', 'liters'
    },
    pricePerUnit: {
        type: Number,
        required: true,
        default: 0.0,
    },
    location: {
        type: String, // e.g., 'Warehouse A', 'Shelf 3'
    },
    status: {
        type: String,
        enum: ['Available', 'Low Stock', 'Out of Stock', 'Maintenance', 'Operational', 'Warning', 'Critical'],
        default: 'Available',
    },
    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        description: "Flexible fields for user customization"
    }
}, {
    timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
