const { Feedback } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const create = async (data) => {
  try {
    return await Feedback.create({
      email: data.email,
      content: data.content,
    });
  } catch (err) {
    logger.error(err.message);
    logger.debug(err);
    throw new ApiError(httpStatus['500'], 'Something went wrong!');
  }

}

module.exports = {
  create,
};
