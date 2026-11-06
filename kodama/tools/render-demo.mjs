// render-demo.mjs — turn a recorded SmartSpectra session into a demo video.
//
//   node tools/render-demo.mjs clip.mp4 session.json demo.mp4 [--guide-at 34] [--calibration 15]
//
// Every number and every reaction in the video comes from session.json, i.e.
// from the real SDK run on that clip; this script only replays it through the
// same Brain + Scene the app uses, frame by frame, with the clip in the corner.

import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createCanvas } = require('@napi-rs/canvas');
const { Brain } = require('../src/brain.js');
const { Scene } = require('../src/scene.js');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i > -1 ? Number(args[i + 1]) : d; };
const [clip, sessionPath, out = 'demo.mp4'] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const guideAt = flag('--guide-at', null);
const W = 1280, H = 720, FPS = 30, PW = 170, PH = 322;

const { events, summary } = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
events.sort((a, b) => a.t - b.t);
const duration = summary.seconds;

const brain = new Brain({ calibrationS: flag('--calibration', 15) });
const scene = new Scene();
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

const dec = spawn('ffmpeg', ['-loglevel', 'error', '-i', clip, '-vf', `fps=${FPS},scale=${PW}:${PH}`, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']);
const enc = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', out]);

const frameBytes = PW * PH * 4;
let pending = Buffer.alloc(0);
const frames = [];
let decEnded = false;
dec.stdout.on('data', (d) => {
  pending = Buffer.concat([pending, d]);
  while (pending.length >= frameBytes) { frames.push(pending.subarray(0, frameBytes)); pending = pending.subarray(frameBytes); }
});
dec.on('close', () => { decEnded = true; });

const waitFrame = () => new Promise((res) => {
  const tick = () => (frames.length || decEnded) ? res(frames.shift() || null) : setTimeout(tick, 5);
  tick();
});
const write = (buf) => new Promise((res) => (enc.stdin.write(buf) ? res() : enc.stdin.once('drain', res)));

let ei = 0, lastPip = null, guided = false;
const total = Math.ceil(duration * FPS);
for (let f = 0; f < total; f++) {
  const T = f / FPS;
  while (ei < events.length && events[ei].t <= T) {
    const e = events[ei++];
    if (e.type === 'metrics') brain.ingest(e.m);
    else if (e.type === 'validation') brain.validation(e.ok, e.hint);
  }
  if (guideAt != null && !guided && T >= guideAt) { brain.startGuide(); guided = true; }
  brain.step(1 / FPS);
  scene.draw(ctx, W, H, brain, 1 / FPS);

  // the input clip, picture-in-picture
  const px = await waitFrame();
  if (px) lastPip = px;
  if (lastPip) {
    const img = ctx.createImageData(PW, PH);
    img.data.set(lastPip);
    ctx.putImageData(img, W - PW - 20, 20);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(W - PW - 20, 20, PW, PH);
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '13px sans-serif';
  ctx.fillText('input: stock clip (Pexels)', W - PW - 20, PH + 40);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '16px sans-serif';
  ctx.fillText(`Kodama · live Presage SmartSpectra signals · ${T.toFixed(1)} s`, 20, 32);
  if (guided && brain.mode === 'guide') { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText('▶ clicked “Breathe with Kodama”', 20, 56); }

  const data = ctx.getImageData(0, 0, W, H).data;
  await write(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
}
enc.stdin.end();
await new Promise((r) => enc.on('close', r));
dec.kill();
console.log(`wrote ${out} (${total} frames, ${duration.toFixed(1)} s); leaves grown: ${brain.leaves}`);
