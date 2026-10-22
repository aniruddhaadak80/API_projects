// Hammock core: everything that is NOT the model.
// Pure functions, no DOM, no network. Shared by the browser app and the Node tests.

// ---------- 1. Parsing WhatsApp exports ----------
// Android: "23/10/26, 7:41 am - Pishi: text"
// iOS:     "[23/10/26, 7:41:12 AM] Pishi: text"
// Both 12h and 24h clocks, / . - date separators, optional narrow no-break spaces.
const ANDROID = /^(\d{1,4}[\/.\-]\d{1,2}[\/.\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202f\u00a0]*([AaPp]\.?\s?[Mm]\.?))?\s+[-–]\s+(.*)$/;
const IOS = /^\u200e?\[(\d{1,4}[\/.\-]\d{1,2}[\/.\-]\d{1,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)(?:[\s\u202f\u00a0]*([AaPp]\.?\s?[Mm]\.?))?\]\s+(.*)$/;

function toDate(dateStr, timeStr, ampm, dayFirst = true) {
  const parts = dateStr.split(/[\/.\-]/).map(Number);
  let d, m, y;
  if (parts[0] > 999) [y, m, d] = parts; // 2026-10-23
  else if (dayFirst) [d, m, y] = parts;
  else [m, d, y] = parts;
  if (y < 100) y += 2000;
  let [hh, mm, ss = 0] = timeStr.split(':').map(Number);
  if (ampm) {
    const pm = /p/i.test(ampm);
    if (pm && hh < 12) hh += 12;
    if (!pm && hh === 12) hh = 0;
  }
  return new Date(y, m - 1, d, hh, mm, ss);
}

// Guess whether dates are day-first (most of the world, incl. India) or month-first (US).
function guessDayFirst(lines) {
  for (const l of lines) {
    const mt = l.match(ANDROID) || l.match(IOS);
    if (!mt) continue;
    const p = mt[1].split(/[\/.\-]/).map(Number);
    if (p[0] > 12 && p[0] < 100) return true;
    if (p[1] > 12) return false;
  }
  return true;
}

export function parseChat(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const dayFirst = guessDayFirst(lines);
  const messages = [];
  for (const raw of lines) {
    const line = raw.replace(/^\u200e/, '');
    const mt = line.match(IOS) || line.match(ANDROID);
    if (mt) {
      const [, ds, ts, ap, rest] = mt;
      const colon = rest.indexOf(': ');
      const at = toDate(ds, ts, ap, dayFirst);
      if (colon === -1) { messages.push({ at, sender: null, text: rest.trim(), system: true }); continue; }
      messages.push({ at, sender: rest.slice(0, colon).trim(), text: rest.slice(colon + 2).trim(), system: false });
    } else if (messages.length && raw.trim()) {
      messages[messages.length - 1].text += '\n' + raw.trim(); // continuation of a multi-line message
    }
  }
  // Generic fallback: "Name: message" per line (Slack/Discord copy-paste)
  if (!messages.length) {
    let i = 0;
    for (const l of lines) {
      const g = l.match(/^([^:\n]{1,40}):\s+(.+)$/);
      if (g) messages.push({ at: new Date(0 + i++ * 60000), sender: g[1].trim(), text: g[2].trim(), system: false, untimed: true });
    }
  }
  return messages;
}

// ---------- 2. Noise filter: the stuff nobody needs summarised ----------
const MEDIA = /^(<media omitted>|\u200e?(image|video|audio|sticker|gif|document|contact card) omitted|<attached: .*>|null)$/i;
const DELETED = /^(this message was deleted|you deleted this message|message deleted)$/i;
const GREETING = /\b(good\s*(morning|night|evening|afternoon)|gm|gn|suprobhat|shubh\s*(prabhat|ratri|sandhya)|subho\s*(sakal|ratri)|happy\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)|jai\s+\w+\s*\w*|radhe\s*radhe|have a (blessed|nice|great) day)\b/i;
const FORWARD = /^(forwarded:|fwd:|\*?forwarded as received)/i;
const REACTION = /^(ok+|okay|k|lol+|lmao|haha+|hehe+|nice|very nice|wow|great|cool|thanks?|thank you|ty|\+1|yes|no|yup|nope|same|done|sure|hmm+|ok sleeping)[.!]*$/i;
const EMOJI_ONLY = /^[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Emoji_Component}\u200d\ufe0f\s]+$/u;

