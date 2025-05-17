const path = require('path');

module.exports = {
  DOWNLOAD_DIR: path.join(__dirname, '../downloads'),
  MAX_FILE_AGE: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  PORT: process.env.PORT || 5000,
};