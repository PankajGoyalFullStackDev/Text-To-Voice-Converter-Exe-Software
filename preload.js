const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studio', {
  selectVideo: () => ipcRenderer.invoke('select-video'),
  probeDuration: (filePath) => ipcRenderer.invoke('probe-duration', filePath),
  generateAudio: (opts) => ipcRenderer.invoke('generate-audio', opts),
  mergeVideo: (opts) => ipcRenderer.invoke('merge-video', opts),
  saveAudio: (audioPath) => ipcRenderer.invoke('save-audio', audioPath)
});
