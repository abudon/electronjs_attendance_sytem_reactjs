///////////// IMPORTS ///////////////////
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') })
const { app, BrowserWindow, dialog } = require('electron');
const expressApp = require("./express_js/index.js");

///////////// VARIABLES ///////////////////
const onlineURL = process.env.ONLINE_URL;
const expressPort = process.env.EXPRESS_PORT;
let mainWindow;
let lastConnectionStatus = true;

///////////// FUNCTIONS ///////////////////



function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        transparent: true,
        icon: path.join(__dirname, 'assets/icons/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    //// REMOVE THE MENU BAR
    mainWindow.setMenuBarVisibility(false);

    // Check internet connectivity and load the appropriate screen
    loadContent();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

}

async function loadContent(){
    const isOnline = (await import('is-online')).default;
    const connected = await isOnline();

    if (connected) {
        mainWindow.loadURL(onlineURL)
            .then(() => console.log("URL loaded successfully"))
            .catch(e => console.log('Failed to load URL:', e));
    } else {
        mainWindow.loadFile(path.join(__dirname, 'no-internet.html'))
            .then(() => console.log("Fallback screen loaded"))
            .catch(e => console.log('Failed to load fallback screen:', e));
    }

   //

}
// Monitor internet connectivity
monitorConnectivity();
// alert message
function showAlert(message) {
    dialog.showMessageBox({
        type: 'info',
        title: 'Alert',
        message,
        buttons: ['OK'],
    });
}

function monitorConnectivity() {
    setInterval(async () => {
        const isOnline = (await import('is-online')).default;
        const connected = await isOnline();
        const currentURL = mainWindow.webContents.getURL();

        if (connected && !currentURL.includes(onlineURL)) {
            try {
                await mainWindow.loadURL(onlineURL);
                showAlert('Connection restored!');
                console.log("Reconnected: URL loaded successfully");
            } catch (e) {
                console.error("Failed to reload URL:", e);
            }
        }
        if (!connected && lastConnectionStatus){
            showAlert('no internet connection')
            await mainWindow.loadFile(path.join(__dirname, 'no-internet.html'))
        }
        lastConnectionStatus = connected;

    }, 10000); // Check connectivity every 10 seconds
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

// Enable the app to run on system startup
function enableAutoLaunch() {
    try {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe'),
        });
        console.log("Application set to run on system startup");
    } catch (e) {
        console.error("Failed to set application to startup:", e);
    }
}
///////////// CALLS AND LISTENERS ///////////////////
app.whenReady().then(async () => {
    createWindow();
    enableAutoLaunch();
    expressApp.listen(expressPort);
    setTimeout(() => {
        restoreWindow();
    }, 10000);
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



///////////// EXPORTS ///////////////////
