const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { PrefManager } = require('./pref-manager');
const fs = require('fs');
const path = require('path');
const createApplicationMenu = require('./application-menu');

if (process.platform === "win32" && require('electron-squirrel-startup')) return;

let manager = new PrefManager(app.getPath("userData"));

const windows = new Set();

const resizeWindow = function(window) {
  window.webContents.send('resize', window.getContentSize()[0], window.getContentSize()[1]);
};

const createWindow = exports.createWindow = function() {
  let x, y;
  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [ currentWindowX, currentWindowY ] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  let setting = {
    x, y,
    width: manager.getPref("width") || 300,
    height: manager.getPref("height") || 800,
    minWidth: 200,
    minHeight: 200,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  };
  if (process.platform === "darwin") {
    setting.titleBarStyle = 'hidden';
  }
  if (process.platform === "win32") {
    setting.frame = false;
  }
  let newWindow = new BrowserWindow(setting);
  newWindow.webContents.loadURL(`file://${__dirname}/../html/main.html`);

  newWindow.on('ready-to-show', () => {
    newWindow.show();
    resizeWindow(newWindow);
  });

  newWindow.on('focus', createApplicationMenu);

  newWindow.on('resize', () => {
    resizeWindow(newWindow);
  });

  newWindow.on('close', () => {
    manager.setPref("width", newWindow.getSize()[0]);
    manager.setPref("height", newWindow.getSize()[1]);
    manager.save();
    newWindow.destroy();
  });

  newWindow.on('closed', _ => {
    windows.delete(newWindow);
    createApplicationMenu();
    newWindow = null;
  });

  windows.add(newWindow);
};

app.on('ready', () => {
  createApplicationMenu();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false;
  }
  app.quit();
});

app.on('activate', (_, hasVisiableWindows) => {
  if (!hasVisiableWindows) { createWindow(); }
});

ipcMain.on('save-pref', (_, items) => {
  manager.prefs = items;
  manager.save();
});

ipcMain.on('write-img', (_, buffer) => {
  let pathName = path.join(app.getPath("userData"), "image.png");
  fs.writeFileSync(pathName, buffer);
});

exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialogSync(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Image Files', extensions: ['png', 'jpeg'] }
    ]
  });

  if (files) { openFile(targetWindow, files[0]); }
};

const openFile = (targetWindow, file) => {
  targetWindow.webContents.send('file-opened', file);
};