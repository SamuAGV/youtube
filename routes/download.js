const express = require('express');
const router = express.Router();
const { downloadVideo } = require('../utils/youtubeDownloader');
const { uploadToVercel } = require('../utils/vercelUploader');

router.post('/', async (req, res) => {
  try {
    const { url, quality } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    // Descargar el video
    const videoInfo = await downloadVideo(url, quality);
    
    // Subir a Vercel
    const vercelResponse = await uploadToVercel(videoInfo.filePath, videoInfo.title);
    
    res.json({
      message: 'Video downloaded and uploaded to Vercel successfully',
      videoInfo,
      vercelResponse
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;