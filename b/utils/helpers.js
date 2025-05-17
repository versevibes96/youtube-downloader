const path = require('path');
const fs = require('fs-extra');

const cleanFilename = (str) => {
  return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

const getVideoInfo = async (ytdl, url) => {
  try {
    const info = await ytdl.getVideoInfo(url);
    return {
      title: info.title,
      channel: info.uploader,
      thumbnail: info.thumbnail,
      duration: formatDuration(info.duration),
      views: info.view_count.toLocaleString() + ' views',
    };
  } catch (error) {
    throw new Error('Failed to fetch video info');
  }
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
    .filter(Boolean)
    .join(':');
};

module.exports = {
  cleanFilename,
  getVideoInfo,
  formatDuration,
};