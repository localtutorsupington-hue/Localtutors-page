"""Generate the voiceover (Piper kristin via sherpa-onnx) sentence by sentence and record exact timings.

Writes audio/voiceover.wav and build/timing.json (scene + sentence start/end times).
Captions come from these timings, so they always match the audio.
"""
import json
import re
from pathlib import Path

import numpy as np
import sherpa_onnx
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
M = ROOT / "tts" / "vits-piper-en_US-kristin-medium"
SPEED = 0.88          # a little slower than normal
GAP_SENT = 0.32       # pause between sentences
GAP_SCENE = 0.75      # pause between scenes
LEAD_IN = 0.6

script = (ROOT / "script.md").read_text()
caps = script.split("## Caption text")[1]
scenes = [l.split(". ", 1)[1].strip() for l in caps.strip().splitlines() if re.match(r"^\d\. ", l)]
assert len(scenes) == 7, len(scenes)

cfg = sherpa_onnx.OfflineTtsConfig(
    model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(
            model=str(M / "en_US-kristin-medium.onnx"),
            tokens=str(M / "tokens.txt"),
            data_dir=str(M / "espeak-ng-data"),
        ),
        num_threads=4,
    ),
)
tts = sherpa_onnx.OfflineTts(cfg)
sr = tts.sample_rate


SAY_AS = {"Bent elbow?": "Bent, elbow?"}  # spoken words identical; comma only adds a tiny pause so the t is heard
SLOWER = {"Bent elbow?": 0.85, "Remember: the longer the distance from the joint to the weight's pull, the harder it feels.": 0.8}


def say(text):
    a = tts.generate(SAY_AS.get(text, text), sid=0, speed=SLOWER.get(text, SPEED))
    x = np.array(a.samples, dtype=np.float32)
    # trim leading/trailing near-silence so gaps are exact
    idx = np.nonzero(np.abs(x) > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - int(0.02 * sr)): idx[-1] + int(0.06 * sr)]
    return x


out, t = [np.zeros(int(LEAD_IN * sr), np.float32)], LEAD_IN
timing = []
for si, text in enumerate(scenes):
    sents = re.findall(r"[^.!?]+[.!?]", text)
    assert " ".join(s.strip() for s in sents) == text, (text, sents)
    sc = {"scene": si + 1, "start": round(t, 3), "sentences": []}
    for k, s in enumerate(sents):
        s = s.strip()
        x = say(s)
        sc["sentences"].append({"text": s, "start": round(t, 3), "end": round(t + len(x) / sr, 3)})
        out.append(x)
        t += len(x) / sr
        gap = GAP_SENT if k < len(sents) - 1 else GAP_SCENE
        out.append(np.zeros(int(gap * sr), np.float32))
        t += gap
    sc["end"] = round(t, 3)
    timing.append(sc)
    print(f"scene {si + 1}: {sc['start']:6.2f} - {sc['end']:6.2f}")

y = np.concatenate(out)
y = y / max(1e-6, np.abs(y).max()) * 0.9
sf.write(ROOT / "audio" / "voiceover_raw.wav", y, sr)
json.dump({"sample_rate": sr, "total": round(t, 3), "scenes": timing}, open(ROOT / "build" / "timing.json", "w"), indent=1)
print("total", round(t, 2), "s")
