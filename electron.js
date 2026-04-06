const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 750,
        resizable: false,
        title: 'Snake Pong',
        icon: path.join(__dirname, 'icons/icon-512.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    win.loadFile('index.html');
    win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});