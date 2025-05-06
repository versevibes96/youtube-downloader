const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Video Info Endpoint
app.get('/api/info', async (req, res) => {
    try {
        const videoId = req.query.videoId;
        const info = await ytdl.getInfo(videoId);
        
        const data = {
            id: videoId,
            title: info.videoDetails.title,
            channel: info.videoDetails.author.name,
            duration: parseInt(info.videoDetails.lengthSeconds),
            thumbnail: info.videoDetails.thumbnails.slice(-1)[0].url,
            formats: info.formats
                .filter(f => f.qualityLabel)
                .map(format => ({
                    itag: format.itag,
                    qualityLabel: format.qualityLabel,
                    container: format.container,
                    url: format.url
                }))
        };

        res.json(data);
    } catch (error) {
        res.status(400).json({ error: 'Invalid YouTube URL' });
    }
});

// Video Download Endpoint
app.get('/download', async (req, res) => {
    try {
        const videoId = req.query.videoId;
        const itag = req.query.itag;
        const title = req.query.title || 'video';
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(videoId, { quality: itag }).pipe(res);
    } catch (error) {
        res.status(500).send('Download Error');
    }
});

// MP3 Download Endpoint (FFmpeg required)
app.get('/download/mp3', async (req, res) => {
    // Add FFmpeg conversion logic here
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
