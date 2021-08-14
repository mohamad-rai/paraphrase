const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { feedbackService } = require('../services');

const createFeedback = catchAsync(async (req, res) => {
    const feedback = await feedbackService.create(req.body);
    res.status(feedback ? httpStatus.CREATED : httpStatus.BAD_REQUEST).json({ isSuccessful: !!feedback });
});

module.exports = {
    createFeedback
}