const catchAsync = require('../utils/catchAsync');
const { downloadSpun } = require('../services/file.service');

const download = catchAsync(async (req, res) => {
  await downloadSpun(req.body.content, res);
  return true;
});

module.exports = {
  download,
};
