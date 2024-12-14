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
  getFolderPath: async () => {
    try {
      return await ipcRenderer.invoke('get-folder-path');
    } catch (error) {
      console.error('Error in getFolderPath:', error);
      return '/default/path/to/scanned/files';
    }
  },
  setFolderPath: async (newPath) => {
    try {
      await ipcRenderer.invoke('set-folder-path', newPath);
    } catch (error) {
      console.error('Error in setFolderPath:', error);
    }
  },
  removeBlankPages: async (folderPath) => {
    try {
      return await ipcRenderer.invoke('remove-blank-pages', folderPath);
    } catch (error) {
      console.error('Error in removeBlankPages:', error);
      return 'Error removing blank pages.';
    }
  },
});