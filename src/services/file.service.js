const libre = require('libreoffice-convert');
const httpStatus = require('http-status');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const docx = require('../utils/docx');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const parsByFormat = {
  '.txt': (file) => {
    return fs.readFileSync(file.path, 'utf-8');
  },
  '.docx': async (file) => {
    const pdfExt = '.pdf';
    const filePath = file.path;
    const reading = fs.readFileSync(filePath);
    return await new Promise((resolve) => {
      libre.convert(reading, pdfExt, undefined, async function (e, pdfBuffer) {
        if (e) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "can't read file");
        logger.info('file converted');
        const pdfContent = await parsByFormat['.pdf'](null, pdfBuffer);
        fs.unlinkSync(file.path);
        resolve(pdfContent);
      });
    });
  },
  '.pdf': async (file, pdfBuffer = null) => {
    if (!file && !pdfBuffer) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "can't get file content");
    const processableContent = file ? fs.readFileSync(file.path) : pdfBuffer;
    return pdf(processableContent).then((data) => {
      logger.info('content received');
      return data.text;
    });
  },
};

const fileParser = async (file) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const { ext } = path.parse(file.originalname);
      const hell = await parsByFormat[ext](file);
      logger.info('fileParser finished');
      resolve(hell);
    } catch (err) {
      reject(err);
    }
  });
};

const downloadSpun = async (content, res) => {
  const docFile = await docx.create(content, true);
  const readStream = new stream.PassThrough();

  readStream.end(Buffer.from(docFile, 'base64'));
  res.set('Content-disposition', `attachment; filename=spunowl.docx`);
  res.set('Content-Type', 'text/plain');

  readStream.pipe(res);
};

module.exports = {
  fileParser,
  downloadSpun,
};
