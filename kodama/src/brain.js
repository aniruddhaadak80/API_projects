// brain.js — turns SmartSpectra signals into Kodama's mood.
//
// Pure logic, no DOM and no SDK imports, so it runs the same in the Electron
// renderer, in Node (tests, demo renderer) and in a browser replay.
//
// Everything is relative to *you*: pulse is compared with your own first
// minute, never with a population "normal". Kodama is a wellness toy, not a
// medical device, and nothing here is a diagnosis.

'use strict';

const CALIBRATION_S = 45;          // seconds used to learn your resting pulse
const CALM_BREATH = 9;             // breaths/min at or below which breathing counts as fully calm
const BUSY_BREATH = 18;            // breaths/min at or above which it counts as not calm
const PULSE_SPAN = 0.15;           // +15% over your own baseline = not calm
const GROW_PER_LEAF = 4;           // seconds of full calm per new leaf cluster
const RESTLESS_HOLD_S = 60;        // how long restlessness must last before Kodama offers a breath
const NUDGE_COOLDOWN_S = 300;      // never nag more than once per 5 minutes
const GUIDE_S = 60;                // length of a guided breathing round
const GUIDE_IN = 4, GUIDE_OUT = 6; // 4s in, 6s out = 6 breaths/min

function clamp(x, a = 0, b = 1) { return Math.max(a, Math.min(b, x)); }
function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function last(arr) { return arr && arr.length ? arr[arr.length - 1] : null; }
function tsNum(ts) {
  if (ts == null) return 0;
  if (typeof ts === 'number') return ts;
  if (typeof ts === 'bigint') return Number(ts);
  if (typeof ts.toNumber === 'function') return ts.toNumber();
  return Number(ts);
}

// Index = presage.smartspectra.ExpressionType enum value.
const EXPRESSIONS = ['neutral', 'anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise'];

class Brain {
  // opts.calibrationS: seconds used to learn your resting pulse (default 45).
  constructor(opts = {}) { this.calibrationS = opts.calibrationS || CALIBRATION_S; this.reset(); }

  reset() {
    this.t = 0;                       // seconds since session start (host clock)
    this.breathRate = null;           // { value, confidence }
    this.pulse = null;                // { value, confidence }
    this.hrv = null;                  // latest Hrv message
    this.breathTrace = [];            // [{t, v}] last ~20 s of upper-chest trace
    this.breathPhase = 0.5;           // 0..1 normalised chest position (drives Kodama's belly)
    this.expression = null;           // { name, p }
    this.blinkUntil = 0;
    this.talking = false;
    this.hint = null;                 // validation hint text for the speech bubble
    this.pulseSamples = [];
    this.baseline = null;             // your own resting pulse
    this.calm = 0;                    // 0..1, smoothed
    this.growth = 0;                  // leaf clusters earned (float)
    this.blossomUntil = 0;
    this.restlessFor = 0;
    this.lastNudgeAt = -1e9;
    this.mode = 'calibrating';        // calibrating | idle | nudge | guide
    this.guideStart = 0;
    this.events = [];                 // short log for the HUD ("a leaf opened")
    this._lastLeaf = 0;
  }

  // Feed one decoded Metrics payload (a windowed slice from the 'metrics' event).
  ingest(m) {
    if (!m || Buffer_isBuffer(m)) return;
    const br = last(m.breathing && m.breathing.rate);
    if (br && br.confidence > 0) this.breathRate = { value: br.value, confidence: br.confidence };

    const tr = m.breathing && m.breathing.upperTrace;
    if (tr && tr.length) {
      for (const s of tr) this.breathTrace.push({ t: tsNum(s.timestamp) / 1e6, v: s.value });
      const tEnd = this.breathTrace[this.breathTrace.length - 1].t;
      while (this.breathTrace.length && this.breathTrace[0].t < tEnd - 20) this.breathTrace.shift();
      this._updateBreathPhase();
    }

    const pr = last(m.cardio && m.cardio.pulseRate);
    if (pr && pr.confidence > 0) {
      this.pulse = { value: pr.value, confidence: pr.confidence };
      if (this.t <= this.calibrationS) this.pulseSamples.push(pr.value);
    }
    const hrv = last(m.cardio && m.cardio.hrv);
    if (hrv && hrv.confidence > 0) this.hrv = hrv;

    const face = m.face;
    if (face) {
      const ex = last(face.expression);
      if (ex && ex.scores && ex.scores.length) {
        // ExpressionScore.confidence is a percentage 0..100; type is the ExpressionType enum.
        let best = null;
        for (const s of ex.scores) {
          const name = EXPRESSIONS[s.type] || 'neutral';
          const p = (s.confidence || 0) / 100;
          if (!best || p > best.p) best = { name, p };
        }
        if (best) this.expression = best;
        if (best && best.name === 'happiness' && best.p > 0.6) this.blossomUntil = this.t + 6;
      }
      const bl = last(face.blinking);
      if (bl && bl.detected) this.blinkUntil = this.t + 0.18;
      const tk = last(face.talking);
      if (tk) this.talking = !!tk.detected;
    }
  }

