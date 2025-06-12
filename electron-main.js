const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const path = require('path')

// Keep a global reference of the window object
let mainWindow

function createWindow () {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/favicon-32x32.png')
  })
  mainWindow.autoHideMenuBar = true;

  // Load the index.html file
  mainWindow.loadFile('index.html')

  // Open the DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  let emitEvent = (eventName) => {
    mainWindow.webContents.executeJavaScript(`
      try {
        document.dispatchEvent(new Event('${eventName}'));
      } catch (error) {
        console.error('Error in ${eventName} shortcut:', error);
        throw error;
      }
    `).catch(err => console.error(`Error executing ${eventName}:`, err))
  }

  // Register global shortcuts
  globalShortcut.register('w', () => {
    mainWindow.close()
  })

  globalShortcut.register('escape', () => {
    emitEvent('toggleFullscreen')
  })

  globalShortcut.register('up', () => {
    emitEvent('randomIntervalUp')
  })

  globalShortcut.register('down', () => {
    emitEvent('randomIntervalDown')
  })

  globalShortcut.register('left', () => {
    emitEvent('randomIntervalOff')
  })

  // Listen for IPC messages from renderer
  ipcMain.on('renderer-log', (event, ...args) => {
    console.log('Renderer:', ...args);
  });

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow)

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On macOS, keep the app running even when all windows are closed
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS, re-create a window when the dock icon is clicked
  if (mainWindow === null) createWindow()
})

// Unregister all shortcuts when the app is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
}) 
