// Hammock model worker. The only place an AI model lives.
// Runs Gemma inside this browser tab with Transformers.js (ONNX Runtime Web): WebGPU when present, WASM otherwise.
import {
  pipeline, env, AutoProcessor, Gemma4ForConditionalGeneration, TextStreamer,
} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1';

env.allowLocalModels = false; // weights come from the Hugging Face Hub once, then from the browser cache

export const MODELS = {
  // WASM can't run the 4-bit export (GatherBlockQuantized is WebGPU-only in ONNX Runtime Web; the 270M "quantized"
  // export uses it too), so the CPU path uses the single-file 8-bit 1B export (model_uint8.onnx, ~1 GB).
  'gemma-3-1b': { id: 'onnx-community/gemma-3-1b-it-ONNX', kind: 'pipeline',
    wasm: { id: 'onnx-community/gemma-3-1b-it-ONNX', dtype: 'uint8',
      options: { use_external_data_format: false, session_options: { graphOptimizationLevel: 'disabled' } } } },
  'gemma-4-e2b': { id: 'onnx-community/gemma-4-E2B-it-ONNX', kind: 'gemma4', wasmDtype: 'q4' },
};

const OVERRIDE_DTYPE = new URL(self.location.href).searchParams.get('dtype');
let loaded = null; // { key, device, run }

async function load(key, device, f16 = true) {
  if (loaded && loaded.key === key && loaded.device === device) return loaded;
  const spec = MODELS[key];
  // q4f16 on WebGPU; on WASM see MODELS above.
  // GPUs without shader-f16 get the same 4-bit weights with fp32 maths.
  const cpu = device !== 'webgpu' && spec.wasm && !OVERRIDE_DTYPE ? spec.wasm : null;
  const modelId = cpu ? cpu.id : spec.id;
  const dtype = OVERRIDE_DTYPE || (device === 'webgpu' ? (f16 ? 'q4f16' : 'q4') : (cpu ? cpu.dtype : 'q4'));
  const files = {};
  const progress_callback = (p) => {
    if (p.status === 'progress' && p.total) {
      files[p.file] = [p.loaded, p.total];
      const [l, t] = Object.values(files).reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0]);
      postMessage({ type: 'progress', loaded: l, total: t });
    }
  };
  const t0 = performance.now();
  let run;
  if (spec.kind === 'pipeline') {
    const gen = await pipeline('text-generation', modelId, { dtype, device, progress_callback, ...(cpu ? cpu.options : {}) });
    run = async (messages, max_new_tokens, onToken) => {
      const streamer = new TextStreamer(gen.tokenizer, { skip_prompt: true, skip_special_tokens: true, callback_function: onToken });
      const out = await gen(messages, { max_new_tokens, do_sample: false, repetition_penalty: 1.05, streamer });
      return out[0].generated_text.at(-1).content;
    };
  } else {
    const processor = await AutoProcessor.from_pretrained(spec.id, { progress_callback });
    const model = await Gemma4ForConditionalGeneration.from_pretrained(spec.id, { dtype, device, progress_callback });
    run = async (messages, max_new_tokens, onToken) => {
      const prompt = processor.apply_chat_template(messages, { add_generation_prompt: true, enable_thinking: false });
      const inputs = await processor(prompt);
      const streamer = new TextStreamer(processor.tokenizer, { skip_prompt: true, skip_special_tokens: true, callback_function: onToken });
      const out = await model.generate({ ...inputs, max_new_tokens, do_sample: false, streamer });
      return processor.batch_decode(out.slice(null, [inputs.input_ids.dims.at(-1), null]), { skip_special_tokens: true })[0];
    };
  }
  loaded = { key, device, run };
  postMessage({ type: 'loaded', key, model: modelId.split('/')[1], device, dtype, ms: Math.round(performance.now() - t0) });
  return loaded;
}

let current = null;
// Some loader failures surface as unhandled rejections; report them instead of hanging the UI.
self.addEventListener('unhandledrejection', (ev) => {
  postMessage({ type: 'error', id: current, error: String(ev.reason?.message || ev.reason) });
});

let queue = Promise.resolve();
self.onmessage = (e) => {
  const msg = e.data;
  queue = queue.then(async () => {
    try {
      if (msg.type === 'load') { await load(msg.key, msg.device, msg.f16); return; }
      if (msg.type === 'generate') {
        current = msg.id;
        const m = await load(msg.key, msg.device, msg.f16);
        const t0 = performance.now();
        let tokens = 0;
        const text = await m.run(msg.messages, msg.max_new_tokens || 80, (piece) => {
          tokens++;
          postMessage({ type: 'token', id: msg.id, piece });
        });
        postMessage({ type: 'done', id: msg.id, text, ms: Math.round(performance.now() - t0), tokens });
      }
    } catch (err) {
      postMessage({ type: 'error', id: msg.id, error: String(err?.message || err) });
    }
  });
};