  // Validation feedback from the SDK ('validationStatus' event).
  validation(ok, hint) { this.hint = ok ? null : (hint || 'Kodama can\'t quite see you'); }

  _updateBreathPhase() {
    const xs = this.breathTrace.map((s) => s.v);
    const lo = Math.min(...xs), hi = Math.max(...xs);
    const v = xs[xs.length - 1];
    this.breathPhase = hi - lo > 1e-9 ? (v - lo) / (hi - lo) : 0.5;
  }

  // Advance the clock. Returns nothing; read state off the instance.
  step(dt) {
    this.t += dt;

    if (this.mode === 'calibrating' && this.t >= this.calibrationS) {
      this.baseline = median(this.pulseSamples) || (this.pulse && this.pulse.value) || null;
      this.mode = 'idle';
      this._log(this.baseline ? `Kodama learned your resting pulse (~${Math.round(this.baseline)} bpm)` : 'Kodama is ready');
    }

    // Calm score: breathing slowness and pulse relative to your own baseline.
    let parts = [];
    if (this.breathRate) parts.push(clamp((BUSY_BREATH - this.breathRate.value) / (BUSY_BREATH - CALM_BREATH)));
    if (this.pulse && this.baseline) {
      const rel = this.pulse.value / this.baseline - 1;
      parts.push(clamp(1 - rel / PULSE_SPAN));
    } else if (this.pulse && this.mode === 'calibrating') {
      parts.push(0.6);
    }
    const target = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0.5;
    const k = 1 - Math.exp(-dt / 3);           // ~3 s smoothing so the tree never twitches
    this.calm += (target - this.calm) * k;

    // Growth: only real, sustained calm grows the tree.
    if (this.calm > 0.55 && !this.talking) {
      this.growth += dt * (this.calm - 0.4) / (0.6 * GROW_PER_LEAF);
      const leaves = Math.floor(this.growth);
      if (leaves > this._lastLeaf) { this._lastLeaf = leaves; this._log('A new leaf opened'); }
    }

    // Restlessness → a gentle, rate-limited offer to breathe together.
    const restless = this.mode !== 'calibrating' && this.calm < 0.3;
    this.restlessFor = restless ? this.restlessFor + dt : Math.max(0, this.restlessFor - dt * 2);
    if (this.mode === 'idle' && this.restlessFor > RESTLESS_HOLD_S && this.t - this.lastNudgeAt > NUDGE_COOLDOWN_S) {
      this.mode = 'nudge';
      this.lastNudgeAt = this.t;
      this._log('Kodama got restless and asked for a breath');
    }
    if (this.mode === 'guide' && this.t - this.guideStart > GUIDE_S) {
      this.mode = 'idle';
      this.restlessFor = 0;
      this._log('Breathing round finished');
    }
  }

  acceptNudge() { this.mode = 'guide'; this.guideStart = this.t; this._log('Breathing with Kodama'); }
  // You can also ask for a breathing round any time, without waiting to be restless.
  startGuide() { if (this.mode !== 'calibrating') this.acceptNudge(); }
  dismissNudge() { this.mode = 'idle'; this.restlessFor = 0; }

  // Guide target 0..1 (0 = empty, 1 = full) for the 4-in / 6-out pacer.
  guideTarget() {
    if (this.mode !== 'guide') return null;
    const c = (this.t - this.guideStart) % (GUIDE_IN + GUIDE_OUT);
    if (c < GUIDE_IN) return 0.5 - 0.5 * Math.cos(Math.PI * c / GUIDE_IN);
    return 0.5 + 0.5 * Math.cos(Math.PI * (c - GUIDE_IN) / GUIDE_OUT);
  }

  get blinking() { return this.t < this.blinkUntil; }
  get blossoming() { return this.t < this.blossomUntil; }
  get leaves() { return Math.floor(this.growth); }

  _log(text) {
    this.events.push({ t: this.t, text });
    if (this.events.length > 6) this.events.shift();
  }
}

function Buffer_isBuffer(x) {
  return typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(x);
}

const api = { Brain, median, clamp, tsNum, CALIBRATION_S, GUIDE_IN, GUIDE_OUT };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.KodamaBrain = api;
