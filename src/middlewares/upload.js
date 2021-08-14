const upload = require('multer');
const path = require('path');

const diskStorage = upload.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'upload'));
  },
  filename(req, file, cb) {
    const parsedFileInfo = path.parse(file.originalname);
    cb(null, `${parsedFileInfo.name}-${Date.now()}${parsedFileInfo.ext}`);
  },
});

module.exports = upload({ storage: diskStorage });
