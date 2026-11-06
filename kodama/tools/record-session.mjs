// record-session.mjs — run a recorded clip through the real SmartSpectra SDK
// (headless, no camera) and save every signal Kodama would have received.
//
//   SMARTSPECTRA_API_KEY=... node tools/record-session.mjs clip.mp4 session.json
//
// The output holds measured values for the person in the clip, so only use
// footage you have the rights and consent to analyse (this repo's demo uses a
// stock clip licensed for reuse). Telemetry is turned off.

import fs from 'node:fs';
import {
  SmartSpectraSDK, ProcessingStatus, ValidationCode,
  breathingMetrics, cardioMetrics, faceMetrics,
} from '@smartspectra/node-sdk';
import { Metrics, decodeMetrics } from '@smartspectra/node-sdk/messages';

const [clip, out = 'session.json'] = process.argv.slice(2);
if (!clip || !process.env.SMARTSPECTRA_API_KEY) {
  console.error('usage: SMARTSPECTRA_API_KEY=... node tools/record-session.mjs clip.mp4 [session.json]');
  process.exit(2);
}

const sdk = new SmartSpectraSDK({
  apiKey: process.env.SMARTSPECTRA_API_KEY,
  requestedMetrics: [...breathingMetrics, ...cardioMetrics, ...faceMetrics],
  enableTelemetry: false,
});

const events = [];
const okName = Object.fromEntries(Object.entries(ValidationCode).map(([k, v]) => [v, k]));
const toObj = (m) => Metrics.toObject(m, { longs: Number, enums: Number, defaults: false });

sdk.on('metrics', (buf, ts) => {
  const m = toObj(decodeMetrics(buf));
  delete m.face?.landmarks;           // 478 points per frame: not needed by Kodama, keeps the file small
  events.push({ ts: Number(ts), type: 'metrics', m });
});
sdk.on('validationStatus', (code, ts, hint) =>
  events.push({ ts: Number(ts), type: 'validation', ok: code === ValidationCode.kOk, code: okName[code], hint: hint || null }));
sdk.on('error', (code, message) => { console.error('SmartSpectra error', code, message); process.exitCode = 1; });

const done = new Promise((resolve) => {
  let started = false;
  sdk.on('processingStatus', (s) => {
    if (s === ProcessingStatus.kRunning) started = true;
    if (started && (s === ProcessingStatus.kIdle || s === ProcessingStatus.kError)) resolve();
  });
});

const t0 = Date.now();
sdk.useFile(clip);
sdk.start();
await done;
await sdk.destroy();

const firstTs = Math.min(...events.map((e) => e.ts).filter((x) => x > 0));
for (const e of events) e.t = (e.ts - firstTs) / 1e6;   // seconds into the clip
const count = (f) => events.filter((e) => e.type === 'metrics' && f(e.m)).length;
const summary = {
  clip, seconds: Math.max(...events.map((e) => e.t)), wallSeconds: (Date.now() - t0) / 1000,
  payloads: events.filter((e) => e.type === 'metrics').length,
  withBreathingRate: count((m) => m.breathing?.rate?.length),
  withPulse: count((m) => m.cardio?.pulseRate?.length),
  withHrv: count((m) => m.cardio?.hrv?.length),
  withExpression: count((m) => m.face?.expression?.length),
};
fs.writeFileSync(out, JSON.stringify({ summary, events }));
console.log(JSON.stringify(summary, null, 2));
