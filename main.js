const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const ffmpeg = require('fluent-ffmpeg');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 900,
    backgroundColor: '#14181D',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ---------- IPC: pick a video file ----------
ipcMain.handle('select-video', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select your video',
    properties: ['openFile'],
    filters: [{ name: 'Videos', extensions: ['mp4', 'mov', 'mkv', 'avi', 'webm'] }]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// ---------- IPC: probe video duration ----------
ipcMain.handle('probe-duration', async (event, filePath) => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) return resolve(null);
      resolve(data.format.duration || null);
    });
  });
});

// ---------- IPC: generate AI voice ----------
ipcMain.handle('generate-audio', async (event, { text, voice, ratePct, pitchPct }) => {
  try {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'voiceover-'));
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioFilePath } = await tts.toFile(tmpDir, text, {
      rate: ratePct,   // e.g. "+10%" or "-10%"
      pitch: pitchPct  // e.g. "+0Hz"
    });
    tts.close();
    return { ok: true, path: audioFilePath };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
});

// ---------- IPC: merge video + audio ----------
ipcMain.handle('merge-video', async (event, { videoPath, audioPath }) => {
  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: 'Save narrated video as',
    defaultPath: path.join(app.getPath('videos') || os.homedir(), 'narrated-output.mp4'),
    filters: [{ name: 'MP4 Video', extensions: ['mp4'] }]
  });
  if (saveResult.canceled || !saveResult.filePath) return { ok: false, error: 'cancelled' };
  const outputPath = saveResult.filePath;

  return new Promise((resolve) => {
    ffmpeg(videoPath)
      .input(audioPath)
      .outputOptions(['-map 0:v:0', '-map 1:a:0', '-c:v copy', '-c:a aac', '-b:a 192k', '-shortest'])
      .save(outputPath)
      .on('end', () => resolve({ ok: true, path: outputPath }))
      .on('error', (err) => resolve({ ok: false, error: err.message }));
  });
});

// ---------- IPC: save the generated audio file separately ----------
ipcMain.handle('save-audio', async (event, audioPath) => {
  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: 'Save voice audio as',
    defaultPath: path.join(app.getPath('music') || os.homedir(), 'voice.mp3'),
    filters: [{ name: 'MP3 Audio', extensions: ['mp3'] }]
  });
  if (saveResult.canceled || !saveResult.filePath) return { ok: false, error: 'cancelled' };
  try {
    fs.copyFileSync(audioPath, saveResult.filePath);
    return { ok: true, path: saveResult.filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});
