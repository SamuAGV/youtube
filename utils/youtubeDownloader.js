const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const downloadVideo = async (url, quality = 'highest') => {
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    const filePath = path.join(__dirname, '../../public', `${title}.mp4`);
    
    const video = ytdl(url, {
      quality: quality,
      filter: format => format.container === 'mp4'
    });
    
    video.pipe(fs.createWriteStream(filePath));
    
    return new Promise((resolve, reject) => {
      video.on('end', () => {
        resolve({
          title: title,
          filePath: filePath,
          quality: quality,
          duration: info.videoDetails.lengthSeconds
        });
      });
      
      video.on('error', reject);
    });
  } catch (error) {
    throw new Error(`YouTube download failed: ${error.message}`);
  }
};

module.exports = { downloadVideo };