require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/constants');
const apiRouter = require('./routes/api');
const { cleanupOldFiles, ensureDownloadsDir } = require('./utils/storage');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize server
async function startServer() {
  try {
    await ensureDownloadsDir();
    await cleanupOldFiles();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();