// scene.js — draws Kodama's little world on a 2D canvas.
//
// Pure Canvas 2D: the same code paints the Electron window and the Node demo
// renderer (@napi-rs/canvas). All state comes from a Brain instance.

'use strict';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function lerp(a, b, t) { return a + (b - a) * t; }
function mix(c1, c2, t) {
  return `rgb(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(lerp(c1[2], c2[2], t))})`;
}

// Build the bonsai once: a list of branch segments and the leaf clusters they
// can carry, in the order they are allowed to appear.
function buildTree(seed = 7) {
  const r = rng(seed);
  const segs = [];
  const tips = [];
  function grow(x, y, ang, len, w, depth) {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    const bend = (r() - 0.5) * len * 0.35;
    segs.push({ x, y, x2, y2, cx: (x + x2) / 2 + bend, cy: (y + y2) / 2, w, depth });
    if (depth >= 5 || len < 14) { tips.push({ x: x2, y: y2, depth }); return; }
    const n = depth < 2 ? 2 : (r() < 0.6 ? 2 : 3);
    for (let i = 0; i < n; i++) {
      const spread = 0.45 + r() * 0.35;
      const a = ang + (i - (n - 1) / 2) * spread + (r() - 0.5) * 0.25;
      grow(x2, y2, a, len * (0.66 + r() * 0.12), w * 0.66, depth + 1);
    }
    if (depth >= 2) tips.push({ x: x2, y: y2, depth });
  }
  // classic informal-upright bonsai: trunk leans, then sweeps back
  grow(0, 0, -Math.PI / 2 - 0.25, 78, 24, 0);
  // order leaf clusters from the inside out so the canopy fills naturally
  tips.sort((a, b) => (a.depth - b.depth) || (Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y)));
  const leaves = tips.map((t, i) => ({ ...t, rad: 13 + r() * 10, hue: r(), phase: r() * 6.28, i }));
  return { segs, leaves };
}

class Scene {
  constructor(seed = 7) {
    this.tree = buildTree(seed);
    const r = rng(seed + 1);
    this.flies = Array.from({ length: 40 }, () => ({ x: r(), y: r() * 0.7, p: r() * 6.28, s: 0.3 + r() }));
    this.stars = Array.from({ length: 70 }, () => ({ x: r(), y: r() * 0.55, a: r() }));
    this.petals = [];
    this._r = rng(seed + 2);
    this.heart = 0;               // lantern glow phase, beats at your pulse
    this.baseLeaves = 6;          // a seedling always has a few leaves
  }

