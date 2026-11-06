// main.js — Electron main process for Kodama.
//
// Hosts one window, binds the SmartSpectra IPC bridge (the SDK runs here, the
// renderer ships it camera frames), and grants the camera to our own bundled
// page only. Nothing is written to disk.

'use strict';

const path = require('path');
const { pathToFileURL } = require('url');
const { app, BrowserWindow, session, protocol, net } = require('electron');
const { bindSmartSpectraIpc } = require('@smartspectra/node-sdk/main');

// `npm start -- --file path/to/clip.mp4` replays a recorded clip instead of the webcam.
const fileArg = (() => {
  const i = process.argv.indexOf('--file');
  return i > -1 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : null;
})();
const VIDEO_EXT = /\.(mp4|webm|mov|mkv)$/i;
if (fileArg && !VIDEO_EXT.test(fileArg)) {
  console.error('--file must point to a video file (.mp4, .webm, .mov, .mkv)');
  process.exit(1);
}

// The replay clip is served under a fixed private URL, so the page never takes
// a path or URL from its query string (no user-controlled src, no redirection).
const REPLAY_SCHEME = 'kodama-replay';
protocol.registerSchemesAsPrivileged([
  { scheme: REPLAY_SCHEME, privileges: { standard: true, secure: true, stream: true, corsEnabled: true } },
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0e1424',
    title: 'Kodama',
    webPreferences: {
      preload: require.resolve('@smartspectra/node-sdk/preload'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });
  bindSmartSpectraIpc(win);
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e) => e.preventDefault());

  // The key stays on this machine: it is read from your environment and handed
  // to the local page. If it is not set, the consent screen asks for it and
  // keeps it in memory only.
  const query = {};
  if (process.env.SMARTSPECTRA_API_KEY) query.key = process.env.SMARTSPECTRA_API_KEY;
  if (fileArg) query.replay = '1';
  win.loadFile(path.join(__dirname, 'index.html'), { query });
}

app.whenReady().then(() => {
  if (fileArg) {
    protocol.handle(REPLAY_SCHEME, async () => {
      const res = await net.fetch(pathToFileURL(fileArg).toString());
      const headers = new Headers(res.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      return new Response(res.body, { status: res.status, headers });
    });
  }
  // Camera only (no microphone), and only for our own local page.
  session.defaultSession.setPermissionRequestHandler((wc, permission, callback, details) => {
    const url = (details && details.requestingUrl) || (wc && wc.getURL()) || '';
    const types = (details && details.mediaTypes) || [];
    const cameraOnly = types.length === 1 && types[0] === 'video';
    callback(permission === 'media' && cameraOnly && url.startsWith('file://'));
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
