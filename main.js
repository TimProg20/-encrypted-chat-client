const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')

const keyController = require("./controllers/keyController.js");
const messageController = require("./controllers/messageController.js");

let mainWindow;

function createWindow () {
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      worldSafeExecuteJavaScript: true, contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('views/login.html');

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
  
    mainWindow = null;
  })
}

app.on('ready', () => {
  ipcMain.handle('key:create', keyController.create);
  ipcMain.handle('key:create-table', keyController.createTable);
  ipcMain.handle('key:select', keyController.select);
  ipcMain.handle('key:update', keyController.update);
  ipcMain.handle('key:remove', keyController.remove);
  ipcMain.handle('message:encrypt', messageController.encrypt);
  ipcMain.handle('message:decrypt', messageController.decrypt);
  ipcMain.handle('key:drop-table', keyController.dropTable);
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});
