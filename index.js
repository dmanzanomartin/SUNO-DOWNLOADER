// procesarArchivos.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Usamos node-fetch versión 2
const ffmpeg = require('fluent-ffmpeg');

// Array de URLs con archivos .mp3 a descargar
const data = fs.readFileSync('input.txt', 'utf8');
const urls = data.split(' ');

// Carpeta donde se descargarán los archivos
const downloadFolder = path.join(__dirname, 'downloads');
const convertFolder = path.join(__dirname, 'converts');

// Si la carpeta no existe, se crea
if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder, { recursive: true });
}
if (!fs.existsSync(convertFolder)) {
  fs.mkdirSync(convertFolder, { recursive: true });
}

/**
 * Descarga un archivo desde la URL y lo guarda en 'dest'
 * @param {string} url - La URL del archivo a descargar.
 * @param {string} dest - La ruta de destino donde se guardará el archivo.
 * @param {function} progressCallback - Callback que se invoca con el porcentaje actual de descarga.
 * @returns {Promise<void>}
 */
async function downloadFile(url, dest, progressCallback) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al descargar ${url}: ${res.statusText}`);
  }
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(dest);
    let totalSize = parseInt(res.headers.get('content-length'));
    let downloadedSize = 0;
    res.body.on('data', (chunk) => {
      downloadedSize += chunk.length;
      const progress = Math.floor((downloadedSize / totalSize) * 100);
      progressCallback(progress);
    });
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", () => {
      resolve();
    });
  });
}

/**
 * Convierte un archivo de audio de .mp3 a .wav usando ffmpeg.
 * @param {string} inputPath - Ruta del archivo .mp3 de entrada.
 * @param {string} outputPath - Ruta donde se guardará el archivo .wav.
 * @param {function} progressCallback - Callback que se invoca con el porcentaje actual de conversión.
 * @returns {Promise<void>}
 */
async function convertFile(inputPath, outputPath, progressCallback) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .on('progress', (progress) => {
        progressCallback(Math.floor(progress.percent));
      })
      .on('error', (err) => {
        console.error(`Error al convertir ${inputPath}: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        console.log(`Conversión completada: ${outputPath}`);
        resolve();
      })
      .save(outputPath);
  });
}

/**
 * Procesa cada URL: descarga el archivo y lo convierte a .wav.
 */
async function processFiles() {
  console.log('🔥 Starting file processing...');
  // Descarga de archivos en paralelo
  function downloadParallel() {
    console.log('🚀 Starting parallel downloads');
    const downloads = urls.map(url => {
      return new Promise((resolve, reject) => {
        console.log(`🔽 Downloading file: ${url}`);
        const downloadPath = path.join(downloadFolder, path.basename(new URL(url).pathname));
        downloadFile(url, downloadPath, progress => {
          console.log(`📈 Download progress for ${path.basename(new URL(url).pathname)}: ${progress}%`);
        })
          .then(() => {
            console.log(`⬇️ Download completed: ${path.basename(new URL(url).pathname)}`);
            const wavFileName = path.basename(new URL(url).pathname).replace(/\.mp3$/i, '.wav');
            const wavPath = path.join(convertFolder, wavFileName);
            console.log(`♻️ Converting to WAV: ${path.basename(new URL(url).pathname)} -> ${wavFileName}`);
            convertFile(downloadPath, wavPath, progress => {
              console.log(`📊 Conversion progress for ${wavFileName}: ${progress}%`);
            })
              .then(() => {
                console.log(`✅ Conversion completed: ${wavFileName}`);
                resolve();
              })
              .catch(err => {
                console.error('❌ Conversion error:', err);
                reject(err);
              });
          })
          .catch(err => {
            console.error('❌ Download error:', err);
            reject(err);
          });
      });
    });
    Promise.all(downloads)
      .then(() => { console.log('Todos los archivos han sido descargados y convertidos'); })
      .catch(error => { console.error('Error en alguna descarga o conversión:', error); });
  }
  downloadParallel();
}

// Iniciamos el proceso
processFiles();