"""Tests for git-ofrenda. Run: python3 -m unittest -v test_ofrenda.py
Builds a throwaway git repo with known births, edits, deaths, a rename and a
resurrection, and checks the archaeology. A tiny fake medium (an HTTP server
speaking the OpenAI chat format) checks parsing, the number guard and the
template fallback without needing a real model."""
import json
import os
import subprocess
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer

import ofrenda as o


def sh(repo, *args, date=None, author="Ada <ada@example.com>"):
    env = dict(os.environ, GIT_AUTHOR_NAME=author.split(" <")[0], GIT_COMMITTER_NAME="x",
               GIT_AUTHOR_EMAIL="a@example.com", GIT_COMMITTER_EMAIL="x@example.com")
    if date:
        env["GIT_AUTHOR_DATE"] = env["GIT_COMMITTER_DATE"] = date + "T12:00:00"
    subprocess.run(["git", "-C", repo, *args], check=True, capture_output=True, env=env)


def write(repo, path, text):
    full = os.path.join(repo, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(text)


class Repo(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dir = tempfile.mkdtemp()
        r = cls.dir
        sh(r, "init", "-q", "-b", "main")
        write(r, "src/old.js", "function a(){}\n\nmodule.exports = a\n")
        write(r, "keep.txt", "alive\n")
        write(r, "logo.png", "notreallyapng")
        write(r, "moved.js", "x\n")
        sh(r, "add", "."); sh(r, "commit", "-qm", "first light", date="2020-01-01", author="Ada <a@x>")
        write(r, "src/old.js", "function a(){ return 1 }\n\nmodule.exports = a\n")
        sh(r, "commit", "-qam", "tweak", date="2020-06-01", author="Grace <g@x>")
        sh(r, "mv", "moved.js", "renamed.js"); sh(r, "commit", "-qm", "rename", date="2020-07-01")
        write(r, "phoenix.js", "1\n"); sh(r, "add", "."); sh(r, "commit", "-qm", "phoenix born", date="2020-08-01")
        sh(r, "rm", "-q", "src/old.js", "logo.png", "phoenix.js")
        sh(r, "commit", "-qm", "remove old cruft", date="2022-03-01", author="Linus <l@x>")
        write(r, "phoenix.js", "2\n"); sh(r, "add", "."); sh(r, "commit", "-qm", "phoenix returns", date="2023-01-01")

    def test_finds_only_the_truly_dead(self):
        d = o.find_deaths(self.dir)
        self.assertIn("src/old.js", d)
        self.assertNotIn("logo.png", d)        # binary skipped
        self.assertNotIn("phoenix.js", d)      # resurrected, alive now
        self.assertNotIn("moved.js", d)        # renamed, not deleted
        self.assertNotIn("keep.txt", d)

    def test_exhume_facts(self):
        d = o.find_deaths(self.dir)
        s = o.exhume(self.dir, "src/old.js", d["src/old.js"])
        self.assertEqual(s.born, "2020-01-01")
        self.assertEqual(s.died, "2022-03-01")
        self.assertEqual(s.cause, "remove old cruft")
        self.assertEqual(s.died_by, "Linus")
        self.assertEqual(s.born_by, "Ada")
        self.assertEqual(s.commits, 3)
        self.assertEqual(sorted(s.authors), ["Ada", "Grace"])
        self.assertEqual(s.lifespan_days, 790)
        self.assertEqual(s.lines, 3)
        self.assertEqual(s.last_words[-1], "module.exports = a")
        self.assertEqual(s.siblings, 2)
        self.assertEqual(o.life(s), "2 years")

    def test_choose_and_render(self):
        souls = o.choose(o.find_deaths(self.dir), self.dir, 5, None)
        self.assertEqual([s.path for s in souls], ["src/old.js"])
        for s in souls:
            s.epitaph, s.remembrance = o.template_epitaph(s)
            s.written_by = "template"
        h = o.render_html("t<est>", souls, {"model": "m"})
        self.assertIn("t&lt;est&gt;", h)
        self.assertIn("remove old cruft", h)
        self.assertIn("src/old.js", o.render_md("t", souls, {"model": "m"}))


class Parse(unittest.TestCase):
    def test_parse_ok(self):
        ep, rem = o.parse_epitaph("**EPITAPH:** Here lies core.js.\nREMEMBRANCE: It served.\nIt rests.")
        self.assertEqual(ep, "Here lies core.js.")
        self.assertEqual(rem, "It served. It rests.")

    def test_parse_keeps_inner_quotes(self):
        ep, rem = o.parse_epitaph('EPITAPH: \u201cBody\u201d rejected, a plea.\nREMEMBRANCE: "It served."')
        self.assertEqual(ep, "\u201cBody\u201d rejected, a plea.")
        self.assertEqual(rem, "It served.")

    def test_parse_rejects_rambling(self):
        self.assertIsNone(o.parse_epitaph("Sure! Here are some options for you"))
        self.assertIsNone(o.parse_epitaph("EPITAPH: " + "word " * 40 + "\nREMEMBRANCE: x"))

    def test_number_guard(self):
        s = o.Departed(path="a.js", born="2020-01-01", died="2022-03-01", lifespan_days=790,
                       commits=3, authors=["Ada"], lines=3)
        self.assertTrue(o.number_check(s, "Three commits, 2 years, born 2020"))
        self.assertFalse(o.number_check(s, "It fixed 47 bugs"))


class FakeMedium(BaseHTTPRequestHandler):
    replies = []

    def do_POST(self):
        self.rfile.read(int(self.headers["Content-Length"]))
        text = FakeMedium.replies.pop(0) if FakeMedium.replies else "nonsense"
        if self.path == "/api/chat":  # Ollama native shape
            body = json.dumps({"message": {"content": text}, "eval_count": 5}).encode()
        else:
            body = json.dumps({"choices": [{"message": {"content": text}}],
                               "usage": {"completion_tokens": 5}}).encode()
        self.send_response(200); self.send_header("Content-Type", "application/json"); self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


class MediumTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.srv = HTTPServer(("127.0.0.1", 0), FakeMedium)
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()
        cls.url = f"http://127.0.0.1:{cls.srv.server_port}/v1"

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()

    def soul(self):
        return o.Departed(path="lib/a.js", born="2020-01-01", died="2022-03-01", lifespan_days=790,
                          commits=3, authors=["Ada"], lines=3, cause="cruft", born_by="Ada", died_by="Linus")

    def test_retry_then_accept(self):
        FakeMedium.replies = ["EPITAPH: It fixed 99 bugs\nREMEMBRANCE: lies.",   # invented number
                              "EPITAPH: Here rests a.js.\nREMEMBRANCE: Ada made it. Linus let it go."]
        s = o.write_epitaph(o.Medium(self.url, "fake"), self.soul())
        self.assertEqual(s.epitaph, "Here rests a.js.")
        self.assertEqual(s.written_by, "fake")

    def test_falls_back_to_template(self):
        FakeMedium.replies = ["nope", "still nope", "no"]
        s = o.write_epitaph(o.Medium(self.url, "fake"), self.soul())
        self.assertEqual(s.written_by, "template")
        self.assertIn("cruft", s.remembrance)

    def test_ollama_native_api(self):
        FakeMedium.replies = ["EPITAPH: Rest, a.js.\nREMEMBRANCE: Ada made it."]
        url = self.url.replace("/v1", "")
        m = o.Medium(url, "gemma3:4b")
        s = o.write_epitaph(m, self.soul())
        self.assertEqual(s.epitaph, "Rest, a.js.")
        self.assertEqual(m.tokens, 5)

    def test_unreachable_medium(self):
        s = o.write_epitaph(o.Medium("http://127.0.0.1:9/v1", "x", timeout=2), self.soul())
        self.assertEqual(s.written_by, "template")


if __name__ == "__main__":
    unittest.main()
