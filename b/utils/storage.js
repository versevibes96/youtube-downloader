const fs = require('fs-extra');
const path = require('path');
const { DOWNLOAD_DIR, MAX_FILE_AGE } = require('../config/constants');

const ensureDownloadsDir = async () => {
  try {
    await fs.ensureDir(DOWNLOAD_DIR);
    console.log(`Downloads directory ensured at: ${DOWNLOAD_DIR}`);
  } catch (error) {
    console.error('Error creating downloads directory:', error);
    throw error;
  }
};

const cleanupOldFiles = async () => {
  try {
    await ensureDownloadsDir(); // Ensure directory exists first
    
    const files = await fs.readdir(DOWNLOAD_DIR).catch(() => []);
    
    const now = Date.now();
    const cleanupPromises = files.map(async (file) => {
      const filePath = path.join(DOWNLOAD_DIR, file);
      try {
        const stat = await fs.stat(filePath);
        if (now - stat.ctimeMs > MAX_FILE_AGE) {
          await fs.unlink(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    });

    await Promise.all(cleanupPromises);
  } catch (error) {
    console.error('Error in cleanupOldFiles:', error);
  }
};

const getFilePath = (filename) => {
  return path.join(DOWNLOAD_DIR, filename);
};

module.exports = {
  ensureDownloadsDir,
  cleanupOldFiles,
  getFilePath,
};