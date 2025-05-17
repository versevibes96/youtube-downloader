const ytdl = require('yt-dlp-exec');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const path = require('path');
const fs = require('fs-extra');
const { getFilePath, ensureDownloadsDir } = require('../utils/storage');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

class YoutubeService {
  static async getVideoInfo(url) {
    try {
      const info = await ytdl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
      });
      
      return {
        title: info.title,
        channel: info.uploader,
        thumbnail: info.thumbnail,
        duration: this.formatDuration(info.duration),
        views: info.view_count?.toLocaleString() + ' views' || 'N/A',
      };
    } catch (error) {
      throw new Error('Failed to fetch video info: ' + error.message);
    }
  }

  static formatDuration(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  static async downloadVideo(url, quality) {
    await ensureDownloadsDir();
    const info = await ytdl(url, { dumpSingleJson: true });
    const filename = `${this.cleanFilename(info.title)}_${quality}p.mp4`;
    const filePath = getFilePath(filename);

    if (await fs.pathExists(filePath)) {
      return { filename, filePath };
    }

    try {
      console.log('Downloading video with audio...');
      await ytdl(url, {
        format: `bestvideo[height<=${quality}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${quality}]`,
        output: filePath,
        mergeOutputFormat: 'mp4',
        noPart: true,
      });

      // Verify the output file
      const isValid = await this.verifyMediaFile(filePath);
      if (!isValid) {
        throw new Error('Final output file is corrupted');
      }

      return { filename, filePath };
    } catch (error) {
      // Cleanup partial files if error occurs
      await fs.unlink(filePath).catch(() => {});
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }

  static async verifyMediaFile(filePath) {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error('File verification failed:', err);
          return resolve(false);
        }
        try {
          const hasVideo = metadata.streams.some(s => s.codec_type === 'video');
          const hasAudio = metadata.streams.some(s => s.codec_type === 'audio');
          resolve(hasVideo && hasAudio);
        } catch (error) {
          console.error('Error checking streams:', error);
          resolve(false);
        }
      });
    });
  }

  static async downloadAudio(url) {
    await ensureDownloadsDir();
    const info = await ytdl(url, { dumpSingleJson: true });
    const filename = `${this.cleanFilename(info.title)}.mp3`;
    const filePath = getFilePath(filename);

    if (await fs.pathExists(filePath)) {
      return { filename, filePath };
    }

    try {
      await ytdl(url, {
        format: 'bestaudio/best',
        extractAudio: true,
        audioFormat: 'mp3',
        output: filePath,
        ffmpegLocation: ffmpegPath,
        postprocessorArgs: [
          '-metadata', `title=${info.title}`,
          '-metadata', `artist=${info.uploader}`,
          '-metadata', `album=${info.title}`
        ],
      });

      // Verify the output file exists and has content
      const stats = await fs.stat(filePath);
      if (stats.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      return { filename, filePath };
    } catch (error) {
      // Cleanup partial files if error occurs
      await fs.unlink(filePath).catch(() => {});
      throw new Error(`Failed to download audio: ${error.message}`);
    }
  }

  static cleanFilename(str) {
    return str
      .replace(/[<>:"/\\|?*]+/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 100)
      .trim();
  }
}

module.exports = YoutubeService;