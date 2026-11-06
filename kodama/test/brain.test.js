// Unit tests for Kodama's signal logic (no SDK, no camera).
const test = require('node:test');
const assert = require('node:assert');
const { Brain } = require('../src/brain.js');

const payload = ({ br, pr, happy, blink, talk } = {}) => ({
  breathing: br != null ? { rate: [{ value: br, confidence: 90, timestamp: 0 }] } : undefined,
  cardio: pr != null ? { pulseRate: [{ value: pr, confidence: 90, timestamp: 0 }] } : undefined,
  face: {
    expression: happy != null ? [{ scores: [{ type: 5, confidence: happy * 100 }, { type: 6, confidence: (1 - happy) * 100 }] }] : [],
    blinking: blink ? [{ detected: true }] : [],
    talking: talk != null ? [{ detected: talk }] : [],
  },
});
function run(b, seconds, p) { for (let i = 0; i < seconds * 10; i++) { b.ingest(payload(p)); b.step(0.1); } }

test('learns a personal baseline, then calm breathing grows leaves', () => {
  const b = new Brain({ calibrationS: 10 });
  run(b, 12, { br: 8, pr: 70 });
  assert.equal(b.mode, 'idle');
  assert.ok(Math.abs(b.baseline - 70) < 1e-9);
  run(b, 30, { br: 7, pr: 68 });
  assert.ok(b.calm > 0.8, `calm=${b.calm}`);
  assert.ok(b.leaves >= 5, `leaves=${b.leaves}`);
});

test('pulse well above your own calm plus fast breathing asks for a breath, once', () => {
  const b = new Brain({ calibrationS: 10 });
  run(b, 12, { br: 10, pr: 70 });
  run(b, 80, { br: 22, pr: 84 });
  assert.equal(b.mode, 'nudge');
  b.dismissNudge();
  run(b, 80, { br: 22, pr: 84 });
  assert.equal(b.mode, 'idle', 'cooldown stops it nagging');
});

test('talking pauses growth; a big smile blossoms; blinks are mirrored', () => {
  const b = new Brain({ calibrationS: 5 });
  run(b, 6, { br: 7, pr: 66 });
  const g = b.growth;
  run(b, 10, { br: 7, pr: 66, talk: true });
  assert.equal(b.growth, g);
  b.ingest(payload({ happy: 0.9, blink: true }));
  assert.ok(b.blossoming && b.blinking);
});

test('guided breathing follows a 4 s in / 6 s out pacer', () => {
  const b = new Brain({ calibrationS: 1 });
  run(b, 2, {});
  b.startGuide();
  assert.equal(b.mode, 'guide');
  assert.ok(b.guideTarget() < 0.01);
  b.step(4); assert.ok(b.guideTarget() > 0.99);
  b.step(6); assert.ok(b.guideTarget() < 0.01);
  b.step(60); assert.equal(b.mode, 'idle');
});
