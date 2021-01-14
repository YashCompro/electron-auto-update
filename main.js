const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdates().then(data => {

      console.log('************* check for updates data *****************');
      console.log(data);

    });
  });
}

app.on('ready', () => {
  debugger;
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
  console.log('app');
});

autoUpdater.on('checking-for-update', (data) => {
  // console.log('checking333');
  // dialog.showMessageBox({ title: "checking-for-update event", message: "check for updates event", buttons: ["OK"] });

  console.log('************ checking-for-update data ****************');
  console.log(data);

});

autoUpdater.on('error', (error) => {
  console.log('*********** error ***************');
  console.log(error);
  // dialog.showMessageBox({ title: "error", message: 'error', buttons: ["OK"] });
  // dialog.showMessageBox({ title: "error", message: JSON.stringify(error, getCircularReplacer()), buttons: ["OK"] });

});

autoUpdater.on('update-available', (data) => {
  // dialog.showMessageBox({ title: "update available", message: "update available", buttons: ["OK"] });
  // console.log('downloading');

  console.log('******************* update-available data *********************');
  console.log(data);

  autoUpdater.downloadUpdate();

});

autoUpdater.on('update-not-available', (data) => {
  // if (isSilent) return;
  console.log('******************* no update available **********************');
  console.log(data);
  // dialog.showMessageBox({ title: "update-not-available ", message: 'update-not-available', buttons: ["OK"] });

  let options1 = {
    type: "info",
    buttons: ["&OK"],
    message: "No Updates Available",
    detail1: "No Updates available at this time",
    noLink: true,
    normalizeAccessKeys: true
  }

  dialog.showMessageBox(options1);


});

autoUpdater.on('update-downloaded', (data) => {
  console.log('**************** update downloaded ****************');
  console.log(data);


  let options2 = {
    type: "question",
    buttons: ["&Yes", "&No", "&Cancel"],
    message: "Update Downloaded. Quit and install?",
    detail1: "Press Yes to quit and install",
    noLink: true,
    normalizeAccessKeys: true
  }

  dialog.showMessageBox(options2, (res, checked) => {
    console.log('in install question | res: ', res);
    if (res === 0) {
      autoUpdater.quitAndInstall();
    }
  });

});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond / 1024 + "MB ";
  log_message = log_message + ' - Downloaded ' + progressObj.percent.toFixed(2) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  // console.log('message', log_message);
  // dialog.showMessageBox({ title: "download-progress", message: log_message, buttons: ["OK"] });
  console.log('******************* download progress *******************');
  console.log(log_message);
  mainWindow.webContents.send('message', log_message);

});


ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
