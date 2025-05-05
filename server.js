const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({
  origin: 'https://youtube-downloader-3-fihv.onrender.com' // अपना Render URL डालें
}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Add this route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/video-info', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const isValid = ytdl.validateURL(url);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        
        // Format the response data
        const response = {
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            views: info.videoDetails.viewCount,
            duration: info.videoDetails.lengthSeconds,
            formats: info.formats.map(format => ({
                url: format.url,
                quality: format.quality,
                qualityLabel: format.qualityLabel,
                mimeType: format.mimeType,
                hasVideo: !!format.qualityLabel,
                hasAudio: format.hasAudio
            }))
        };

        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch video info' });
    }
});

// const cors = require('cors');
// app.use(cors()); // सभी requests को allow करने के लिए

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
