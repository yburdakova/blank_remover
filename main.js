import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import { spawn } from 'child_process';
import fs from 'fs';

const logFilePath = path.join(app.getPath('userData'), 'app.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

console.log = (...args) => {
  process.stdout.write(args.join(' ') + '\n');
  logStream.write('[LOG] ' + args.join(' ') + '\n');
};

console.error = (...args) => {
  process.stderr.write(args.join(' ') + '\n');
  logStream.write('[ERROR] ' + args.join(' ') + '\n');
};

console.warn = (...args) => {
  process.stderr.write(args.join(' ') + '\n');
  logStream.write('[WARN] ' + args.join(' ') + '\n');
};

console.log(`Log file initialized at ${logFilePath}`);

const store = new Store();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = app.isPackaged ? 'production' : 'development';
}
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`__dirname: ${__dirname}`);
console.log(`process.cwd(): ${process.cwd()}`);

function getPythonPath() {
  console.log("Entering getPythonPath...");
  if (process.platform === 'win32') {
    const winPythonPath = path.join(__dirname, 'WPy64-31241', 'python-3.12.4.amd64', 'python.exe');
    console.log(`Checking Python path: ${winPythonPath}`);
    if (fs.existsSync(winPythonPath)) {
      console.log('Python executable found.');
      return winPythonPath;
    } else {
      console.warn('WinPython not found. Falling back to system Python.');
      return 'python';
    }
  } else {
    console.log('Using system Python for non-Windows platform.');
    return 'python3';
  }
}

function getScriptPath() {
  console.log("Entering getScriptPath...");
  let scriptPath;

  if (process.env.NODE_ENV === 'development') {
    scriptPath = path.join(process.cwd(), 'remove_blank_pages.py');
    console.log(`Development Script Path: ${scriptPath}`);
  } else {
    scriptPath = path.join(process.resourcesPath, 'app', 'remove_blank_pages.py');
    console.log(`Production Script Path: ${scriptPath}`);
  }

  if (fs.existsSync(scriptPath)) {
    console.log(`Script found at: ${scriptPath}`);
  } else {
    console.error(`Script NOT found at: ${scriptPath}`);
  }

  return scriptPath;
}

function validateFolderPath(folderPath) {
  console.log(`Validating folder path: ${folderPath}`);
  if (!folderPath || !fs.existsSync(folderPath)) {
    console.error(`Folder does not exist or invalid path: ${folderPath}`);
    return false;
  }
  console.log(`Folder path is valid: ${folderPath}`);
  return true;
}

let mainWindow;

function createMainWindow() {
  console.log("Creating main window...");
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    console.log("Main window closed.");
    mainWindow = null;
  });
}

ipcMain.handle('select-folder', async (event, parentPath) => {
  console.log("Handling 'select-folder' event...");
  try {
    const result = await dialog.showOpenDialog({
      defaultPath: parentPath || app.getPath('documents'),
      properties: ['openDirectory'],
    });
    console.log(`Folder selected: ${result.filePaths[0]}`);
    return result.filePaths[0] || '';
  } catch (error) {
    console.error('Error selecting folder:', error);
    return '';
  }
});

ipcMain.handle('get-folder-path', () => {
  const path = store.get('parentFolderPath', '/default/path/to/scanned/files');
  console.log(`Retrieving folder path: ${path}`);
  return path;
});

ipcMain.handle('set-folder-path', (event, newPath) => {
  console.log(`Setting new folder path: ${newPath}`);
  store.set('parentFolderPath', newPath);
});

ipcMain.handle('remove-blank-pages', async (event, folderPath) => {
  console.log("Handling 'remove-blank-pages' event...");
  return new Promise((resolve, reject) => {
    if (!validateFolderPath(folderPath)) {
      reject(`Invalid folder path: ${folderPath}`);
      return;
    }

    const pythonPath = getPythonPath();
    const scriptPath = getScriptPath();

    mainWindow.webContents.send('show-loader');

    console.log(`Python Path: "${pythonPath}"`);
    console.log(`Script Path: "${scriptPath}"`);
    console.log(`Folder Path: "${folderPath}"`);

    if (!fs.existsSync(scriptPath)) {
      console.error(`Script not found at path: ${scriptPath}`);
      reject(`Script not found at path: ${scriptPath}`);
      return;
    }

    const pythonProcess = spawn(
      `"${pythonPath}"`,
      [`"${scriptPath}"`, `"${folderPath}"`],
      { shell: true }
    );

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      mainWindow.webContents.send('hide-loader');
      if (code === 0) {
        console.log("Blank pages removed successfully.");
        resolve('Blank pages removed successfully.');
      } else {
        console.error(`Python script exited with code ${code}`);
        reject(`Python script exited with code ${code}`);
      }
    });

    pythonProcess.on('error', (err) => {
      console.error(`Failed to start Python process: ${err.message}`);
      mainWindow.webContents.send('hide-loader');
      reject(`Failed to start Python process: ${err.message}`);
    });
  });
});

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log("Quitting application...");
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    console.log("Recreating main window...");
    createMainWindow();
  }
});
