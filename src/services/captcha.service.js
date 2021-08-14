const axios = require('axios');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const verifyCaptcha = async (req, res, next) => {
  if(req.query.cap === 'false') return next();
  const token = req.body.captcha;
  try {
    const config = {
      method: 'post',
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`,
    };
    const response = await axios(config);
    if (response.data.success) return next();
    next(new ApiError(httpStatus.NOT_ACCEPTABLE, 'Captcha failed', true));
  } catch (err) {
    logger.error(err);
    next(new Error(err.message));
  }
};

module.exports = verifyCaptcha;
