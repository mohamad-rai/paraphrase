const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const feedbackSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    content: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
feedbackSchema.plugin(toJSON);

/**
 * @typedef Feedback
 */
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
