const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveGame: (gameData) => ipcRenderer.send('file:save', gameData),
    loadGame: () => ipcRenderer.invoke('file:load'),
    notifyWin: () => ipcRenderer.send('notification:win'),
    notifyLose: () => ipcRenderer.send('notification:lose'),
    onSaveSuccess: (callback) => ipcRenderer.on('save-success', (event, message) => callback(message)),
    onSaveFailure: (callback) => ipcRenderer.on('save-failure', (event, message) => callback(message))
});