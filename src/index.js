const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Using node-fetch version 2
const ffmpeg = require('fluent-ffmpeg');
const readline = require('readline');

// Array of URLs with .mp3 files to download
const data = fs.readFileSync('input.txt', 'utf8');
const urls = data.split(' ');

// Download and conversion folders
const downloadFolder = path.join(__dirname, './../downloads');
const convertFolder = path.join(__dirname, './../outputs');

if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder, { recursive: true });
}
if (!fs.existsSync(convertFolder)) {
  fs.mkdirSync(convertFolder, { recursive: true });
}

// Global object to store the progress for each file
// The key will be the file name and the value an object with download and conversion statuses.
let progressStatus = {};

/**
 * Function to update the display cleanly.
 */
function updateDisplay() {
  // Clear the console
  process.stdout.write('\x1B[2J\x1B[0f');
  console.log('Status of downloads and conversions:\n');
  Object.keys(progressStatus).forEach(key => {
    const status = progressStatus[key];
    // Show "N/A" if the conversion hasn't started yet
    const conversionText = status.conversion !== null ? `${status.conversion}%` : 'N/A';
    console.log(`${key} → Download: ${status.download}% | Conversion: ${conversionText}`);
  });
}

// Start updating the screen every 500 ms
const displayInterval = setInterval(updateDisplay, 500);

/**
 * Downloads a file from the given URL and saves it to 'dest'.
 */
async function downloadFile(url, dest, progressCallback) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error downloading ${url}: ${res.statusText}`);
  }
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(dest);
    const totalSize = parseInt(res.headers.get('content-length')) || 0;
    let downloadedSize = 0;
    res.body.on('data', (chunk) => {
      downloadedSize += chunk.length;
      // Avoid division by zero if totalSize is 0
      const progress = totalSize ? Math.floor((downloadedSize / totalSize) * 100) : 100;
      progressCallback(progress);
    });
    res.body.pipe(fileStream);
    res.body.on("error", err => reject(err));
    fileStream.on("finish", () => resolve());
  });
}

/**
 * Converts an audio file from .mp3 to .wav using ffmpeg.
 */
async function convertFile(inputPath, outputPath, progressCallback) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .on('progress', progress => {
        progressCallback(Math.floor(progress.percent));
      })
      .on('error', err => {
        console.error(`Error converting ${inputPath}: ${err.message}`);
        reject(err);
      })
      .on('end', () => resolve())
      .save(outputPath);
  });
}

/**
 * Processes each URL: downloads the file and converts it to .wav.
 */
async function processFiles() {
  console.log('🔥 Starting file processing...');
  // Process all tasks in parallel
  const downloads = urls.map(url => {
    return new Promise((resolve, reject) => {
      const fileName = path.basename(new URL(url).pathname);
      // Initialize the state for this file
      progressStatus[fileName] = { download: 0, conversion: null };

      const downloadPath = path.join(downloadFolder, fileName);
      downloadFile(url, downloadPath, progress => {
        // Update the download progress
        progressStatus[fileName].download = progress;
      })
        .then(() => {
          // Once downloaded, start the conversion
          const wavFileName = fileName.replace(/\.mp3$/i, '.wav');
          progressStatus[fileName].conversion = 0; // start conversion
          const wavPath = path.join(convertFolder, wavFileName);
          return convertFile(downloadPath, wavPath, progress => {
            // Update the conversion progress
            progressStatus[fileName].conversion = progress;
          });
        })
        .then(() => {
          // Once conversion is finished, set the progress to 100%
          progressStatus[fileName].conversion = 100;
          resolve();
        })
        .catch(err => reject(err));
    });
  });

  Promise.all(downloads)
    .then(() => {
      // Stop updating the console so the final message remains visible
      clearInterval(displayInterval);
      // Show a final update with complete status
      updateDisplay();
      console.log('✅ All files have been downloaded and converted.');
    })
    .catch(error => console.error('❌ Error in some download or conversion:', error));
}

// Start the process
processFiles();
