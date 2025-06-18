const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const uploadToVercel = async (filePath, fileName) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: `${fileName}.mp4`,
      contentType: 'video/mp4'
    });

    const response = await axios.post(
      `https://api.vercel.com/v2/files`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
        }
      }
    );

    // Eliminar el archivo local después de subir
    fs.unlinkSync(filePath);

    return response.data;
  } catch (error) {
    throw new Error(`Vercel upload failed: ${error.message}`);
  }
};

module.exports = { uploadToVercel };