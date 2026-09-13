# 🌐 onoS Bot Web Dashboard (Next.js + Vercel Ready)

Web Dashboard modern untuk **onoS Bot** yang dibangun menggunakan **Next.js 14**, **TailwindCSS**, dan antarmuka **Obsidian Dark**. Dashboard ini dapat di-deploy ke **Vercel** via **GitHub**, namun **tetap menyimpan seluruh konfigurasi ke file JSON lokal (`data/*.json`)** pada bot Anda melalui **onoS Bot API Bridge**.

---

## 🛠️ Cara Menjalankan Secara Lokal di Komputer

### 1. Jalankan Bot onoS (Termasuk API Bridge di Port 4000)
Buka Terminal / PowerShell 1:
```bash
cd C:\Users\ACER\.gemini\antigravity-ide\scratch\onoS
npm start
```
Bot akan online di Discord dan otomatis mengaktifkan API Bridge di `http://localhost:4000`.

### 2. Jalankan Web Dashboard (Next.js di Port 3000)
Buka Terminal / PowerShell 2:
```bash
cd C:\Users\ACER\.gemini\antigravity-ide\scratch\onoS\dashboard
npm run dev
```
Buka browser Anda di: 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Cara Deploy ke GitHub + Vercel (Online 24/7)

### Langkah 1: Push Dashboard ke GitHub
Anda dapat mengunggah folder `onoS` (atau folder `dashboard` secara terpisah) ke akun GitHub Anda:
```bash
git init
git add .
git commit -m "feat: onoS Bot & Web Dashboard"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

---

### Langkah 2: Hubungkan Bot Lokal ke Internet (Tunnel Gratis)
Agar website di Vercel (Cloud) bisa membaca dan menyimpan ke file JSON di komputer Anda tanpa router port-forwarding:

Jalankan salah satu tunnel gratis ini di komputer Anda:

**Pilihan A — Cloudflare Tunnel (Disarankan, Cepat & Aman):**
```bash
# Download cloudflared atau jalankan via npx:
npx cloudflared tunnel --url http://localhost:4000
```
*Anda akan mendapatkan URL publik seperti:* `https://random-name.trycloudflare.com`

**Pilihan B — Localtunnel (Sangat Mudah):**
```bash
npx localtunnel --port 4000
```
*Anda akan mendapatkan URL publik seperti:* `https://onos-api.loca.lt`

---

### Langkah 3: Deploy di Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **"Add New Project"**.
2. Hubungkan akun GitHub Anda dan pilih repository bot Anda.
3. Jika repository Anda berisi seluruh folder `onoS`, ubah **Root Directory** menjadi `dashboard`.
4. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_BOT_API_URL` : URL Tunnel Anda (contoh: `https://random-name.trycloudflare.com`)
   - `NEXT_PUBLIC_BOT_API_KEY` : `onos-secret-key-2026`
   - `NEXT_PUBLIC_DISCORD_CLIENT_ID` : `1548237217733017610`
5. Klik **Deploy**! Website Anda akan aktif di `https://nama-project.vercel.app`.

---

## 📋 Fitur yang Tersedia di Dashboard

1. **AutoMod Manager**:
   - Saklar ON/OFF Anti-Invite (blokir link server lain).
   - Saklar ON/OFF Anti-Spam (deteksi spam 5 pesan/3 detik).
   - Slider batas maksimal mention.
   - Tambah & hapus kata terlarang (*Badwords blacklist*) secara instan.
2. **Welcome & Autorole Builder**:
   - Dropdown channel sambutan & peran otomatis (*Autorole*).
   - Template pesan dengan variabel dinamis (`{user}`, `{server}`, `{ordinal}`, `{memberCount}`).
   - **Live Preview** kartu embed sambutan seperti di Discord aslinya.
3. **Audit ModLogs**:
   - Menentukan saluran pencatatan pesan dihapus/diedit, member masuk/keluar, dan aksi moderator.
4. **Web Music Player**:
   - Player card interaktif (Nama lagu, thumbnail, progress bar).
   - Tombol kontrol Play/Pause, Skip, Stop, dan slider volume real-time.
   - Daftar antrean lagu yang otomatis ter-update setiap 3 detik.
