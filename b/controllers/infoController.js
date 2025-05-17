const YoutubeService = require('../services/youtubeService');

const getVideoInfo = async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const videoInfo = await YoutubeService.getVideoInfo(url);
    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch video info' });
  }
};

module.exports = {
  getVideoInfo,
};