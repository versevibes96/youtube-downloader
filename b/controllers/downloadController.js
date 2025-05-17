const YoutubeService = require('../services/youtubeService');
const { getFilePath } = require('../utils/storage');
const fs = require('fs-extra');
const path = require('path');

const downloadMedia = async (req, res) => {
  try {
    const { url, format, quality } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    let result;
    if (format === 'mp3') {
      result = await YoutubeService.downloadAudio(url);
    } else {
      result = await YoutubeService.downloadVideo(url, quality || '720');
    }

    res.download(result.filePath, result.filename, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Optionally delete the file after download completes
      // fs.unlink(result.filePath).catch(console.error);
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message || 'Download failed' });
  }
};

module.exports = {
  downloadMedia,
};