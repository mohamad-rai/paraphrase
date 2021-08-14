const express = require('express');
const spinController = require('../../controllers/spin.controller');
const upload = require('../../middlewares/upload');
const verifyCaptcha = require('../../services/captcha.service');
const router = express.Router();

router.route('/').post(verifyCaptcha, spinController.spinText);
router.route('/fake').post(verifyCaptcha, spinController.fakeSpinText);
router.route('/file').post(upload.single('file'), verifyCaptcha, spinController.spinFile);
router.route('/synonyms').post(spinController.synonyms);
// var d = b[0].meanings.map(e=> (e.definitions.map(w=> w.synonyms.map(t=>({word: t, type: e.partOfSpeech}))).flat(2))).flat()
module.exports = router;
