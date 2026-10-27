---
name: git-ofrenda
description: Build an ofrenda (a Dia de los Muertos altar) for the files a git repository deleted, with epitaphs written by a local open-weight model, or hold a "seance" to ask a deleted file what it was for. Use when someone asks what code a repo removed, why a file disappeared, wants a fun retrospective of a project's history, or says "ofrenda", "epitaph", "dead code", or "seance".
---

# git-ofrenda

`ofrenda.py` is a single-file Python CLI (standard library only). Git supplies every fact; the model only writes the words. It talks to a local model through Ollama (`http://localhost:11434`) or any OpenAI-compatible server such as llama.cpp's `llama-server` (`http://localhost:8080/v1`). It never calls a hosted API.

## Before you run it

1. Check a local model is up: `curl -s localhost:11434/api/tags` (Ollama) or `curl -s localhost:8080/health` (llama-server).
2. If neither answers, either ask the user to start one (`ollama pull gemma3:4b && ollama serve`) or run with `--no-model` for a facts-only altar.

## Commands

```bash
# what did this repo bury? (newest deaths first, no model needed)
python3 ofrenda.py list /path/to/repo --limit 30

# build the altar: OFRENDA.md + index.html + souls.json in ./ofrenda
python3 ofrenda.py build /path/to/repo --model gemma3:4b --limit 12 --ext .js .ts

# ask a dead file a question (one-shot, good for agents)
python3 ofrenda.py seance /path/to/repo lib/old/thing.js --model gemma3:4b --ask "What did you do?"
```

Flags: `--url` (or env `OFRENDA_URL`), `--model` (or `OFRENDA_MODEL`), `--out`, `--name`, `--no-model`.

## Reading the output

- `souls.json` holds the facts per file: born/died dates and commits, who added and removed it, the deleting commit message ("cause"), commit count, authors, lines at death, last 12 non-blank lines, and `written_by` (the model, or `template` when the model's answer failed the checks three times).
- When reporting to the user, quote dates, causes and authors from `souls.json`, not from the epitaph text. Epitaphs are creative; the facts are git's.
- Renamed files are not deaths. Files deleted and later re-added are skipped. Lockfiles, images and minified files are skipped.

## Guardrails built in

- Epitaphs that cite any number not present in the file's facts are rejected and retried.
- Answers not in the two-line EPITAPH / REMEMBRANCE shape are retried, then replaced by a plain factual template.
- Requests go straight to the URL given; system proxies are ignored so nothing leaves the machine by accident.
