///////////// IMPORTS ///////////////////
require('dotenv').config({ path: path.join(__dirname, '.env') })
const path = require('path');
const { app, BrowserWindow } = require('electron');
const expressApp = require("./express_js/index.js");

///////////// VARIABLES ///////////////////

const expressPort = process.env.EXPRESS_PORT;
let mainWindow;

///////////// FUNCTIONS ///////////////////



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
    mainWindow.loadFile(path.join(__dirname, 'react_js/build/index.html'))
        .then(() => console.log("Production frontend ready"))
        .catch(e => console.log('Production interface not found', e));

    mainWindow.on('closed', () => {
        mainWindow = null;
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
