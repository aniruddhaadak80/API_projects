# What I measured (and what I didn't)

Everything here comes from runs I actually did on 23 Oct 2026. No numbers are extrapolated.

## Test chats

Both sample chats in `samples/` are **made up** for the demo (fictional names and events):

| Sample | Messages in export | Since "Arjun" last spoke | Skipped as noise | Left for Gemma | Mention Arjun |
|---|---|---|---|---|---|
| `family-group.txt` (Android export format) | 76 | 74 | 64 (19 greetings, 16 emoji-only, 13 media, 12 one-word reactions, 2 deleted, 2 forwards) | 10 | 2 |
| `hackathon-team.txt` (iOS export format) | 15 | 14 | 6 | 8 | 2 |

The skip / mention numbers come from `src/core.js` and are pinned by `test/core.test.mjs` (11 tests, `npm test`, all passing).

## Model quality on the same prompts

Run with Transformers.js 4.3.1 on `onnxruntime-node` (2 vCPU arm64 sandbox, no GPU), greedy decoding, the exact prompts in `src/core.js`. Same ONNX weights the browser downloads.

**Family group, line 1 ("what happened")**

| Model | Time | Output |
|---|---|---|
| Gemma 3 1B (q4) | 9.9 s | The wedding of Rini is moved to December 12th due to a double booking. Train bookings are being finalized for December 11th. |
| Gemma 4 E2B (q4) | 23.6 s | Rini's wedding date has changed from 5 Dec to 12 Dec due to a double booking. A gift contribution of 2000 each is due by 1 Dec. |

**Hackathon team, line 1**

| Model | Time | Output |
|---|---|---|
| Gemma 3 1B (q4) | 11.2 s | Arjun's ONNX import failed on his main machine due to a broken build. Meera suggests a fix, Sana wants the blog post draft by Saturday, and Kabir requests the parser and how-it-works section. ❌ wrong person: it was Meera's build, and it was her cache |
| Gemma 4 E2B (q4) | 21.9 s | Meera fixed an issue with the onnx import in Safari. Sana requested the blog post draft by Saturday, and Arjun was asked to write the "how-it-works" section. |

**"Needs you" to-dos (the messages are found by code; Gemma only phrases them)**

| Message | Gemma 3 1B | Gemma 4 E2B |
|---|---|---|
| Ma: "@Arjun did you book your leave for the wedding? Tell us before Sunday…" | Book your leave for the wedding (2.6 s) | Book leave for the wedding before Sunday (5.8 s) |
| Ma: "Arjun also please call Dida this week…" | Call Dida this week (2.4 s) | Call Dida this week (4.6 s) |
| Kabir: "@Arjun you wrote the parser, can you write the how-it-works part?…" | Start the how-it-works section (2.9 s) | Write the how-it-works part with regex story (11.9 s) |
| Meera: "Arjun when you wake up, can you check if the model loads on your old laptop?…" | Check the model's loading on Arjun's old laptop (3.6 s) | Check if the model loads on the old laptop (6.4 s) |

Takeaways that shaped the design:

- The 1B model is good at gist and phrasing, and bad at *who did what*. So the part that must be right (which messages are aimed at you) is plain code, and the model only rewrites it.
- Small models are bad at digits, so every number in the summary is checked against the source messages and flagged if it does not appear.
- Gemma 4 E2B is clearly better and roughly 2x slower on CPU. In the browser it is offered as "Deep sleep" on WebGPU only (about 3 GB).

## In-browser runs (headless Chromium 129, same sandbox)

- **WASM path** (no GPU): Gemma 3 1B loads and runs end to end. ONNX Runtime Web's CPU backend has no kernel for the `GatherBlockQuantized` op used by the 4-bit export, so the CPU path uses the single-file 8-bit export (`model_uint8.onnx`, about 1 GB) with graph optimisation off (with it on, the tab ran out of memory). Full family-group digest: 71 s. The 8-bit export gave noticeably rougher text than 4-bit, so the UI labels CPU mode as a fallback.
- **WebGPU path**: tested with Chromium's SwiftShader software WebGPU adapter (no real GPU in the sandbox, and no `shader-f16`, so the app picks `q4` instead of `q4f16`). Gemma 3 1B q4 loaded on WebGPU in 13.8 s. Software WebGPU is far slower than a real GPU, so I am not quoting a speed for it.
- **Network**: during a full run the page only made GET requests: the app's own files, `cdn.jsdelivr.net` (Transformers.js + ONNX Runtime Web) and the Hugging Face Hub (model weights). No request carried the chat.

Not measured: speed on a real laptop GPU, Safari, Firefox, phones.
