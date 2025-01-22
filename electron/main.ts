import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import electronReload from 'electron-reload'

// Enable live reload for all the files inside your project directory
electronReload(path.join(__dirname, '..'), {
    // On Windows and Linux, the path should use the appropriate executable name
    electron: process.platform === 'win32' 
        ? path.join(__dirname, '..', 'node_modules', '.bin', 'electron.cmd')
        : path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    })

    // In development, load from the Vite dev server
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000')
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}) 