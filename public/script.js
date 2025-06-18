document.addEventListener('DOMContentLoaded', () => {
  const downloadBtn = document.getElementById('download-btn');
  const youtubeUrl = document.getElementById('youtube-url');
  const qualitySelect = document.getElementById('quality-select');
  const progressContainer = document.querySelector('.progress-container');
  const progressBar = document.querySelector('.progress-bar');
  const progressText = document.querySelector('.progress-text');
  const resultDiv = document.getElementById('result');
  const downloadLink = document.getElementById('download-link');
  const videoInfoDiv = document.querySelector('.video-info');
  const errorDiv = document.getElementById('error');

  downloadBtn.addEventListener('click', async () => {
    const url = youtubeUrl.value.trim();
    const quality = qualitySelect.value;

    if (!url) {
      showError('Por favor ingresa una URL de YouTube');
      return;
    }

    try {
      // Reset UI
      resetUI();
      progressContainer.classList.remove('hidden');
      
      // Validar URL de YouTube
      if (!isValidYouTubeUrl(url)) {
        throw new Error('URL de YouTube no válida');
      }

      // Hacer la petición a la API
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          quality
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al descargar el video');
      }

      const data = await response.json();

      // Mostrar resultado
      showResult(data);

    } catch (error) {
      showError(error.message);
    }
  });

  function updateProgress(percent) {
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
  }

  function showResult(data) {
    progressContainer.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    
    downloadLink.href = data.vercelResponse.url;
    downloadLink.textContent = `Descargar ${data.videoInfo.title}.mp4`;
    
    videoInfoDiv.innerHTML = `
      <p><strong>Título:</strong> ${data.videoInfo.title}</p>
      <p><strong>Calidad:</strong> ${data.videoInfo.quality}</p>
      <p><strong>Duración:</strong> ${formatDuration(data.videoInfo.duration)}</p>
    `;
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    progressContainer.classList.add('hidden');
  }

  function resetUI() {
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    errorDiv.textContent = '';
  }

  function isValidYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  }

  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
});