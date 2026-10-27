#!/usr/bin/env python3
"""git-ofrenda: an ofrenda for the code your repo buried.

Walks a git history, finds the files that were deleted, gathers the facts of
each one's life (born, died, who tended it, what killed it, its last lines),
and asks a local open-weight model to write it an epitaph. Then you can hold
a seance and ask a dead file a question.

Pure Python standard library. The model runs on your machine through Ollama
or any OpenAI-compatible local server (llama.cpp's llama-server, LM Studio,
vLLM). Nothing leaves localhost.

MIT License.
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass, field
from datetime import date

__version__ = "0.1.0"

# --------------------------------------------------------------------------
# git archaeology (no model involved)
# --------------------------------------------------------------------------

SKIP_RE = re.compile(
    r"(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock|poetry\.lock|"
    r"\.DS_Store|Thumbs\.db)$|\.(png|jpe?g|gif|ico|svg|woff2?|ttf|eot|pdf|zip|gz|"
    r"tgz|jar|class|so|dll|exe|min\.js|map|lock)$",
    re.I,
)


def git(repo: str, *args: str) -> str:
    out = subprocess.run(
        ["git", "-C", repo, *args],
        capture_output=True,
        text=True,
        errors="replace",
    )
    if out.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {out.stderr.strip()}")
    return out.stdout


@dataclass
class Departed:
    path: str
    born: str = ""          # YYYY-MM-DD
    born_by: str = ""
    born_commit: str = ""
    born_message: str = ""
    died: str = ""
    died_by: str = ""
    died_commit: str = ""
    cause: str = ""         # the commit message that deleted it
    lifespan_days: int = 0
    commits: int = 0
    authors: list = field(default_factory=list)
    lines: int = 0
    last_words: list = field(default_factory=list)
    siblings: int = 0       # other files buried in the same commit
    epitaph: str = ""
    remembrance: str = ""
    written_by: str = ""    # model id, or "template" if the model failed

    @property
    def name(self) -> str:
        return self.path.rsplit("/", 1)[-1]


def find_deaths(repo: str) -> dict:
    """Map path -> (commit, date, author, subject, n_files_in_commit) for each
    file's most recent deletion where it was never brought back."""
    raw = git(repo, "log", "--diff-filter=D", "--name-only", "--date=short",
              "--format=@@%H\x1f%ad\x1f%an\x1f%s")
    deaths: dict = {}
    cur = None
    batch: list = []

    def flush():
        if cur:
            for p in batch:
                deaths.setdefault(p, (*cur, len(batch)))

    for line in raw.splitlines():
        if line.startswith("@@"):
            flush()
            cur = tuple(line[2:].split("\x1f", 3))
            batch = []
        elif line.strip():
            batch.append(line.strip())
    flush()
    alive = set(git(repo, "ls-files").splitlines())
    return {p: d for p, d in deaths.items() if p not in alive and not SKIP_RE.search(p)}


def exhume(repo: str, path: str, death: tuple, last_n: int = 12) -> Departed:
    commit, died, died_by, cause, n_batch = death
    d = Departed(path=path, died=died, died_by=died_by, died_commit=commit[:8],
                 cause=cause, siblings=max(0, n_batch - 1))
    log = git(repo, "log", "--date=short", "--format=%H\x1f%ad\x1f%an\x1f%s",
              f"{commit}^", "--", path).splitlines()
    if log:
        first = log[-1].split("\x1f", 3)
        d.born_commit, d.born, d.born_by, d.born_message = first[0][:8], first[1], first[2], first[3]
        d.commits = len(log) + 1  # + the deletion itself
        seen = []
        for l in log:
            a = l.split("\x1f")[2]
            if a not in seen:
                seen.append(a)
        d.authors = seen
    try:
        y1, m1, d1 = map(int, d.born.split("-"))
        y2, m2, d2 = map(int, d.died.split("-"))
        d.lifespan_days = (date(y2, m2, d2) - date(y1, m1, d1)).days
    except ValueError:
        pass
    try:
        body = git(repo, "show", f"{commit}^:{path}")
        lines = body.splitlines()
        d.lines = len(lines)
        tail = [l.rstrip() for l in lines if l.strip()]
        d.last_words = [l[:120] for l in tail[-last_n:]]
    except RuntimeError:
        pass
    return d


