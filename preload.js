const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: async (parentPath) => {
    try {
      return await ipcRenderer.invoke('select-folder', parentPath);
    } catch (error) {
      console.error('Error in preload.js:', error);
      return '';
    }
  },
});