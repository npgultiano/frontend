// Imported Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

// Main Window
const isDev = true;

const createWindow = () => {
  const win = new BrowserWindow({
    width: isDev ? 1200 : 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.resolve(__dirname, "./renderer/index.html"));
};

app.whenReady().then(() => {
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

// Main function
async function openAI(event, notes) {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.openai.com/v1/completions",
      data: {
        model: "text-davinci-003",
        prompt: "Convert to notes" + notes,
        temperature: 0,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.APIKEY_OPENAI,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

ipcMain.handle("axios.openAI", async (event, notes) => {
  try {
    const result = await openAI(event, notes);
    return result;
  } catch (error) {
    throw error;
  }
});