def choose(deaths: dict, repo: str, limit: int, exts: list | None) -> list:
    """Pick the most-lived dead files: long life and many commits, a spread
    of causes of death (at most 2 per burial commit), source files first."""
    items = list(deaths.items())
    if exts:
        items = [(p, d) for p, d in items if any(p.endswith(e) for e in exts)]
    # cheap pre-score from history size, then exhume only the top slice
    counts = {}
    for p, _ in items:
        counts[p] = 0
    pre = sorted(items, key=lambda kv: kv[1][1])  # oldest deaths first as tiebreak
    scored = []
    for p, death in pre[: max(limit * 15, 60)] if len(pre) > 400 else pre:
        n = int(git(repo, "rev-list", "--count", f"{death[0]}^", "--", p).strip() or 0)
        scored.append((n, p, death))
    scored.sort(key=lambda t: -t[0])
    picked, per_commit = [], {}
    for n, p, death in scored:
        if per_commit.get(death[0], 0) >= 2:
            continue
        per_commit[death[0]] = per_commit.get(death[0], 0) + 1
        picked.append(exhume(repo, p, death))
        if len(picked) >= limit:
            break
    return picked


# --------------------------------------------------------------------------
# the medium: a local open-weight model
# --------------------------------------------------------------------------

class Medium:
    """Talks to Ollama's native API or any OpenAI-compatible local server."""

    def __init__(self, url: str, model: str, temperature: float = 0.7, timeout: int = 300):
        self.url = url.rstrip("/")
        self.model = model
        self.temperature = temperature
        self.timeout = timeout
        self.tokens = 0
        self.seconds = 0.0

    def chat(self, system: str, user: str, max_tokens: int = 220) -> str:
        t0 = time.time()
        if "/v1" in self.url or self.url.endswith(":8080"):
            endpoint = self.url if self.url.endswith("/chat/completions") else (
                self.url + ("/chat/completions" if self.url.endswith("/v1") else "/v1/chat/completions"))
            payload = {"model": self.model, "temperature": self.temperature, "max_tokens": max_tokens,
                       "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]}
            data = self._post(endpoint, payload)
            text = data["choices"][0]["message"]["content"]
            self.tokens += int(data.get("usage", {}).get("completion_tokens", 0))
        else:  # Ollama native
            payload = {"model": self.model, "stream": False,
                       "options": {"temperature": self.temperature, "num_predict": max_tokens},
                       "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]}
            data = self._post(self.url + "/api/chat", payload)
            text = data["message"]["content"]
            self.tokens += int(data.get("eval_count", 0))
        self.seconds += time.time() - t0
        return text.strip()

    def _post(self, url: str, payload: dict) -> dict:
        req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                     headers={"Content-Type": "application/json"})
        # never route through a system proxy: the medium is meant to be local
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
        with opener.open(req, timeout=self.timeout) as r:
            return json.loads(r.read())


EPITAPH_SYSTEM = (
    "You write epitaphs for deleted source files, for a Dia de los Muertos ofrenda "
    "that honors code a project has retired. Be warm, a little eerie, and witty, never mocking. "
    "Use ONLY the facts given. Do not invent people, dates, numbers, bugs or features. "
    "Be specific, not generic: the epitaph must play on something particular to THIS file, such as "
    "its name, what its last lines of code do, or the words of its cause of death. "
    "Avoid stock phrases like 'silent echo', 'testament', 'digital dust' and 'legacy of code'. "
    "Reply with exactly two lines and nothing else:\n"
    "EPITAPH: <one line, at most 14 words, like words carved on a headstone>\n"
    "REMEMBRANCE: <two sentences, at most 50 words, about the file's life and why it was laid to rest>"
)


FORMAT_REMINDER = "\nAnswer in exactly this format, both lines required:\nEPITAPH: ...\nREMEMBRANCE: ...\n"


def facts_block(d: Departed) -> str:
    who = ", ".join(d.authors[:4]) + (f" and {len(d.authors) - 4} others" if len(d.authors) > 4 else "")
    lw = "\n".join(d.last_words[-8:]) or "(empty)"
    years = life(d)
    return (
        f"File: {d.path}\n"
        f"Born: {d.born} (added by {d.born_by}: \"{d.born_message}\")\n"
        f"Died: {d.died} (removed by {d.died_by})\n"
        f"Cause of death (the commit message that removed it): \"{d.cause}\"\n"
        f"Lived: {years}, touched by {d.commits} commits, tended by {len(d.authors)} people ({who})\n"
        f"Size when it died: {d.lines} lines\n"
        f"Buried alongside: {d.siblings} other files in the same commit\n"
        f"Its last lines of code:\n{lw}\n"
    )


def unquote(t: str) -> str:
    t = t.strip().strip("* ").strip()
    while len(t) > 1 and t[0] in '"\u201c' and t[-1] in '"\u201d' and t[1:-1].count('"') % 2 == 0 \
            and "\u201c" not in t[1:-1]:
        t = t[1:-1].strip()
    return t


def parse_epitaph(text: str) -> tuple[str, str] | None:
    text = text.replace("**", "")
    m1 = re.search(r"EPITAPH\s*:\s*(.+)", text, re.I)
    m2 = re.search(r"REMEMBRANCE\s*:\s*(.+(?:\n(?!EPITAPH).+)*)", text, re.I)
    if not m1 or not m2:
        return None
    ep = unquote(m1.group(1))
    rem = unquote(" ".join(m2.group(1).split()))
    if not ep or not rem or len(ep.split()) > 22 or len(rem.split()) > 90:
        return None
    return ep, rem


def template_epitaph(d: Departed) -> tuple[str, str]:
    years = life(d)
    return (f"{d.name}, {d.born[:4]} to {d.died[:4]}. It ran its course.",
            f"Added by {d.born_by} and tended across {d.commits} commits over {years}. "
            f"Laid to rest by {d.died_by}: \"{d.cause}\".")


def number_check(d: Departed, text: str) -> bool:
    """Reject text that cites a number not present in the facts (a cheap
    guard against the model inventing statistics)."""
    allowed = set(re.findall(r"\d+", facts_block(d))) | {"1", "2", "one", "two"}
    years = d.lifespan_days // 365
    allowed |= {str(years), str(years + 1)}
    return all(n in allowed for n in re.findall(r"\d+", text))


def write_epitaph(medium: Medium, d: Departed, tries: int = 3) -> Departed:
    for _ in range(tries):
        try:
            out = medium.chat(EPITAPH_SYSTEM, facts_block(d) + FORMAT_REMINDER)
        except (urllib.error.URLError, TimeoutError, KeyError) as e:
            print(f"  medium unreachable: {e}", file=sys.stderr)
            break
        got = parse_epitaph(out)
        if got and number_check(d, " ".join(got)):
            d.epitaph, d.remembrance = got
            d.written_by = medium.model
            return d
    d.epitaph, d.remembrance = template_epitaph(d)
    d.written_by = "template"
    return d


SEANCE_SYSTEM = (
    "You are the ghost of a deleted source file, speaking at a seance. Speak in first person, "
    "in 2 to 4 sentences, gently haunting and a little funny. You only know what is in your "
    "record below: your history and your last lines of code. If asked something your record does "
    "not answer, say the veil hides it. Never invent people, dates, or events.\n\nYOUR RECORD:\n"
)


def seance(medium: Medium, d: Departed, question: str) -> str:
    return medium.chat(SEANCE_SYSTEM + facts_block(d), question, max_tokens=200)


# --------------------------------------------------------------------------
# the altar: markdown + a static html ofrenda
# --------------------------------------------------------------------------

def life(d: Departed) -> str:
    n = d.lifespan_days
    if n >= 365:
        y = n // 365
        return f"{y} year" if y == 1 else f"{y} years"
    return "1 day" if n == 1 else f"{n} days"


def render_md(repo_name: str, souls: list, meta: dict) -> str:
    out = [f"# Ofrenda for {repo_name}", "",
           f"*{len(souls)} departed files, remembered by {meta['model']} running locally. "
           f"Built with git-ofrenda {__version__}.*", ""]
    for d in souls:
        out += [f"## {d.path}", "", f"> **{d.epitaph}**", "",
                f"{d.born} to {d.died} · {life(d)} · {d.commits} commits · {len(d.authors)} keepers", "",
                d.remembrance, "",
                f"*Cause of death:* `{d.died_commit}` {d.cause}", "",
                "<details><summary>Last words</summary>", "", "```", *d.last_words, "```", "</details>", ""]
    return "\n".join(out)


HTML_HEAD = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ofrenda for {title}</title>
<style>
:root{{--bg:#140b1f;--card:#1f1230;--marigold:#f59e0b;--rose:#f472b6;--ink:#f3e8ff;--dim:#b8a3cf}}
*{{box-sizing:border-box}}body{{margin:0;background:radial-gradient(circle at 50% -10%,#3b1d5a,var(--bg) 60%);color:var(--ink);font:16px/1.55 Georgia,serif}}
.picado{{height:46px;background:repeating-linear-gradient(90deg,var(--marigold) 0 60px,var(--rose) 60px 120px,#a78bfa 120px 180px,#34d399 180px 240px);
-webkit-mask:radial-gradient(circle at 30px 46px,transparent 18px,#000 19px) 0 0/60px 46px;mask:radial-gradient(circle at 30px 46px,transparent 18px,#000 19px) 0 0/60px 46px}}
header{{text-align:center;padding:28px 16px 8px}}h1{{font-size:clamp(28px,5vw,46px);margin:.2em 0;color:var(--marigold);letter-spacing:.02em}}
header p{{color:var(--dim);max-width:640px;margin:0 auto}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;max-width:1180px;margin:26px auto;padding:0 18px 40px}}
.stone{{background:linear-gradient(180deg,#2a1840,var(--card));border:1px solid #3d2a57;border-radius:120px 120px 14px 14px;padding:34px 22px 20px;position:relative;box-shadow:0 10px 30px #0008}}
.stone:before{{content:"\\1F56F";position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:26px;filter:drop-shadow(0 0 10px #f59e0bcc)}}
.path{{font:13px ui-monospace,Menlo,monospace;color:var(--marigold);text-align:center;word-break:break-all}}
.ep{{font-size:19px;font-style:italic;text-align:center;margin:12px 0}}
.dates{{text-align:center;color:var(--dim);font-size:13px}}
.rem{{font-size:15px;margin:12px 0}}
.cause{{font:12px ui-monospace,Menlo,monospace;color:#fbcfe8;background:#0006;padding:6px 8px;border-radius:6px}}
details{{margin-top:10px}}summary{{cursor:pointer;color:var(--dim);font-size:13px}}
pre{{font:11.5px/1.45 ui-monospace,Menlo,monospace;background:#0009;padding:10px;border-radius:6px;overflow:auto;color:#d9f99d;max-height:220px}}
.by{{font-size:11px;color:#7c6a92;text-align:right;margin-top:8px}}
footer{{text-align:center;color:var(--dim);font-size:13px;padding:0 16px 40px}}footer a{{color:var(--marigold)}}
</style></head><body><div class="picado"></div>
<header><h1>Ofrenda for {title}</h1><p>{sub}</p></header><main class="grid">
"""


def render_html(repo_name: str, souls: list, meta: dict) -> str:
    e = html.escape
    sub = (f"{len(souls)} files this project laid to rest, found in its git history and remembered by "
           f"{e(meta['model'])} running locally on {e(meta.get('machine', 'my machine'))}. "
           f"Dates, causes and last lines are straight from git; only the epitaphs are the model's.")
    parts = [HTML_HEAD.format(title=e(repo_name), sub=sub)]
    for d in souls:
        parts.append(
            f'<article class="stone"><div class="path">{e(d.path)}</div>'
            f'<p class="ep">{e(d.epitaph)}</p>'
            f'<div class="dates">{e(d.born)} &mdash; {e(d.died)} &middot; {life(d)} &middot; {d.commits} commits &middot; {len(d.authors)} keepers</div>'
            f'<p class="rem">{e(d.remembrance)}</p>'
            f'<div class="cause">&#9904; {e(d.died_commit)} {e(d.cause)}</div>'
            f'<details><summary>Last words ({d.lines} lines at death)</summary><pre>{e(chr(10).join(d.last_words))}</pre></details>'
            f'<div class="by">written by {e(d.written_by)}</div></article>')
    parts.append(f'</main><footer>Made with <a href="https://github.com/aniruddhaadak80/API_projects/tree/main/git-ofrenda">git-ofrenda</a>'
                 f' {__version__}. {e(meta.get("note", ""))}</footer></body></html>')
    return "\n".join(parts)


# --------------------------------------------------------------------------
# cli
# --------------------------------------------------------------------------

def default_url() -> str:
    return os.environ.get("OFRENDA_URL", "http://localhost:11434")


def cmd_build(a) -> int:
    repo = os.path.abspath(a.repo)
    name = a.name or os.path.basename(repo.rstrip("/"))
    print(f"\U0001F56F  digging through {name}'s history...", file=sys.stderr)
    deaths = find_deaths(repo)
    print(f"   {len(deaths)} files were buried and never came back", file=sys.stderr)
    souls = choose(deaths, repo, a.limit, a.ext)
    medium = Medium(a.url, a.model, a.temperature)
    t0 = time.time()
    for i, d in enumerate(souls, 1):
        if not a.no_model:
            write_epitaph(medium, d)
        else:
            d.epitaph, d.remembrance = template_epitaph(d)
            d.written_by = "template"
        print(f"   [{i}/{len(souls)}] {d.path}: {d.epitaph}", file=sys.stderr)
    took = time.time() - t0
    meta = {"model": a.model if not a.no_model else "no model", "machine": a.machine,
            "seconds": round(took, 1), "tokens": medium.tokens, "buried_total": len(deaths),
            "note": a.note or ""}
    os.makedirs(a.out, exist_ok=True)
    with open(os.path.join(a.out, "souls.json"), "w") as f:
        json.dump({"repo": name, "meta": meta, "souls": [asdict(s) for s in souls]}, f, indent=2)
    with open(os.path.join(a.out, "OFRENDA.md"), "w") as f:
        f.write(render_md(name, souls, meta))
    with open(os.path.join(a.out, "index.html"), "w") as f:
        f.write(render_html(name, souls, meta))
    tmpl = sum(1 for s in souls if s.written_by == "template")
    print(f"\U0001F33C altar built in {a.out}/ ({len(souls)} souls, {took:.0f}s, "
          f"{tmpl} fell back to the plain template)", file=sys.stderr)
    return 0


def cmd_render(a) -> int:
    with open(os.path.join(a.out, "souls.json")) as f:
        data = json.load(f)
    souls = [Departed(**s) for s in data["souls"]]
    with open(os.path.join(a.out, "OFRENDA.md"), "w") as f:
        f.write(render_md(data["repo"], souls, data["meta"]))
    with open(os.path.join(a.out, "index.html"), "w") as f:
        f.write(render_html(data["repo"], souls, data["meta"]))
    print(f"re-rendered {a.out}/ from souls.json", file=sys.stderr)
    return 0


def cmd_list(a) -> int:
    deaths = find_deaths(os.path.abspath(a.repo))
    for p, (c, dt, who, msg, n) in sorted(deaths.items(), key=lambda kv: kv[1][1], reverse=True)[: a.limit]:
        print(f"{dt}  {c[:8]}  {p}  ({msg})")
    print(f"{len(deaths)} buried files", file=sys.stderr)
    return 0


def cmd_seance(a) -> int:
    repo = os.path.abspath(a.repo)
    deaths = find_deaths(repo)
    if a.path not in deaths:
        near = [p for p in deaths if a.path in p][:5]
        print(f"No grave for {a.path}." + (f" Did you mean: {', '.join(near)}" if near else ""), file=sys.stderr)
        return 1
    d = exhume(repo, a.path, deaths[a.path])
    medium = Medium(a.url, a.model, a.temperature)
    print(f"\U0001F56F  the candles flicker... {d.name} ({d.born} to {d.died}) is here.\n")
    questions = [a.ask] if a.ask else None
    while True:
        q = questions.pop(0) if questions else (None if a.ask else input("you> ").strip())
        if not q or q in {"exit", "quit", "bye"}:
            break
        print(f"{d.name}> {seance(medium, d, q)}\n")
        if a.ask and not questions:
            break
    return 0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="ofrenda", description="An ofrenda for the code your repo buried.")
    p.add_argument("--version", action="version", version=__version__)
    sub = p.add_subparsers(dest="cmd", required=True)

    def common(sp):
        sp.add_argument("repo", nargs="?", default=".")
        sp.add_argument("--url", default=default_url(),
                        help="Ollama (http://localhost:11434) or OpenAI-compatible server (http://localhost:8080/v1)")
        sp.add_argument("--model", default=os.environ.get("OFRENDA_MODEL", "gemma3:1b"))
        sp.add_argument("--temperature", type=float, default=0.7)

    b = sub.add_parser("build", help="find the departed and build the altar")
    common(b)
    b.add_argument("--limit", type=int, default=12)
    b.add_argument("--ext", nargs="*", help="only files ending in these, e.g. .js .py")
    b.add_argument("--out", default="ofrenda")
    b.add_argument("--name")
    b.add_argument("--machine", default="my machine")
    b.add_argument("--note")
    b.add_argument("--no-model", action="store_true", help="facts-only altar, no model")
    b.set_defaults(fn=cmd_build)

    l = sub.add_parser("list", help="list buried files, newest deaths first")
    l.add_argument("repo", nargs="?", default=".")
    l.add_argument("--limit", type=int, default=40)
    l.set_defaults(fn=cmd_list)

    r = sub.add_parser("render", help="re-render OFRENDA.md and index.html from souls.json")
    r.add_argument("--out", default="ofrenda")
    r.set_defaults(fn=cmd_render)

    s = sub.add_parser("seance", help="ask a dead file a question")
    common(s)
    s.add_argument("path")
    s.add_argument("--ask", help="one question, non-interactive")
    s.set_defaults(fn=cmd_seance)

    a = p.parse_args(argv)
    return a.fn(a)


if __name__ == "__main__":
    sys.exit(main())
