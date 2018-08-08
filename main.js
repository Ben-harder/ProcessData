const { app, BrowserWindow, Menu, ipcMain } = require('electron');

let win;

function createWindow()
{
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 });

    // Load the index.html of the app.
    win.loadFile('index.html');

    // Open dev tools
    win.webContents.openDevTools();

    // When the window is closed...
    win.on('closed', () => 
    {
        // Dereference the window object.
        win = null;
    });

    // Hide the menu bar.
    Menu.setApplicationMenu(null);
}

// When electron is finished initialization, create the window.
app.on('ready', createWindow);

// Quit when all the windows are closed.
app.on('window-all-closed', () =>
{
    // If the app is on a mac, it should stay open until the user explicitly quits it.
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
});

app.on('activate', () =>
{
    // On a mac, it might be closed but should reopen the window upon clicking
    if (win === null)
    {
        createWindow();
    }
});

