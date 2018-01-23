
const electron = require('electron');
// Module to control application life.
const { app, BrowserWindow, Menu, ipcMain } = electron;

if (process.platform == 'darwin') {
    const dockMenu = Menu.buildFromTemplate([
        { label: 'New Window', click: function () { console.log('New Window'); } },
        {
            label: 'New Window with Settings', submenu: [
                { label: 'Basic' },
                { label: 'Pro' }
            ]
        },
        { label: 'New Command...' }
    ]);

    app.dock.setMenu(dockMenu);
} else if (process.platform == 'win32') {
    app.setUserTasks([]);
    app.setUserTasks([
        {
            program: process.execPath,
            arguments: '--new-window',
            iconPath: process.execPath,
            iconIndex: 0,
            title: 'New Window',
            description: 'Create a new window'
        }
    ]);
}
var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.openDevTools();

    if (process.platform == 'win32') {
        let progress = 0;
        let interval = setInterval(() => {
            if (progress >= 1) {
                clearInterval(interval);
                mainWindow.setProgressBar(-1);
            }
            progress += 0.005;
            mainWindow.setProgressBar(progress)
        }, 20)
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});


ipcMain.on('online-status-changed', function (event, status) {
    console.log(status);
});