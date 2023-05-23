const axios = require('axios');

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDev = true;

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, "./renderer/index.html"));
};

app.whenReady().then(() => {
  ipcMain.handle('axios.openAI', openAI)

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//main function
async function openAI(event, sentence) {
  let res = null;

  await axios ({
    method: 'post',
    url: 'https://api.openai.com/v1/completions',
    data: {
      "model": "text-davinci-003",
      "prompt": "Convert my short hand into a first-hand account of the meeting:\n\nTom: Profits up 50%\nJane: New servers are online\nKjel: Need more time to fix software\nJane: Happy to help\nParkman: Beta testing almost done" +sentence,
      "temperature": 0,
      "max_tokens": 64,
      "top_p": 1.0,
      "frequency_penalty": 0.0,
      "presence_penalty": 0.0
  },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  }
  }).then(function (response) {
    res = response.data;
  })
  .catch(function(error) {
    res = error;
  });

  return res;
}