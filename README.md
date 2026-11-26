# Signal — UXR Problem Discovery Workspace

> **Product Ops & UX Research Problem Discovery Platform** dengan arsitektur **Local-First & Low-AI (3-Tier)** yang mengubah keluhan pengguna mentah dari berbagai kanal menjadi *Executive Problem Brief* yang tervalidasi dan dapat dilacak hingga kutipan aslinya (*traceable evidence*).

---

## Ringkasan Konsep

Banyak tim produk terjebak membakar kuota token LLM untuk menganalisis data mentah yang penuh *noise* (spam, komentar tidak relevan) dan melewatkan *qualitative coding*. **Signal** membalik alur tersebut melalui pendekatan **3-Tier Low-AI Architecture**:

1. **Tier 1 — Human Triage & Qualitative Coding (0% AI · Gratis)**  
   Peneliti menyaring `Raw` menjadi `Pain Point`, `Workaround` (*sinyal ide fitur*), atau `Noise / Archived`, memberi label tema, serta memetakan ke **Quadrant Empathy Map** (*Says, Thinks, Feels, Does*) secara lokal di browser.
2. **Tier 2 — Local Semantic Clustering (MiniLM · 0 Token API)**  
   Mengelompokkan temuan bersih (`Pain Point` + `Workaround`) berdasarkan kemiripan tema secara lokal tanpa menyentuh Cloud API.
3. **Tier 3 — On-Demand AI Synthesis (Cached · Hemat Token)**  
   Hanya memanggil LLM saat peneliti benar-benar siap menyusun **Lean Inception Problem Formulation**, lengkap dengan **Impact Matrix (Reach, Severity, Virality)** dan *permanent cache* agar akses ulang menghabiskan `0 Token`.

---

## Fitur Utama

### 1. Isolasi Project & Workspace (`Sidebar` + `LoginScreen`)
- **Split-Screen Login & Local Session:** Halaman masuk dengan animasi alur *Local-First Pipeline* dan sesi yang tersimpan di `localStorage`.
- **Multi-Project Terisolasi:** Dilengkapi 2 project demo realistis (**Riset E-Wallet Gen-Z** dan **Riset Checkout UMKM**) serta modal **`+ Project Baru`**, fitur hapus project, dan tombol **`Reset Demo`**.

### 2. Problem Farming (`+ Ambil Data`)
- **Mode `Semua Sumber (All)`:** 1-klik simulasi scraping lintas platform (**X / Twitter**, **Instagram**, **Google Play Store**, dan **Jurnal Akademik OpenAlex**) berdasarkan keyword riset dan folder tujuan.
- **Tab Spesifik:** Mendukung penarikan per kanal (`Media Sosial`, `Jurnal OpenAlex`, atau `Import CSV / Paste Teks`).
- **Disiplin Data Mentah:** Seluruh temuan baru masuk ke grup `Raw / Perlu Triage` dengan label & kuadran kosong serta badge **`Baru`**.

### 3. Tab `Findings` (Triage & Qualitative Coding)
- **Filter Multi-Dimensi:** Filter berdasarkan **Sumber** (dengan logo brand SVG asli), **Folder**, dan **Pencarian teks/label**.
- **Collapsible Accordion List:** Pengelompokan status (`Raw / Perlu Triage`, `Pain Point`, `Workaround`, `Noise / Archived`).
- **Triage Cepat & Toggle-to-Raw:** Tombol *segmented control* (`Pain`, `Workaround`, `Noise`) yang dapat diklik ulang untuk mengembalikan item ke `Raw`, serta menu popover status pada ikon `ID & Status` bergaya Linear.
- **Inline Tagging & Side Drawer:** Tambah/hapus label langsung di tabel atau klik baris untuk membuka Side Drawer detail lengkap.

### 4. Tab `Empathy Map` (2×2 Quadrant Board)
- Tersinkronisasi otomatis dengan temuan aktif (non-Noise) yang sudah memiliki kuadran (**Says**, **Thinks**, **Feels**, **Does**).
- Dilengkapi pengingat item `Pain Point` / `Workaround` yang belum masuk kuadran serta dropdown pemindahan kuadran langsung di kartu.

