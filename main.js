const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
let locals = {
  nav: [
    { slug: '', icon: 'home', path: '/' },
    { slug: 'New preview', icon: 'plus-square-o', path: '/new-embed' },
    { slug: 'My previews', icon: 'history', path: '/preview-list' },
  ],
  options: ['first', 'second']
}
const pug = require('electron-pug')({pretty: true}, locals);
// const pug = require('pug')




// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    // frame: false,
    titleBarStyle: 'hidden', // hides titlebar
    // transparent: true // makes whole window transparent
  })

  // and load the index.html of the app.
    // mainWindow.loadURL(`file://${__dirname}/views/home.pug`);
  mainWindow.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, 'views/home.pug'),
    // slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

electron.ipcMain.on('openstuff', (e) => {
  const reply = x => e.sender.send('reply', x)
  electron.dialog.showOpenDialog(mainWindow, {properties: ['openDirectory']}, reply)
})


electron.ipcMain.on('dostuff', (e, args) => {
  console.log(args)
  const reply = x => e.sender.send('reply', x)
  reply(require(`./src/${args[0]}`)({ name: args[1] }))
})

electron.ipcMain.on('goToTest', (e, args) => {
  mainWindow.loadURL(url.format({
    // pathname: path.join(__dirname, 'test.html'),
    pathname: pug.render(path.join(__dirname, 'test.html')),
    protocol: 'file:',
    slashes: true
  }))
})

electron.ipcMain.on('updatelocals', (e, args) => {
  locals[args[0]] = args[1]
  mainWindow.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, `views/${args[2]}.pug`),
    // slashes: true
  }))
})