  draw(ctx, W, H, b, dt = 1 / 30, opts = {}) {
    const t = b.t;
    const calm = b.calm;
    const bpm = b.pulse ? b.pulse.value : 66;
    this.heart += dt * bpm / 60;

    // --- sky: calm → clear night, restless → hazy amber dusk -------------
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix([92, 58, 54], [14, 20, 44], calm));
    g.addColorStop(0.6, mix([150, 96, 70], [30, 44, 78], calm));
    g.addColorStop(1, mix([60, 44, 40], [12, 18, 30], calm));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    for (const s of this.stars) {
      const a = calm * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.8 + s.a * 20)));
      ctx.fillStyle = `rgba(255,255,240,${a * 0.8})`;
      ctx.fillRect(s.x * W, s.y * H, 1.6, 1.6);
    }
    // mist when restless
    if (calm < 0.6) {
      const mg = ctx.createLinearGradient(0, H * 0.35, 0, H);
      mg.addColorStop(0, 'rgba(255,214,170,0)');
      mg.addColorStop(1, `rgba(255,214,170,${(0.6 - calm) * 0.35})`);
      ctx.fillStyle = mg; ctx.fillRect(0, H * 0.35, W, H * 0.65);
    }

    // --- ground + moss stone -----------------------------------------------
    ctx.fillStyle = mix([70, 52, 40], [20, 30, 34], calm);
    ctx.beginPath(); ctx.ellipse(W / 2, H * 0.98, W * 0.7, H * 0.16, 0, 0, Math.PI * 2); ctx.fill();

    // --- stone lantern: its light beats with your pulse ----------------------
    const lx = W * 0.17, ly = H * 0.72;
    const beat = Math.pow(Math.max(0, Math.sin(this.heart * Math.PI * 2)), 6);
    const glow = ctx.createRadialGradient(lx, ly - 52, 2, lx, ly - 52, 90 + beat * 30);
    glow.addColorStop(0, `rgba(255,190,110,${0.55 + beat * 0.4})`);
    glow.addColorStop(1, 'rgba(255,190,110,0)');
    ctx.fillStyle = glow; ctx.fillRect(lx - 140, ly - 190, 280, 280);
    ctx.fillStyle = '#5b5e66';
    ctx.fillRect(lx - 8, ly - 30, 16, 50);
    ctx.fillRect(lx - 26, ly + 18, 52, 10);
    ctx.fillRect(lx - 22, ly - 70, 44, 40);
    ctx.fillStyle = `rgba(255,200,120,${0.6 + beat * 0.4})`;
    ctx.fillRect(lx - 12, ly - 62, 24, 24);
    ctx.fillStyle = '#5b5e66';
    ctx.beginPath(); ctx.moveTo(lx - 38, ly - 70); ctx.lineTo(lx, ly - 96); ctx.lineTo(lx + 38, ly - 70); ctx.closePath(); ctx.fill();

    // --- the bonsai ---------------------------------------------------------
    const ox = W * 0.52, oy = H * 0.76, sc = H / 430;
    const sway = (b.breathPhase - 0.5) * 0.04 + Math.sin(t * 0.6) * 0.01;
    ctx.save();
    ctx.translate(ox, oy); ctx.scale(sc, sc);
    ctx.lineCap = 'round';
    for (const s of this.tree.segs) {
      const k = s.depth * sway;
      ctx.strokeStyle = s.depth < 2 ? '#4a3427' : '#5c4130';
      ctx.lineWidth = Math.max(2.2, s.w);
      ctx.beginPath();
      ctx.moveTo(s.x + s.y * -k * 0.2, s.y);
      ctx.quadraticCurveTo(s.cx - s.cy * k * 0.3, s.cy, s.x2 - s.y2 * k * 0.4, s.y2);
      ctx.stroke();
    }
    const shown = Math.min(this.tree.leaves.length, this.baseLeaves + b.leaves);
    for (let i = 0; i < shown; i++) {
      const L = this.tree.leaves[i];
      const k = L.depth * sway;
      const lxx = L.x - L.y * k * 0.4, lyy = L.y;
      const fresh = i >= shown - 1 ? 0.6 + 0.4 * Math.min(1, (b.growth % 1) * 3) : 1;
      const pulse = 1 + 0.04 * Math.sin(t * 1.3 + L.phase) + (b.breathPhase - 0.5) * 0.06;
      const green = mix([92, 140, 70], [70, 160, 96], L.hue);
      ctx.fillStyle = green;
      ctx.globalAlpha = 0.92;
      ctx.beginPath(); ctx.arc(lxx, lyy, L.rad * pulse * fresh, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(200,255,190,0.18)';
      ctx.beginPath(); ctx.arc(lxx - 4, lyy - 5, L.rad * 0.55 * pulse * fresh, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      if (b.blossoming && i % 2 === 0) {
        ctx.fillStyle = 'rgba(255,182,206,0.95)';
        ctx.beginPath(); ctx.arc(lxx + 6, lyy - 4, 5, 0, Math.PI * 2); ctx.fill();
        if (this._r() < 0.04) this.petals.push({ x: ox + lxx * sc, y: oy + lyy * sc, vx: 10 + this._r() * 20, vy: 12 + this._r() * 10, a: 1, rot: this._r() * 6 });
      }
    }
    ctx.restore();

    // pot
    ctx.fillStyle = '#6b3b2e';
    ctx.beginPath();
    ctx.moveTo(ox - 120 * sc, oy); ctx.lineTo(ox + 120 * sc, oy);
    ctx.lineTo(ox + 96 * sc, oy + 52 * sc); ctx.lineTo(ox - 96 * sc, oy + 52 * sc); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7d4637'; ctx.fillRect(ox - 132 * sc, oy - 10 * sc, 264 * sc, 14 * sc);
    ctx.fillStyle = '#3f6b3a'; ctx.fillRect(ox - 118 * sc, oy - 14 * sc, 236 * sc, 6 * sc);

    // petals
    for (const p of this.petals) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.a -= dt * 0.2; p.rot += dt * 2;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = `rgba(255,190,210,${Math.max(0, p.a)})`;
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    this.petals = this.petals.filter((p) => p.a > 0 && p.y < H);

    // fireflies: more of them as the tree grows
    const nf = Math.min(this.flies.length, 4 + b.leaves * 2);
    for (let i = 0; i < nf; i++) {
      const f = this.flies[i];
      const x = (f.x + Math.sin(t * 0.2 * f.s + f.p) * 0.05) * W;
      const y = (0.25 + f.y * 0.6 + Math.cos(t * 0.3 * f.s + f.p) * 0.03) * H;
      const a = 0.4 + 0.6 * Math.max(0, Math.sin(t * 2 * f.s + f.p));
      ctx.fillStyle = `rgba(220,255,140,${a * calm})`;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
    }

    // --- Kodama, sitting on the pot rim, breathing with you ------------------
    this.drawKodama(ctx, ox + 96 * sc, oy - 12 * sc, sc * 0.8, b);

    // --- guided breathing orb ---------------------------------------------
    const gt = b.guideTarget();
    if (gt != null) this.drawGuide(ctx, W, H, b, gt);

    // --- speech bubble ------------------------------------------------------
    let say = null;
    if (b.hint) say = b.hint;
    else if (b.mode === 'calibrating') say = 'Hi. Sit still a moment so I can learn your calm…';
    else if (b.mode === 'nudge') say = 'I feel restless. Breathe with me for a minute?';
    else if (b.mode === 'guide') say = (b.t - b.guideStart) % 10 < 4 ? 'Breathe in…' : 'and out…';
    else if (b.talking) say = '(listening)';
    if (say) this.drawBubble(ctx, ox + 96 * sc, oy - 92 * sc, say, sc * 0.8);

    if (opts.hud !== false) this.drawHud(ctx, W, H, b);
  }

  drawKodama(ctx, x, y, sc, b) {
    const breath = b.mode === 'guide' ? (b.guideTarget() ?? 0.5) * 0.5 + b.breathPhase * 0.5 : b.breathPhase;
    const bodyH = (34 + breath * 10) * sc, bodyW = (26 + breath * 4) * sc;
    const tilt = b.talking ? 0.25 : Math.sin(b.t * 0.7) * 0.06;
    ctx.save();
    ctx.translate(x, y);
    // soft glow, stronger when calm
    const gl = ctx.createRadialGradient(0, -bodyH, 2, 0, -bodyH, 70 * sc);
    gl.addColorStop(0, `rgba(230,255,240,${0.12 + b.calm * 0.25})`);
    gl.addColorStop(1, 'rgba(230,255,240,0)');
    ctx.fillStyle = gl; ctx.fillRect(-80 * sc, -bodyH - 80 * sc, 160 * sc, 160 * sc);
    ctx.fillStyle = '#f2f5ef';
    ctx.beginPath(); ctx.ellipse(0, -bodyH / 2, bodyW / 2, bodyH / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(tilt);
    const hy = -bodyH - 16 * sc;
    ctx.beginPath(); ctx.ellipse(0, hy, 24 * sc, 20 * sc, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1b1d22';
    const eyeH = b.blinking ? 0.6 * sc : 3.6 * sc;
    ctx.beginPath(); ctx.ellipse(-8 * sc, hy - 2 * sc, 3.6 * sc, eyeH, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8 * sc, hy - 2 * sc, 3.6 * sc, eyeH, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    if (b.blossoming) { ctx.arc(0, hy + 7 * sc, 4 * sc, 0, Math.PI); ctx.fill(); }
    else ctx.ellipse(0, hy + 8 * sc, 2.4 * sc, 3 * sc, 0, 0, Math.PI * 2), ctx.fill();
    ctx.restore();
  }

  drawGuide(ctx, W, H, b, gt) {
    const cx = W * 0.82, cy = H * 0.32, R = Math.min(W, H) * 0.12;
    ctx.strokeStyle = 'rgba(200,240,255,0.35)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(160,220,255,0.25)';
    ctx.beginPath(); ctx.arc(cx, cy, R * (0.35 + 0.65 * gt), 0, Math.PI * 2); ctx.fill();
    // your own chest, from the SmartSpectra breathing trace
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, R * (0.35 + 0.65 * b.breathPhase), 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = `${Math.round(H * 0.022)}px sans-serif`; ctx.textAlign = 'center';
    ctx.fillText('blue = Kodama · white ring = you', cx, cy + R + H * 0.04);
    ctx.textAlign = 'left';
  }

  drawBubble(ctx, x, y, text, sc) {
    ctx.font = `${Math.round(15 * sc)}px sans-serif`;
    const w = ctx.measureText(text).width + 24 * sc, h = 32 * sc;
    const bx = Math.min(Math.max(x - w / 2, 8), 2000), by = y - h;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, w, h, 12 * sc); else ctx.rect(bx, by, w, h);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 6 * sc, by + h); ctx.lineTo(x, by + h + 9 * sc); ctx.lineTo(x + 6 * sc, by + h); ctx.fill();
    ctx.fillStyle = '#222'; ctx.fillText(text, bx + 12 * sc, by + h * 0.66);
  }

  drawHud(ctx, W, H, b) {
    const s = H / 720;
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.fillRect(16 * s, H - 150 * s, 330 * s, 134 * s);
    ctx.fillStyle = '#eef'; ctx.font = `${Math.round(17 * s)}px sans-serif`;
    const br = b.breathRate ? `${b.breathRate.value.toFixed(1)} /min` : 'warming up (30 s)…';
    let pr = b.pulse ? `${Math.round(b.pulse.value)} bpm` : 'warming up…';
    if (b.pulse && b.baseline) {
      const rel = Math.round((b.pulse.value / b.baseline - 1) * 100);
      pr += `  (${rel >= 0 ? '+' : ''}${rel}% vs your calm)`;
    }
    ctx.fillText(`Breathing  ${br}`, 30 * s, H - 120 * s);
    ctx.fillText(`Pulse         ${pr}`, 30 * s, H - 94 * s);
    ctx.fillText(`Leaves grown  ${b.leaves}`, 30 * s, H - 68 * s);
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(30 * s, H - 52 * s, 290 * s, 8 * s);
    ctx.fillStyle = mix([255, 170, 90], [140, 230, 170], b.calm); ctx.fillRect(30 * s, H - 52 * s, 290 * s * b.calm, 8 * s);
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = `${Math.round(11 * s)}px sans-serif`;
    ctx.fillText('calm · a wellness toy, not a medical device', 30 * s, H - 26 * s);
  }
}

const api = { Scene, buildTree };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.KodamaScene = api;
