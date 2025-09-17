const { app, BrowserWindow, powerSaveBlocker } = require('electron');
const path = require('path');
const id=powerSaveBlocker.start('prevent-app-suspension');
powerSaveBlocker.stop(id);

app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occuled-windows');


function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true, // Полноэкранный режим
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    }
  });

  win.loadFile('index.html');
  //win.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
              
