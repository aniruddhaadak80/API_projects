// renderer.js — Kodama's window. Bundled by esbuild into dist/renderer.bundle.js.
//
// Flow: consent screen → SmartSpectra session (webcam, or a clip with --file)
// → every 'metrics' event feeds the Brain → the Scene paints at 60 fps.

'use strict';

const {
  SmartSpectraSDK, ProcessingStatus, ValidationCode,
  breathingMetrics, cardioMetrics, faceMetrics,
} = require('@smartspectra/node-sdk/renderer');
const { decodeMetrics } = require('@smartspectra/node-sdk/messages');

const { Brain } = window.KodamaBrain;
const { Scene } = window.KodamaScene;

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const canvas = $('world');
const ctx = canvas.getContext('2d');

let brain = new Brain();
let scene = new Scene();
let sdk = null;
let running = false;

// ---- consent ---------------------------------------------------------------
if (params.get('key')) $('key-row').hidden = true;
const keyOk = () => !!(params.get('key') || $('key').value.trim());
const refresh = () => { $('start').disabled = !($('agree').checked && keyOk()); };
$('agree').addEventListener('change', refresh);
$('key').addEventListener('input', refresh);
$('start').addEventListener('click', start);

// ---- session ---------------------------------------------------------------
async function start() {
  $('consent').hidden = true;
  $('controls').hidden = false;
  brain = new Brain();
  scene = new Scene();

  sdk = new SmartSpectraSDK({
    apiKey: params.get('key') || $('key').value.trim(),
    requestedMetrics: [...breathingMetrics, ...cardioMetrics, ...faceMetrics],
    enableTelemetry: $('telemetry').checked,   // off unless the user opted in
  });

  sdk.on('metrics', (buf) => {
    try { brain.ingest(decodeMetrics(buf)); } catch (e) { console.error('decode failed', e); }
  });
  sdk.on('validationStatus', (code, _ts, hint) => brain.validation(code === ValidationCode.kOk, hint));
  sdk.on('processingStatus', (s) => { if (s === ProcessingStatus.kIdle && running) stop(); });
  sdk.on('error', (code, message) => showError(`SmartSpectra error ${code}: ${message}`));
  sdk.on('streamAvailable', (stream) => {
    $('preview').srcObject = stream; $('preview').hidden = false; $('preview').play().catch(() => {});
  });

  try {
    const file = params.get('file');
    if (file && /^(https?:\/\/|\/|blob:|data:video\/)/.test(file)) {
      // Replay mode: play the clip and hand its frames to the SDK as a stream.
      const v = $('preview');
      v.src = file; v.hidden = false; v.loop = false;
      await v.play();
      sdk.useMediaStream(v.captureStream());
    }
    await sdk.start();     // webcam mode: the SDK opens the camera and emits 'streamAvailable'
    running = true;
  } catch (e) {
    showError(e.message || String(e));
  }
}

async function stop() {
  running = false;
  try { if (sdk) await sdk.stop(); } catch (_) { /* already stopped */ }
  try { if (sdk) sdk.destroy(); } catch (_) { /* already destroyed */ }
  sdk = null;
  $('preview').srcObject = null; $('preview').hidden = true;
  $('controls').hidden = true; $('nudge').hidden = true;
  $('consent').hidden = false;
  // Nothing to clean up on disk: Kodama never wrote anything.
}

function showError(text) { const e = $('error'); e.textContent = text; e.hidden = false; }

$('stop').addEventListener('click', stop);
$('breathe').addEventListener('click', () => brain.startGuide());
$('pip').addEventListener('click', () => {
  const v = $('preview'); v.style.visibility = v.style.visibility === 'hidden' ? 'visible' : 'hidden';
  $('pip').textContent = v.style.visibility === 'hidden' ? 'Show camera' : 'Hide camera';
});
$('nudge-yes').addEventListener('click', () => { brain.acceptNudge(); $('nudge').hidden = true; });
$('nudge-no').addEventListener('click', () => { brain.dismissNudge(); $('nudge').hidden = true; });

// ---- paint loop ------------------------------------------------------------
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  const dpr = window.devicePixelRatio || 1;
  const W = innerWidth, H = innerHeight;
  if (canvas.width !== W * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (running) brain.step(dt);
  $('nudge').hidden = brain.mode !== 'nudge';
  scene.draw(ctx, W, H, brain, dt, { hud: running });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
