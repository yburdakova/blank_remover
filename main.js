import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import { spawn } from 'child_process';

const store = new Store();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


ipcMain.handle('select-folder', async (event, parentPath) => {
  try {
    const result = await dialog.showOpenDialog({
      defaultPath: parentPath || app.getPath('documents'),
      properties: ['openDirectory'],
    });
    return result.filePaths[0] || '';
  } catch (error) {
    console.error('Error selecting folder:', error);
    return '';
}})

ipcMain.handle('get-folder-path', () => {
  return store.get('parentFolderPath', '/default/path/to/scanned/files');
});

ipcMain.handle('set-folder-path', (event, newPath) => {
  console.log('Saving path:', newPath);
  store.set('parentFolderPath', newPath);
});

ipcMain.handle('remove-blank-pages', async (event, folderPath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [path.join(__dirname, 'remove_blank_pages.py'), folderPath]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve('Blank pages removed successfully.');
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });
  });
});

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
