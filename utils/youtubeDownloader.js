const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const downloadVideo = async (url, quality = 'highest') => {
  try {
    // Añadir opciones de solicitud para evitar bloqueos
    const options = {
      quality: quality,
      filter: format => format.container === 'mp4',
      requestOptions: {
        headers: {
          // Headers para simular navegador
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
    };

    const info = await ytdl.getInfo(url, options);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    const filePath = path.join(__dirname, '../../public', `${title}.mp4`);

    const video = ytdl.downloadFromInfo(info, options);
    
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