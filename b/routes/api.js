const express = require('express');
const router = express.Router();
const { getVideoInfo } = require('../controllers/infoController');
const { downloadMedia } = require('../controllers/downloadController');

router.get('/info', getVideoInfo);
router.get('/download', downloadMedia);

module.exports = router;