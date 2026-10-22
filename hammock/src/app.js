import * as H from './core.js';

const $ = (s) => document.querySelector(s);
const state = { analysis: null, device: 'wasm', worker: null, pending: new Map(), nextId: 1, timings: [] };

// ---------- device detection ----------
async function detectDevice() {
  try {
    const adapter = navigator.gpu && (await navigator.gpu.requestAdapter());
    if (adapter) { state.f16 = adapter.features.has('shader-f16'); return 'webgpu'; }
  } catch { /* no webgpu */ }
  return 'wasm';
}

function modelDevice(key) {
  // Gemma 4 E2B is ~3 GB: only sensible on WebGPU. Gemma 3 1B runs anywhere.
  return key === 'gemma-4-e2b' ? 'webgpu' : state.device;
}

// ---------- worker plumbing ----------
function worker() {
  if (state.worker) return state.worker;
  const wurl = new URL('./worker.js', import.meta.url);
  const dt = new URLSearchParams(location.search).get('dtype'); // debugging aid: ?dtype=q8
  if (dt) wurl.searchParams.set('dtype', dt);
  const w = new Worker(wurl, { type: 'module' });
  w.onmessage = (e) => {
    const m = e.data;
    if (m.type === 'progress') showProgress(m.loaded, m.total);
    if (m.type === 'loaded') { state.loadedInfo = m; $('#progress-text').textContent = `Gemma is awake (${m.device.toUpperCase()}, ${m.dtype}, ready in ${(m.ms / 1000).toFixed(1)} s).`; $('#bar').style.width = '100%'; }
    const p = state.pending.get(m.id);
    if (!p) return;
    if (m.type === 'token') p.onToken?.(m.piece);
    if (m.type === 'done') { state.pending.delete(m.id); state.timings.push({ ms: m.ms, tokens: m.tokens }); p.resolve(m.text); }
    if (m.type === 'error') { state.pending.delete(m.id); p.reject(new Error(m.error)); }
  };
  state.worker = w;
  return w;
}

function generate(messages, max_new_tokens, onToken) {
  const key = $('#model').value;
  const id = state.nextId++;
  return new Promise((resolve, reject) => {
    state.pending.set(id, { resolve, reject, onToken });
    worker().postMessage({ type: 'generate', id, key, device: modelDevice(key), f16: state.f16 !== false, messages, max_new_tokens });
  });
}

function showProgress(loaded, total) {
  $('#progress').hidden = false;
  const pct = Math.min(100, (loaded / total) * 100);
  $('#bar').style.width = pct.toFixed(1) + '%';
  $('#progress-text').textContent = `Fetching Gemma once (${(loaded / 1e6).toFixed(0)} / ${(total / 1e6).toFixed(0)} MB). Next time it loads from your browser cache, even offline.`;
}

// ---------- step 1: input ----------
function setChat(text) { $('#chat').value = text; refresh(); }

$('#pick').onclick = () => $('#file').click();
$('#file').onchange = async (e) => { const f = e.target.files[0]; if (f) setChat(await f.text()); };
const drop = $('#drop');
['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', async (e) => { const f = e.dataTransfer.files[0]; if (f) setChat(await f.text()); });
document.querySelectorAll('[data-sample]').forEach((b) => b.onclick = async () => {
  const text = await (await fetch(new URL(`../samples/${b.dataset.sample}`, import.meta.url))).text();
  if (!$('#me').value) $('#me').value = b.dataset.name;
  setChat(text);
});
['#chat', '#me', '#window'].forEach((s) => $(s).addEventListener('input', refresh));
$('#me').value = localStorage.getItem('hammock:me') || '';