export function noiseReason(msg) {
  const t = msg.text.trim();
  if (msg.system) return 'system';
  if (!t || MEDIA.test(t)) return 'media';
  if (DELETED.test(t)) return 'deleted';
  if (EMOJI_ONLY.test(t)) return 'emoji';
  if (FORWARD.test(t)) return 'forward';
  const bare = t.replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\u200d\ufe0f]/gu, '').trim();
  if (REACTION.test(bare)) return 'reaction';
  const words = t.split(/\s+/).length;
  if (GREETING.test(t) && words <= 8 && !/\?|\d/.test(t)) return 'greeting';
  return null;
}

// ---------- 3. Who is "you", and since when ----------
export function nameMatcher(names) {
  const list = names.split(',').map(s => s.trim()).filter(Boolean)
    .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!list.length) return null;
  return new RegExp(`(^|[^\\p{L}])@?(${list.join('|')})(?![\\p{L}])`, 'iu');
}

export function isMe(sender, names) {
  if (!sender) return false;
  const s = sender.toLowerCase();
  return s === 'you' || names.split(',').map(x => x.trim().toLowerCase()).filter(Boolean).some(n => s === n || s.startsWith(n + ' '));
}

// Default window: everything after your own last message. That is what "catch me up" means.
export function sliceWindow(messages, names, mode = 'since-me') {
  if (mode === 'all') return { from: 0, messages };
  if (mode === '24h') {
    const last = messages.at(-1)?.at?.getTime() ?? 0;
    const i = messages.findIndex(m => m.at.getTime() >= last - 24 * 3600e3);
    return { from: Math.max(0, i), messages: messages.slice(Math.max(0, i)) };
  }
  let lastMine = -1;
  messages.forEach((m, i) => { if (isMe(m.sender, names)) lastMine = i; });
  return { from: lastMine + 1, messages: messages.slice(lastMine + 1) };
}

// ---------- 4. The digest skeleton (deterministic) ----------
export function analyse(text, names, mode = 'since-me') {
  const all = parseChat(text);
  const { messages } = sliceWindow(all, names, mode);
  const re = nameMatcher(names);
  const skipped = {};
  const signal = [];
  const needsYou = [];
  for (const m of messages) {
    if (isMe(m.sender, names)) continue;
    const why = noiseReason(m);
    if (why) { skipped[why] = (skipped[why] || 0) + 1; continue; }
    signal.push(m);
    if (re && re.test(m.text)) needsYou.push(m);
  }
  const senders = [...new Set(signal.map(m => m.sender))];
  return {
    total: all.length,
    inWindow: messages.length,
    skipped,
    skippedCount: Object.values(skipped).reduce((a, b) => a + b, 0),
    signal,
    needsYou,
    senders,
    span: messages.length ? [messages[0].at, messages.at(-1).at] : null,
  };
}

// ---------- 5. Prompts for the model ----------
export function transcript(msgs, maxChars = 3500) {
  const out = [];
  let n = 0;
  for (const m of msgs) {
    const line = `${m.sender}: ${m.text.replace(/\n/g, ' ')}`;
    if (n + line.length > maxChars) break;
    out.push(line); n += line.length + 1;
  }
  return out.join('\n');
}

// Split a long signal list into chunks the small model can hold comfortably.
export function chunk(msgs, maxChars = 2500) {
  const chunks = [[]];
  let n = 0;
  for (const m of msgs) {
    const len = m.sender.length + m.text.length + 3;
    if (n + len > maxChars && chunks.at(-1).length) { chunks.push([]); n = 0; }
    chunks.at(-1).push(m); n += len;
  }
  return chunks.filter(c => c.length);
}

export function digestPrompt(chatText, me) {
  return [
    { role: 'system', content: 'You summarise group chats for someone who did not read them. Be plain and specific. Keep names, dates and amounts exactly as written. Never invent anything.' },
    { role: 'user', content: `Group chat messages${me ? ` (I am ${me})` : ''}:\n"""\n${chatText}\n"""\n\nIn one or two plain sentences (under 40 words total), what happened or changed? Start with the most important news. Reply with the summary only.` },
  ];
}

export function mergePrompt(partials, me) {
  return digestPrompt(partials.map((p, i) => `Part ${i + 1}: ${p}`).join('\n'), me);
}

