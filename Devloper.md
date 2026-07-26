# Voiceover Studio (Offline Desktop App)

Script likho → AI voice generate karo → apni video ke saath merge karo. Ek baar install karne ke baad, sirf "Generate AI Voice" step ke liye internet chahiye hota hai (Microsoft ki free voice service use hoti hai) — baaki sab (recording, merging, exporting) 100% offline hai, apne PC pe.

## Ek baar setup karna hai (sirf development machine pe)

Requirement: [Node.js](https://nodejs.org) installed hona chahiye (LTS version).

```bash
cd voiceover-studio-app
npm install
```

## App test karne ke liye (bina installer banaye)

```bash
npm start
```

## Installer (.exe) banane ke liye — jo kisi bhi Windows PC pe install ho sake

```bash
npm run build:win
```

Ye command `dist/` folder mein ek `Voiceover Studio Setup <version>.exe` installer bana degi. Ye file kisi bhi Windows PC pe copy karke double-click se install ho jayegi — us PC pe Node.js ya kuch bhi install karne ki zaroorat nahi hai, sab kuch (ffmpeg included) andar hi bundled hai.

> Note: Windows installer best banta hai Windows PC pe hi (ya Wine setup ke saath Linux/Mac se). Agar tum khud Windows pe development kar rahe ho, seedha `npm run build:win` chala do.

Linux/Mac ke liye:
```bash
npm run build:linux   # AppImage
npm run build:mac     # dmg
```

## App kaise use karein

1. **Choose Video File** — apna voiceless video select karo
2. **Script** likho (ya diya hua default use karo)
3. **Voice** choose karo (Indian English/Hindi voices available hain)
4. **Speed/Pitch** adjust karo, ya "Match speed to video length" click karke auto-calculate karo
5. **Generate AI Voice** — internet chahiye is step ke liye (few seconds lagte hain)
6. Audio preview sun lo
7. **Merge Voice into Video & Save** — final narrated video save ho jayegi jahan tum chaho

## GitHub se automatically .exe banwana (bina apne PC pe build kiye)

Is project mein `.github/workflows/build.yml` already included hai. Bas:

1. Ye poora folder ek naye GitHub repo mein push kar do (`node_modules` push mat karna — `.gitignore` already usse exclude karta hai)
2. GitHub pe repo ke **Actions** tab mein jao
3. Push hote hi (ya "Run workflow" button se manually) build automatically shuru ho jayega — GitHub ka apna Windows server exe banayega
4. Build complete hone ke baad, us workflow run ke **Artifacts** section mein "voiceover-studio-windows-installer" milega — download karke kisi bhi PC pe install kar sakte ho

Agar tum ek proper **versioned release** chahte ho (jaise v1.0.0), to ek git tag push karo:
```bash
git tag v1.0.0
git push origin v1.0.0
```
Isse installer automatically GitHub ke **Releases** page pe bhi attach ho jayega, seedha wahan se link share kar sakte ho.

## Local build vs GitHub build

| | Local build | GitHub Actions |
|---|---|---|
| Setup needed | Node.js apne PC pe | Kuch nahi, sab GitHub ke server pe |
| Speed | ~1-2 min | ~3-5 min (server cold start ke wajah se) |
| Symlink/permission issues | Kabhi kabhi aate hain (Windows) | Nahi aate — GitHub ka runner clean hota hai |
| Best for | Quick local testing | Final distributable installer, sharing with others |


- Electron (desktop shell)
- `msedge-tts` — free, unlimited Microsoft neural voices (same engine as edge-tts CLI)
- `ffmpeg-static` + `fluent-ffmpeg` — bundled ffmpeg binary, video/audio merge, koi separate install nahi chahiye
- Plain HTML/CSS/JS — no framework, lightweight

## Project structure

```
voiceover-studio-app/
├── main.js           # Electron main process — window, TTS, ffmpeg merge logic
├── preload.js         # Secure bridge between UI and main process
├── package.json        # Dependencies + electron-builder config
└── renderer/
    └── index.html      # The app UI
```