### 5. Tab `AI Synthesis` (2-Step Low-AI Pipeline)
- **Efficiency Banner:** Menampilkan perbandingan *Data Mentah vs Data Bersih* serta estimasi persentase penghematan token.
- **Langkah 1 — Local Clustering (MiniLM):** Mengelompokkan temuan bersih dengan deteksi *stale* otomatis apabila data di `Findings` berubah setelah clustering.
- **Langkah 2 — On-Demand AI Synthesis:** Menghasilkan **Lean Inception Problem Formulation Brief**, **Klasifikasi Dominan**, **Impact Matrix (Reach, Severity, Virality)**, dan **Traceable Evidence (`FND-xxx`)** dengan tombol **`Export Markdown (.md)`**.

### 6. Tab `Final Result` (Executive View)
- **Auto-Generate Final Result (Smart Pipeline)** maupun **Compile Laporan Lokal (0% AI)** untuk menyusun dokumen eksekutif bebas distraksi.
- Memuat *Executive Problem Statement*, *Impact Matrix Summary*, *Ringkasan 4 Kuadran Empathy Map*, *Key Traceable Evidence*, dan *Rekomendasi Aksi Produk*, lengkap dengan **`Export Brief (.md)`** dan **`Print / Save PDF`**.

### 7. Tab `Overview` & Menu `Settings`
- **Overview Grid 2×2:** 5 kartu KPI, *Top Tema Masalah* interaktif (klik untuk filter di `Findings`), *Distribusi Sumber Data*, *Cakupan Empathy Map*, dan *Research Health* progress bar.
- **Settings (3-Tier Architecture):** Toggle **`Strict 0% AI Mode`**, pemilihan provider LLM (`Gemini 2.5 Flash-Lite`, `GPT-4o-mini`, `Ollama Self-Hosted`), *Monthly Token Hard Cap*, *AI Cache*, dan toggle sumber scraping aktif.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 (Light Mode · Linear / ClosedLoop AI aesthetic)
- **Icons:** Lucide React + Inline Brand SVGs (X, Instagram, Google Play Store, OpenAlex)
- **State & Persistence:** React State + `localStorage` (Frontend-Only MVP)

---

## Cara Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Build production & typecheck
npx tsc --noEmit && npm run build
```

Buka `http://localhost:3000` di browser untuk mencoba workspace.

---

## Struktur Direktori

```text
src/
├── app/
│   ├── globals.css          # Konfigurasi Tailwind CSS v4 & tipografi
│   ├── layout.tsx           # Metadata Signal & font Inter
│   └── page.tsx             # State utama, localStorage persistence & routing tab
├── components/
│   ├── AISynthesisTab.tsx   # Langkah 1 Clustering Lokal & Langkah 2 On-Demand AI
│   ├── EmpathyMapTab.tsx    # Grid 2x2 Quadrant Empathy Mapping
│   ├── FinalResultTab.tsx   # Executive Brief View & Smart Pipeline
│   ├── FindingDrawer.tsx    # Side Drawer detail & editor metadata temuan
│   ├── FindingsTab.tsx      # Tabel triage, filter sumber/folder, inline tags
│   ├── IntakeModal.tsx      # Modal Problem Farming (All, Medsos, OpenAlex, CSV)
│   ├── LoginScreen.tsx      # Halaman login split-screen dengan animasi pipeline
│   ├── NewProjectModal.tsx  # Modal pembuatan project riset baru
│   ├── OverviewTab.tsx      # Ringkasan KPI & grid analitik 2x2
│   ├── SettingsModal.tsx    # Pengaturan 3-Tier AI, kuota token & sumber scraping
│   ├── Sidebar.tsx          # Navigasi project, mode AI badge, Reset Demo & Logout
│   └── SourceBadge.tsx      # Brand SVG icons & status progress ring icons
├── data/
│   └── mockData.ts          # Data simulasi realistis & generator synthesis lokal
└── types/
    └── problemhub.ts        # Definisi tipe TypeScript (Finding, Project, Settings, dll.)
```