// Turn one message that mentions you into a to-do of a few words.
export function askPrompt(msg, me) {
  return [
    { role: 'system', content: 'You turn a chat message into a short to-do for the reader. Reply with the to-do only: start with a verb, under 12 words. If the message gives a deadline or day, include it.' },
    { role: 'user', content: `${msg.sender} wrote to ${me || 'me'}: "${msg.text.replace(/\n/g, ' ')}"\nWhat does ${msg.sender} want me to do?` },
  ];
}

export const TONES = {
  ack: 'Say you saw it and you will take care of it soon. Do not claim it is already done. Sound relaxed and reliable.',
  later: 'Politely buy time: thank them and say you will get back properly by {when}. No excuses.',
  no: 'Say no kindly and clearly, at most one short reason, no over-apologising.',
};

export function replyPrompt(msg, me, tone = 'ack', when = 'tomorrow evening') {
  const ins = TONES[tone].replace('{when}', when);
  return [
    { role: 'system', content: `You write short chat replies for ${me || 'the user'}. Write only the reply text: one or two short sentences, casual and warm. Do not use any names. No greeting line, no sign-off, no placeholders in brackets.` },
    { role: 'user', content: `Message I received: "${msg.text.replace(/\n/g, ' ')}"\n\nHow to reply: ${ins}\nWrite my reply.` },
  ];
}

// ---------- 6. Cleaning and checking model output ----------
export function cleanDigest(raw) {
  const lines = raw.replace(/\*\*/g, '').split('\n').map(s => s.replace(/^[-*•\s]+/, '').trim())
    .filter(l => l && !/^(here('|’)?s|here is|summary)\b.*:$/i.test(l));
  return lines.join(' ').replace(/^(summary|news)\s*:\s*/i, '').trim();
}

// Small models sometimes echo the instructions or answer in the third person. Reject those so the
// UI can fall back to a plain excerpt of the message instead of showing nonsense.
const ECHO = /(starts? with a verb|under \d+ words|to-do only|reply with|^(okay|ok|sure)\b|here('|’)?s (a|the|my))/i;
export function cleanTodo(raw) {
  const t = raw.replace(/\*\*/g, '').split('\n').map(s => s.trim()).filter(Boolean)[0]?.replace(/^[-*•\s]+|^to-?do\s*:\s*/gi, '').replace(/^["'“]|["'”]$/g, '').replace(/[.]$/, '').trim() || '';
  if (!t || ECHO.test(t) || t.split(/\s+/).length > 16) return '';
  // "Ma is asking you to book leave" -> "Book leave"
  const direct = t.replace(/^[\p{L} .'-]{1,30}? (is asking|asks|wants|would like|needs) (you|me) to\s+/iu, '');
  return direct.charAt(0).toUpperCase() + direct.slice(1);
}

// Fallback when the model returns nothing usable: the message itself, trimmed to a readable length.
export function excerpt(text, max = 80) {
  const t = text.replace(/\s+/g, ' ').replace(/@\S+\s*/g, '').trim();
  return t.length > max ? t.slice(0, t.lastIndexOf(' ', max) > 40 ? t.lastIndexOf(' ', max) : max) + '…' : t;
}

export function cleanReply(raw) {
  return raw.replace(/^(okay|ok|sure)?[,!.]?\s*here('|’)?s (a|my|the) (reply|draft|response)[^:]*:\s*/i, '').replace(/^["'“]|["'”]$/g, '').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
}

// Grounding check: every number in the summary must appear in the source messages.
// Small models are good at gist and bad at digits, so we flag any digit they did not copy.
export function unverifiedNumbers(summary, sourceMsgs) {
  const src = sourceMsgs.map(m => m.text).join(' ').toLowerCase();
  const nums = [].concat(summary).join(' ').match(/\d+(?:[.,:]\d+)*/g) || [];
  return [...new Set(nums.filter(n => !src.includes(n.toLowerCase())))];
}

export function fmtSkipped(skipped) {
  const label = { media: 'photos/stickers', greeting: 'greetings', forward: 'forwards', emoji: 'emoji-only', reaction: 'one-word reactions', deleted: 'deleted', system: 'system notices' };
  return Object.entries(skipped).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} ${label[k] || k}`).join(', ');
}