// ---------- step 2: deterministic sort ----------
function esc(s) { return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function words(msgs) { return msgs.reduce((n, m) => n + m.text.split(/\s+/).filter(Boolean).length, 0); }

function refresh() {
  const text = $('#chat').value;
  const me = $('#me').value.trim();
  localStorage.setItem('hammock:me', me);
  if (!text.trim()) { $('#step-sort').hidden = $('#step-ai').hidden = true; return; }
  const a = H.analyse(text, me, $('#window').value);
  state.analysis = a;
  $('#step-sort').hidden = false;
  $('#step-ai').hidden = a.signal.length === 0;
  const meNote = me ? '' : '<p class="warn">Add your name above so Hammock can find your last message and anything aimed at you.</p>';
  $('#stats').innerHTML = `
    ${meNote}
    <div class="stat"><b>${a.inWindow}</b><span>messages to catch up on${a.total !== a.inWindow ? ` (of ${a.total})` : ''}</span></div>
    <div class="stat calm"><b>${a.skippedCount}</b><span>skipped without reading${a.skippedCount ? `: ${esc(H.fmtSkipped(a.skipped))}` : ''}</span></div>
    <div class="stat"><b>${a.signal.length}</b><span>worth a look, from ${a.senders.length} ${a.senders.length === 1 ? 'person' : 'people'}</span></div>
    <div class="stat hot"><b>${a.needsYou.length}</b><span>${a.needsYou.length === 1 ? 'message mentions' : 'messages mention'} you</span></div>`;
}

// ---------- step 3: Gemma ----------
$('#go').onclick = async () => {
  const a = state.analysis;
  if (!a) return;
  const me = $('#me').value.trim();
  const btn = $('#go');
  btn.disabled = true; btn.textContent = '🦥 Reading slowly…';
  $('#progress').hidden = false;
  $('#step-result').hidden = false;
  const gistEl = $('#gist');
  gistEl.textContent = ''; $('#check').textContent = ''; $('#todos').innerHTML = ''; $('#asks').innerHTML = ''; $('#payoff').textContent = '';
  state.timings = [];
  const t0 = performance.now();
  try {
    // Line 1: what happened. Map-reduce if the chat is too long for one small-model pass.
    const chunks = H.chunk(a.signal);
    let gist;
    if (chunks.length === 1) {
      gistEl.classList.add('typing');
      gist = H.cleanDigest(await generate(H.digestPrompt(H.transcript(chunks[0]), me), 90, (p) => { gistEl.textContent += p; }));
    } else {
      const parts = [];
      for (let i = 0; i < chunks.length; i++) {
        gistEl.textContent = `Reading part ${i + 1} of ${chunks.length}…`;
        parts.push(H.cleanDigest(await generate(H.digestPrompt(H.transcript(chunks[i]), me), 70)));
      }
      gistEl.textContent = '';
      gistEl.classList.add('typing');
      gist = H.cleanDigest(await generate(H.mergePrompt(parts, me), 90, (p) => { gistEl.textContent += p; }));
    }
    if (!gist) {
      // Small models on the CPU fallback sometimes stop before writing a word on a long prompt.
      // Retry once on the most recent, shorter slice of the chat.
      gistEl.textContent = '';
      gist = H.cleanDigest(await generate(H.digestPrompt(H.transcript(a.signal.slice(-8), 1200), me), 90, (p) => { gistEl.textContent += p; }));
    }
    gistEl.classList.remove('typing');
    if (!gist) {
      gist = `Gemma returned nothing on this device. Latest real news: ${H.excerpt(a.signal.at(-1).sender + ': ' + a.signal.at(-1).text, 140)}`;
    }
    gistEl.textContent = gist;
    const bad = H.unverifiedNumbers(gist, a.signal);
    $('#check').innerHTML = bad.length
      ? `⚠️ Double-check: ${bad.map(esc).join(', ')} ${bad.length === 1 ? 'does' : 'do'} not appear in the chat.`
      : (/\d/.test(gist) ? '✓ Every number above was found in the chat.' : '');

    // Line 2: what needs you. Found by code, phrased by Gemma.
    const todos = [];
    if (!a.needsYou.length) $('#todos').innerHTML = '<li class="none">Nothing mentions you. Go back to sleep. 🦥</li>';
    for (const m of a.needsYou) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="todo">…</span> <span class="from">from ${esc(m.sender)}</span>`;
      $('#todos').appendChild(li);
      const todo = H.cleanTodo(await generate(H.askPrompt(m, me), 30)) || `Reply to: “${H.excerpt(m.text)}”`;
      li.querySelector('.todo').textContent = todo;
      todos.push(`${todo} (${m.sender})`);
      $('#asks').appendChild(askCard(m, todo, me));
    }
    state.digest = `${gist}\nNeeds you: ${todos.length ? todos.join('; ') : 'nothing'}`;
    const secs = (performance.now() - t0) / 1000;
    $('#payoff').textContent = `Hammock read ${a.inWindow} messages (${words(a.signal)} words worth reading, plus ${a.skippedCount} you never had to look at) and gave you ${gist.split(/\s+/).length + todos.join(' ').split(/\s+/).length} words back, in ${secs.toFixed(0)} s on ${modelDevice($('#model').value).toUpperCase()}.`;
  } catch (err) {
    gistEl.classList.remove('typing');
    gistEl.textContent = `Gemma could not run here: ${err.message}. Try the Nap model, or a browser with WebGPU (Chrome/Edge).`;
  } finally {
    btn.disabled = false; btn.textContent = '🦥 Swing into it again';
  }
};

function askCard(m, todo, me) {
  const card = document.createElement('div');
  card.className = 'ask';
  card.innerHTML = `
    <p class="ask-todo">${esc(todo)}</p>
    <blockquote><b>${esc(m.sender)}</b> ${esc(m.text)}<small>${m.untimed ? '' : m.at.toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</small></blockquote>
    <div class="tones">
      <span>Draft a reply:</span>
      <button class="chip" data-tone="ack">👍 On it</button>
      <button class="chip" data-tone="later">⏳ Later</button>
      <button class="chip" data-tone="no">🙅 Kind no</button>
      <input class="when" value="tomorrow evening" aria-label="When you will get back to them" title="Used by Later" />
    </div>
    <div class="draft" hidden><p class="stream"></p><button class="ghost copy">Copy reply</button></div>`;
  card.querySelectorAll('[data-tone]').forEach((b) => b.onclick = async () => {
    const box = card.querySelector('.draft'); const p = box.querySelector('p');
    box.hidden = false; p.textContent = ''; p.classList.add('typing');
    card.querySelectorAll('[data-tone]').forEach((x) => x.disabled = true);
    try {
      const text = await generate(H.replyPrompt(m, me, b.dataset.tone, card.querySelector('.when').value || 'tomorrow evening'), 60, (piece) => { p.textContent += piece; });
      p.textContent = H.cleanReply(text);
    } catch (err) { p.textContent = 'Could not draft: ' + err.message; }
    p.classList.remove('typing');
    card.querySelectorAll('[data-tone]').forEach((x) => x.disabled = false);
  });
  card.querySelector('.copy').onclick = () => navigator.clipboard.writeText(card.querySelector('.draft p').textContent);
  return card;
}

$('#copy-digest').onclick = () => state.digest && navigator.clipboard.writeText(state.digest);

// ---------- boot ----------
(async () => {
  state.device = await detectDevice();
  const note = $('#device-note');
  if (state.device === 'webgpu') {
    note.textContent = `WebGPU found${state.f16 ? '' : ' (no fp16, using fp32 maths)'}: Gemma runs on your GPU. Deep sleep (Gemma 4) is available if you can spare a 3 GB download.`;
  } else {
    note.textContent = 'No WebGPU here, so Gemma 3 1B falls back to your CPU (WASM, 8-bit, ~1 GB). It is slow and rough: to-dos and replies work, the summary line often comes back thin. Chrome or Edge with WebGPU gives the real thing.';
    $('#model').querySelector('[value="gemma-4-e2b"]').disabled = true;
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  window.__hammock = state; // for the e2e test
})();
