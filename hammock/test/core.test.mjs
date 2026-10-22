import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as H from '../src/core.js';

const fam = fs.readFileSync(new URL('../samples/family-group.txt', import.meta.url), 'utf8');
const team = fs.readFileSync(new URL('../samples/hackathon-team.txt', import.meta.url), 'utf8');

test('parses Android exports with am/pm and system lines', () => {
  const m = H.parseChat(fam);
  assert.equal(m.length, 76);
  assert.equal(m[0].system, true);
  assert.equal(m[1].sender, 'Arjun');
  assert.equal(m[1].at.getHours(), 21);
});

test('parses iOS exports and keeps multi-line messages together', () => {
  const m = H.parseChat(team);
  assert.equal(m.length, 15);
  const k = m.find((x) => x.text.includes('how-it-works'));
  assert.match(k.text, /\n.*regex story/);
  assert.equal(m[0].at.getHours(), 23);
});

test('handles 24h clocks, US month-first dates and narrow no-break spaces', () => {
  const a = H.parseChat('10/23/26, 18:05 - Sam: running late\n10/23/26, 6:07\u202fPM - Lee: ok');
  assert.equal(a[0].at.getMonth(), 9);
  assert.equal(a[0].at.getDate(), 23);
  assert.equal(a[0].at.getHours(), 18);
  assert.equal(a[1].at.getHours(), 18);
});

test('falls back to plain "Name: text" lines', () => {
  const a = H.parseChat('Riya: are we still on for Friday?\nDev: yes 7pm');
  assert.equal(a.length, 2);
  assert.equal(a[1].sender, 'Dev');
});

test('noise filter skips greetings, media, emoji, reactions, forwards', () => {
  const n = (text) => H.noiseReason({ text, system: false });
  assert.equal(n('Good morning 🌸🙏'), 'greeting');
  assert.equal(n('Suprobhat 🌼'), 'greeting');
  assert.equal(n('<Media omitted>'), 'media');
  assert.equal(n('\u200esticker omitted'), 'media');
  assert.equal(n('🙏🙏🙏'), 'emoji');
  assert.equal(n('Very nice 👍'), 'reaction');
  assert.equal(n('+1'), 'reaction');
  assert.equal(n('Forwarded: 10 health benefits of warm water'), 'forward');
  assert.equal(n('This message was deleted'), 'deleted');
  // real content survives, even when it starts with a greeting
  assert.equal(n('Good morning! Wedding moved to 12 Dec, please rebook'), null);
  assert.equal(n('Oh no. Who all have booked trains already?'), null);
});

test('window starts after your own last message', () => {
  const a = H.analyse(fam, 'Arjun');
  assert.equal(a.total, 76);
  assert.equal(a.inWindow, 74);
  assert.equal(a.signal.length, 10);
  assert.equal(a.skippedCount, 64);
});

test('finds messages that mention you, with or without @, any case', () => {
  const a = H.analyse(fam, 'Arjun');
  assert.deepEqual(a.needsYou.map((m) => m.sender), ['Ma', 'Ma']);
  const b = H.analyse(team, 'arjun');
  assert.deepEqual(b.needsYou.map((m) => m.sender), ['Kabir', 'Meera']);
  // a name inside another word does not count
  const c = H.analyse('Ana: Arjunbhai is here\nBo: hi @Arjun', 'Arjun');
  assert.equal(c.needsYou.length, 1);
});

test('nicknames count as you', () => {
  const a = H.analyse('Ma: Bubu did you eat?\nMa: ok', 'Arjun, Bubu');
  assert.equal(a.needsYou.length, 1);
});

test('chunking keeps every message and respects the budget', () => {
  const many = Array.from({ length: 300 }, (_, i) => ({ sender: 'S' + (i % 5), text: 'message number ' + i + ' about the plan' }));
  const ch = H.chunk(many, 1000);
  assert.ok(ch.length > 1);
  assert.equal(ch.flat().length, 300);
});

test('grounding check flags numbers the model made up', () => {
  const a = H.analyse(fam, 'Arjun');
  assert.deepEqual(H.unverifiedNumbers('Wedding moved to 12 Dec, gift 2000 each', a.signal), []);
  assert.deepEqual(H.unverifiedNumbers('Wedding moved to 15 Dec, gift 2500 each', a.signal), ['15', '2500']);
});

test('cleaners strip model chatter', () => {
  assert.equal(H.cleanDigest("Here's a summary of the group chat:\n\n**News:** The wedding moved."), 'The wedding moved.');
  assert.equal(H.cleanReply('Okay, here’s a reply: “Will do, back to you Saturday.”'), 'Will do, back to you Saturday.');
  assert.equal(H.cleanTodo('To-do: Book leave before Sunday.\nextra'), 'Book leave before Sunday');
});
