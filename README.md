# 🎙️ Voiceover Studio

**Write a script → generate an AI voice → merge it into your video. All in one offline desktop app.**

Built for turning voiceless screen recordings (demos, tutorials, ERP walkthroughs) into fully narrated videos — no editing software, no manual audio syncing.

---

## ✨ Features

- 📝 **Script editor** — write or paste your narration, with live word count and duration estimate
- 🗣️ **AI voice generation** — free, natural-sounding neural voices (Indian English, Hindi, US English)
- 🎚️ **Speed & pitch control** — fine-tune the voice, or auto-match its length to your video's duration
- 🎬 **One-click merge** — combines your voice with the video and exports a ready-to-share `.mp4`
- 💾 **Standalone audio export** — save the generated voice as its own `.mp3` file
- 🖥️ **Offline-first** — everything except voice generation runs fully on your machine, no data leaves your PC otherwise

---

## 🔌 Online vs Offline

| Step | Requires Internet? |
|---|---|
| Install & open the app | ❌ No |
| Select video, write script | ❌ No |
| **Generate AI Voice** | ✅ Yes (calls a free neural voice service) |
| Preview audio | ❌ No |
| Merge video + audio | ❌ No |
| Save final video | ❌ No |

Only the voice-generation step needs a connection — everything else runs locally.

---

## 🚀 Getting the app

### Option A — Download the installer
Grab the latest `Voiceover Studio Setup.exe` from the [Releases](../../releases) page (or from the **Actions** tab if built from a branch), double-click, and install like any normal Windows app. No Node.js, Python, or ffmpeg install needed — everything is bundled.

### Option B — Run from source
```bash
git clone <this-repo-url>
cd voiceover-studio-app
npm install
npm start
```

### Option C — Build your own installer
```bash
npm run build:win     # Windows .exe
npm run build:linux    # Linux AppImage
npm run build:mac      # macOS .dmg
```
The installer lands in `dist/`.

### Option D — Let GitHub build it for you
Push this repo to GitHub — the included `.github/workflows/build.yml` automatically builds the Windows installer on every push, no local setup required. Download the result from the workflow's **Artifacts**, or tag a release (`git tag v1.0.0 && git push origin v1.0.0`) to get it attached to a GitHub Release automatically.

---

## 🧭 How to use it

1. **Choose Video File** — select your voiceless recording
2. **Write your script** — the narration you want spoken
3. **Pick a voice**, then adjust **speed/pitch** — or click *"Match speed to video length"* to auto-sync
4. Click **Generate AI Voice** and preview it
5. *(Optional)* **Save Audio Only** to keep the `.mp3` separately
6. Click **Merge Voice into Video & Save** — pick where to save, and you're done

---

## 🛠️ Tech stack

| Purpose | Tool |
|---|---|
| Desktop shell | [Electron](https://www.electronjs.org/) |
| Voice generation | [`msedge-tts`](https://www.npmjs.com/package/msedge-tts) — free, unlimited neural voices |
| Video/audio merging | [`fluent-ffmpeg`](https://www.npmjs.com/package/fluent-ffmpeg) + [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) (bundled, no separate install) |
| UI | Plain HTML/CSS/JS — no framework, lightweight |

---

## 📁 Project structure

```
voiceover-studio-app/
├── main.js                    # Electron main process — window, TTS, ffmpeg merge logic
├── preload.js                  # Secure bridge between UI and main process
├── package.json                 # Dependencies + electron-builder config
├── .github/workflows/build.yml   # Auto-build the Windows installer via GitHub Actions
└── renderer/
    └── index.html              # The app UI
```

---

## ⚠️ Known limitation

Voice generation depends on a free external neural-voice service — if that step ever fails, check your internet connection first. Everything downstream (merge, export) runs entirely offline once the voice file exists.

---

## 📄 License

MIT — use, modify, and share freely.
