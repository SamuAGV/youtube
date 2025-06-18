const downloadVideo = async (url, quality = 'highest', retries = 3) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      // ... código de descarga anterior ...
      return await attemptDownload(url, quality);
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error(`Failed after ${retries} attempts: ${lastError.message}`);
};

async function attemptDownload(url, quality) {
  const options = {
    quality: quality,
    filter: format => format.container === 'mp4',
    requestOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }
  };

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
}