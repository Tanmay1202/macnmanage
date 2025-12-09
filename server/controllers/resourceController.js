const asyncHandler = require('express-async-handler');
const Resource = require('../models/Resource');

// @desc    Get resources
// @route   GET /api/resources
// @access  Private
const getResources = asyncHandler(async (req, res) => {
    const resources = await Resource.find({ user: req.user.id });
    res.status(200).json(resources);
});

// @desc    Set resource
// @route   POST /api/resources
// @access  Private
const setResource = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400);
        throw new Error('Please add a name field');
    }

    const resource = await Resource.create({
        user: req.user.id,
        name: req.body.name,
        type: req.body.type,
        quantity: req.body.quantity,
        unit: req.body.unit,
        pricePerUnit: req.body.pricePerUnit,
        location: req.body.location,
        customFields: req.body.customFields,
    });

    res.status(200).json(resource);
});

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
const updateResource = asyncHandler(async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        res.status(400);
        throw new Error('Resource not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the resource user
    if (resource.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedResource = await Resource.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedResource);
});

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = asyncHandler(async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
        res.status(400);
        throw new Error('Resource not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the resource user
    if (resource.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await resource.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getResources,
    setResource,
    updateResource,
    deleteResource,
};
