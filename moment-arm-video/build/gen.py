"""Fill template.html with timing, captions and a layout; writes video/index.html."""
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
fmt = sys.argv[1] if len(sys.argv) > 1 else "16x9"
T = json.load(open(ROOT / "build" / "timing.json"))
TOTAL = round(T["total"] + 1.2, 3)
LAYOUTS = {
  "16x9": dict(W=1920, H=1080, cap=dict(x=260, y=905, w=1400, h=130, fs=46), maxc=50, L=dict(
      panels=[[470, 830, 1.0], [1130, 830, 1.0]], labelDx=0, labelDy=-636, title=[800, 120], titleFs=64,
      host=[960, 880, 1.15], hostIn=-1300, hostSide=[1700, 860, 0.85], hostEnd=[1560, 880, 1.05],
      **{"def": [640, 760, 0.95]}, rule=[760, 360], ruleW=1000, ruleFs=64)),
  "9x16": dict(W=1080, H=1920, cap=dict(x=60, y=1560, w=960, h=200, fs=50), maxc=34, L=dict(
      panels=[[540, 840, 0.85], [540, 1450, 0.85]], labelDx=0, labelDy=-640, title=[400, 170], titleFs=60,
      host=[540, 1420, 1.4], hostIn=-900, hostSide=[950, 340, 0.45], hostEnd=[540, 1540, 1.0],
      **{"def": [340, 1250, 1.0]}, rule=[540, 380], ruleW=940, ruleFs=56)),
}
cfg = LAYOUTS[fmt]
# captions: one per sentence; long sentences split into word-for-word chunks timed by characters
caps = []
for sc in T["scenes"]:
    for s in sc["sentences"]:
        words = s["text"].split()
        n = -(-len(s["text"]) // cfg["maxc"])  # number of chunks, then balance their lengths
        target = len(s["text"]) / n
        chunks, cur = [], []
        for w in words:
            if cur and len(chunks) < n - 1 and len(" ".join(cur + [w])) > target + 4:
                chunks.append(cur); cur = []
            cur.append(w)
        chunks.append(cur)
        total_chars = sum(len(" ".join(c)) for c in chunks); t = s["start"]; dur = s["end"] - s["start"]
        for c in chunks:
            d = dur * len(" ".join(c)) / total_chars
            caps.append({"text": " ".join(c), "start": round(t, 3), "end": round(t + d, 3)}); t += d
for i in range(len(caps) - 1):  # hold each caption until the next one starts (short gaps only)
    gap = caps[i + 1]["start"] - caps[i]["end"]
    if gap < 0.9: caps[i]["end"] = caps[i + 1]["start"]
# word-for-word check against the script captions
script = (ROOT / "script.md").read_text().split("## Caption text")[1]
want = " ".join(l.split(". ", 1)[1].strip() for l in script.strip().splitlines() if re.match(r"^\d\. ", l))
got = " ".join(c["text"] for c in caps)
assert want == got, "caption text does not match script"
scenes = "\n".join(
    f'      <div id="scene{i}" class="scene clip" data-start="{max(0, sc["start"] - 0.25 if i > 1 else 0):.3f}" '
    f'data-duration="{((T["scenes"][i]["start"] if i < 7 else TOTAL) - max(0, sc["start"] - 0.25 if i > 1 else 0)):.3f}" '
    f'data-track-index="{i}"><svg viewBox="0 0 {cfg["W"]} {cfg["H"]}" id="svg{i}"></svg></div>'
    for i, sc in enumerate(T["scenes"], 1))
c = cfg["cap"]
html = (ROOT / "build" / "template.html").read_text()
for k, v in {"__W__": cfg["W"], "__H__": cfg["H"], "__TOTAL__": TOTAL, "__CAPX__": c["x"], "__CAPY__": c["y"], "__CAPW__": c["w"],
             "__CAPH__": c["h"], "__CAPFS__": c["fs"], "__SCENES__": scenes, "__TIMING__": json.dumps(T), "__CAPS__": json.dumps(caps),
             "__LAYOUT__": json.dumps(cfg["L"])}.items():
    html = html.replace(k, str(v))
out = ROOT / ("video" if fmt == "16x9" else "video-vertical")
out.mkdir(exist_ok=True)
(out / "index.html").write_text(html)
print(fmt, "captions", len(caps), "total", TOTAL, "->", out / "index.html")
