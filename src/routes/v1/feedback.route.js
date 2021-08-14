const express = require('express');
const feedbackController = require('../../controllers/feedback.controller');

const router = express.Router();

router.route('/').post(feedbackController.createFeedback);

module.exports = router;
