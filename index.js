///////////// IMPORTS ///////////////////

const { app, BrowserWindow } = require('electron');
const path = require('path');
const expressApp = require("./express_js/index.js");

///////////// VARIABLES ///////////////////

const expressPort = process.env.PORT;
let mainWindow;
let isDev;

///////////// FUNCTIONS ///////////////////

async function loadDevFlag() {
    const devModule = await import('electron-is-dev');
    isDev = devModule.default;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        transparent: true,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    //// REMOVE THE MENU BAR
    mainWindow.setMenuBarVisibility(false);

    // Load the React.js application
    if (isDev) {
        mainWindow.loadURL('http://localhost:3006')
            .then(() => console.log("Frontend loaded successfully"))
            .catch(e => console.error("Failed to load frontend", e));
    } else {
        mainWindow.loadFile(path.join(__dirname, 'react_js/build/index.html'))
            .then(() => console.log("Production frontend ready"))
            .catch(e => console.log('Production interface not found', e));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
        expressApp.close();
    });
}

function restoreWindow() {
    if (mainWindow) {
        mainWindow.setResizable(true);
        mainWindow.setMovable(true);
        mainWindow.setFullScreenable(true);
        mainWindow.setFullScreen(true);
        mainWindow.maximize();
    }
}

///////////// CALLS AND LISTENERS ///////////////////
app.whenReady().then(async () => {
    await loadDevFlag();
    createWindow();
    expressApp.listen(expressPort);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

setTimeout(() => {
    restoreWindow();
}, 10000);

///////////// EXPORTS ///////////////////
