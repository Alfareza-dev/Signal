import {
  ActionRecommendation,
  FinalReport,
  Finding,
  LocalCluster,
  MonitoredAccount,
  MoscowItem,
  ProblemBrief,
  Project,
  ResearchVersion,
  SourcePlatform,
  ThresholdConfig,
  WorkspaceSettings,
} from '@/types/problemhub';

export const DEFAULT_THRESHOLD_CONFIG: ThresholdConfig = {
  scoreThreshold: 10,
  parameters: [
    {
      id: 'param-keyword',
      type: 'keyword',
      title: 'Kata kunci / diksi tertentu',
      description: 'Mendeteksi kata kunci friksi atau keluhan produk pada teks.',
      points: 5,
      active: true,
      keywords: ['gagal', 'admin', 'error', 'ongkir', 'ribet', 'ke-lock', 'batal', 'otp'],
    },
    {
      id: 'param-interactions',
      type: 'interactions',
      title: 'Jumlah interaksi (Likes + Share + Komentar)',
      description: 'Postingan dengan engagement tinggi menandakan dampak luas.',
      points: 4,
      active: true,
      minInteractions: 500,
    },
    {
      id: 'param-verified',
      type: 'verified',
      title: 'Status verifikasi akun',
      description: 'Akun terverifikasi / kreator dengan jangkauan audiens besar.',
      points: 3,
      active: true,
    },
    {
      id: 'param-media',
      type: 'media',
      title: 'Sertaan media (Foto/Video/Link)',
      description: 'Menyertakan bukti screenshot, video error, atau tautan.',
      points: 2,
      active: true,
    },
    {
      id: 'param-direct-tag',
      type: 'direct_tag',
      title: 'Jenis Mention: Tag Langsung / Balasan',
      description: 'Pengguna menyebut akun resmi brand secara langsung (@brand).',
      points: 3,
      active: false,
    },
    {
      id: 'param-repeat',
      type: 'repeat_reporter',
      title: 'Pengguna Berulang (Repeat Reporter)',
      description: 'Pengguna yang sudah melaporkan keluhan serupa lebih dari 1x.',
      points: 2,
      active: false,
    },
  ],
};

export const INITIAL_MONITORED_ACCOUNTS: MonitoredAccount[] = [
  {
    id: 'acc-1',
    handle: '@ewallet_care',
    platform: 'X / Twitter',
    category: 'Official Support & Mention',
    active: true,
    lastChecked: '5 menit lalu',
  },
  {
    id: 'acc-2',
    handle: '@umkm_store.id',
    platform: 'Instagram',
    category: 'Komentar & Tag Produk',
    active: true,
    lastChecked: '12 menit lalu',
  },
  {
    id: 'acc-3',
    handle: 'com.ewallet.id (v4.12)',
    platform: 'Play Store',
    category: 'Ulasan Bintang 1–3',
    active: true,
    lastChecked: '30 menit lalu',
  },
  {
    id: 'acc-4',
    handle: 'OpenAlex · Fintech & Checkout UX',
    platform: 'Jurnal (OpenAlex)',
    category: 'Publikasi Akademik 2024–2026',
    active: true,
    lastChecked: '2 jam lalu',
  },
];

export const DEFAULT_SETTINGS: WorkspaceSettings = {
  strictZeroAI: false,
  localClusteringModel: 'minilm-l12-v2',
  llmProvider: 'gemini-flash-lite',
  apiKey: 'AIzaSyDemo-Signal-UXR-Key-9921',
  ollamaBaseUrl: 'http://localhost:11434',
  monthlyTokenCap: 100000,
  maxQuotesPerCall: 20,
  enableCache: true,
  cacheHits: 2,
  enabledSources: {
    twitter: true,
    instagram: true,
    playStore: true,
    openAlex: true,
  },
  maxItemsPerScrape: 50,
  proxyEndpoint: '',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-ewallet-genz',
    name: 'Riset E-Wallet Gen-Z',
    description:
      'Eksplorasi hambatan transaksi harian, biaya admin, dan keandalan OTP pada pengguna e-wallet usia 18–25 tahun.',
    createdAt: '2026-11-20',
    activeVersionId: 'v1',
    farmingPresets: [
      {
        id: 'preset-1',
        name: 'Pantau Biaya Admin & QRIS',
        queryPreview: '("biaya admin" OR "potongan") AND ("qris" OR "transfer")',
        keywords: ['biaya admin', 'potongan', 'qris', 'transfer'],
        operator: 'AND',
        folder: 'Pembayaran & QRIS',
        schedule: {
          enabled: true,
          date: '2026-11-28',
          time: '09:00',
          frequency: 'Harian',
        },
        savedAt: '2026-11-24',
      },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1',
        keywordQuery: '("biaya admin" OR "top-up" OR "otp") AND "ewallet"',
        createdAt: '2026-11-20',
        notes: 'Eksplorasi awal keluhan biaya admin, top-up minimarket, dan kegagalan OTP.',
        schedule: {
          enabled: true,
          date: '2026-11-28',
          time: '09:00',
          frequency: 'Harian',
        },
        clusters: [],
        brief: null,
        finalReport: null,
        findings: [
          {
            id: 'FND-101',
            quote:
              'Setiap kali mau transfer saldo dari e-wallet ke rekening bank kena admin Rp2.500. Kalau sehari transfer 3 kali aja udah habis buat biaya admin doang.',
            author: '@rafli_prtm',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/rafli_prtm/status/18923411',
            createdAt: '2026-11-21',
            status: 'Pain Point',
            folder: 'Biaya & Top-Up',
            labels: ['Biaya Admin'],
            quadrant: 'Says',
            likes: 185,
            shares: 38,
            comments: 27,
            interactions: 250,
            isVerified: false,
            hasMedia: true,
            isDirectTag: true,
            mentionedAccount: '@ewallet_care',
          },
          {
            id: 'FND-102',
            quote:
              'Top-up lewat Alfamart/Indomaret sekarang potongannya Rp2.000 belum lagi antri kasirnya lama banget pas jam pulang kerja.',
            author: 'Nadia Kusuma (Play Store Review)',
            source: 'Play Store',
            referenceUrl: 'https://play.google.com/store/apps/details?id=ewallet.id',
            createdAt: '2026-11-21',
            status: 'Pain Point',
            folder: 'Biaya & Top-Up',
            labels: ['Top-Up Minimarket', 'Biaya Admin'],
            quadrant: 'Feels',
            likes: 34,
            shares: 2,
            comments: 6,
            interactions: 42,
            isVerified: false,
            hasMedia: false,
          },
          {
            id: 'FND-103',
            quote:
              'Sumpah kesel banget @ewallet_care pas mau bayar QRIS di kasir, kode OTP buat verifikasi ulang malah nggak masuk-masuk sampai 3 menit. Dilihatin orang belakang antrian.',
            author: '@dinda.fshn',
            source: 'Instagram',
            referenceUrl: 'https://instagram.com/p/C9xK2L9p',
            createdAt: '2026-11-22',
            status: 'Pain Point',
            folder: 'Pembayaran & QRIS',
            labels: ['Gagal OTP', 'QRIS & Kasir'],
            quadrant: 'Feels',
            likes: 490,
            shares: 84,
            comments: 46,
            interactions: 620,
            isVerified: true,
            hasMedia: true,
            isDirectTag: true,
            mentionedAccount: '@ewallet_care',
          },
          {
            id: 'FND-104',
            quote:
              'Trik aku biar nggak kena biaya admin pas top-up: transfer dulu dari bank digital gratis ke rekening virtual bank lain, baru pindah ke e-wallet. Agak ribet tapi lumayan hemat.',
            author: '@bintang_tech',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/bintang_tech/status/18928842',
            createdAt: '2026-11-22',
            status: 'Workaround',
            folder: 'Biaya & Top-Up',
            labels: ['Biaya Admin', 'Top-Up Minimarket'],
            quadrant: 'Does',
            likes: 310,
            shares: 120,
            comments: 45,
            interactions: 475,
            isVerified: false,
            hasMedia: false,
          },
          {
            id: 'FND-105',
            quote:
              'Kadang mikir apa emang sengaja ya OTP SMS-nya dibikin telat biar kita pindah ke verifikasi WhatsApp yang berbayar atau gimana?',
            author: 'Rizky Ramadhan',
            source: 'Play Store',
            referenceUrl: 'https://play.google.com/store/apps/details?id=ewallet.id',
            createdAt: '2026-11-23',
            status: 'Raw / Perlu Triage',
            folder: 'Autentikasi & OTP',
            labels: [],
            quadrant: 'Thinks',
            likes: 14,
            shares: 1,
            comments: 3,
            interactions: 18,
          },
          {
            id: 'FND-106',
            quote:
              'Penelitian menunjukkan bahwa perceived switching cost dan biaya administrasi mikro berpengaruh signifikan terhadap retensi pengguna Gen-Z pada layanan dompet digital di Indonesia.',
            author: 'Sari & Wijaya (2025) — Jurnal Sistem Informasi',
            source: 'Jurnal (OpenAlex)',
            referenceUrl: 'https://openalex.org/W4391204412',
            createdAt: '2026-11-23',
            status: 'Pain Point',
            folder: 'Biaya & Top-Up',
            labels: ['Biaya Admin'],
            likes: 48,
            shares: 19,
            comments: 5,
            interactions: 72,
          },
          {
            id: 'FND-107',
            quote:
              'Kalau saldo lagi mepet di minimarket dan QRIS error, aku selalu siapin uang cash Rp50rb di casing HP buat jaga-jaga daripada gagal bayar.',
            author: '@caca_mryn',
            source: 'Instagram',
            referenceUrl: 'https://instagram.com/p/C9zM1Q0r',
            createdAt: '2026-11-24',
            status: 'Workaround',
            folder: 'Pembayaran & QRIS',
            labels: ['QRIS & Kasir'],
            quadrant: 'Does',
            likes: 92,
            shares: 18,
            comments: 12,
            interactions: 122,
          },
          {
            id: 'FND-108',
            quote:
              'Kenapa sih fitur split bill-nya tersembunyi banget di menu Lainnya? Padahal pas nongkrong bareng temen itu fitur yang paling sering dibutuhin.',
            author: '@kevinalfarizi',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/kevinalfarizi/status/18931002',
            createdAt: '2026-11-24',
            status: 'Pain Point',
            folder: 'UX & Navigasi',
            labels: ['UX Navigasi'],
            quadrant: 'Says',
            likes: 64,
            shares: 11,
            comments: 9,
            interactions: 84,
          },
          {
            id: 'FND-109',
            quote:
              'PROMO GAJIAN!! Klik link di bio buat dapetin saldo kaget 500rb hari ini juga!! #giveaway #cuan',
            author: '@cuan_harian99',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/cuan_harian99/status/18935512',
            createdAt: '2026-11-25',
            status: 'Noise / Archived',
            folder: 'Umum',
            labels: ['Spam'],
            likes: 2,
            shares: 0,
            comments: 0,
            interactions: 2,
          },
          {
            id: 'FND-110',
            quote:
              'Login di HP baru minta OTP berkali-kali tapi tetap invalid padahal kode yang dimasukin udah bener, akhirnya akun ke-lock 1 jam.',
            author: 'Fajar Nugroho (Play Store Review)',
            source: 'Play Store',
            referenceUrl: 'https://play.google.com/store/apps/details?id=ewallet.id',
            createdAt: '2026-11-25',
            status: 'Raw / Perlu Triage',
            folder: 'Autentikasi & OTP',
            labels: [],
            likes: 29,
            shares: 3,
            comments: 7,
            interactions: 39,
          },
          {
            id: 'FND-111',
            quote:
              'Studi empiris pada transaksi QRIS menunjukkan bahwa latensi di atas 5 detik pada jam sibuk menurunkan tingkat kepercayaan pengguna muda terhadap keandalan pembayaran non-tunai.',
            author: 'Kusuma & Hartono (2025) — Journal of Fintech UX',
            source: 'Jurnal (OpenAlex)',
            referenceUrl: 'https://openalex.org/W4395119023',
            createdAt: '2026-11-25',
            status: 'Raw / Perlu Triage',
            folder: 'Pembayaran & QRIS',
            labels: [],
            likes: 31,
            shares: 9,
            comments: 4,
            interactions: 44,
          },
          {
            id: 'FND-112',
            quote:
              'Suka banget sama fitur catatan pengeluaran otomatis di @ewallet_care! Tiap akhir bulan langsung kelihatan jajan kopi habis berapa tanpa perlu catat manual.',
            author: '@alya_fin',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/alya_fin/status/18939001',
            createdAt: '2026-11-26',
            status: 'Positif / Delighter',
            folder: 'UX & Navigasi',
            labels: ['Insight Pengeluaran'],
            quadrant: 'Feels',
            likes: 142,
            shares: 25,
            comments: 14,
            interactions: 181,
            mentionedAccount: '@ewallet_care',
          },
          {
            id: 'FND-113',
            quote:
              'Scan QRIS versi update terbaru jauh lebih ngebut, baru diarahin ke kasir langsung kebaca kurang dari 1 detik. Mantap!',
            author: 'Bagas Prakoso (Play Store Review)',
            source: 'Play Store',
            referenceUrl: 'https://play.google.com/store/apps/details?id=ewallet.id',
            createdAt: '2026-11-26',
            status: 'Positif / Delighter',
            folder: 'Pembayaran & QRIS',
            labels: ['QRIS & Kasir'],
            quadrant: 'Says',
            likes: 76,
            shares: 5,
            comments: 8,
            interactions: 89,
          },
        ],
      },
      {
        id: 'v2',
        label: 'v2',
        keywordQuery: '("qris" OR "split bill") AND ("kasir" OR "cepat")',
        createdAt: '2026-11-26',
        notes: 'Iterasi lanjutan pasca rilis perbaikan latensi QRIS & navigasi Split Bill.',
        clusters: [],
        brief: null,
        finalReport: null,
        findings: [
          {
            id: 'FND-120',
            quote:
              'Setelah update kemarin, scan QRIS di kedai kopi udah cepet banget sih, tapi kalau sinyal 4G lemah masih suka muter 4 detik.',
            author: '@rafi_ux',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/rafi_ux/status/18940111',
            createdAt: '2026-11-26',
            status: 'Pain Point',
            folder: 'Pembayaran & QRIS',
            labels: ['QRIS & Kasir'],
            quadrant: 'Says',
            likes: 112,
            shares: 14,
            comments: 19,
            interactions: 145,
            mentionedAccount: '@ewallet_care',
          },
          {
            id: 'FND-121',
            quote:
              'Mantap @ewallet_care sekarang shortcut Split Bill udah muncul di halaman utama, nongkrong bareng anak kos jadi gampang banget patungannya!',
            author: '@tania_k',
            source: 'Instagram',
            referenceUrl: 'https://instagram.com/p/C9new123',
            createdAt: '2026-11-27',
            status: 'Positif / Delighter',
            folder: 'UX & Navigasi',
            labels: ['UX Navigasi'],
            quadrant: 'Feels',
            likes: 540,
            shares: 65,
            comments: 38,
            interactions: 643,
            isVerified: true,
            hasMedia: true,
            mentionedAccount: '@ewallet_care',
          },
          {
            id: 'FND-122',
            quote:
              'Kalau lagi offline pas di parkiran basement, aku foto dulu QRIS-nya terus bayar pakai fitur Upload QR dari galeri pas udah naik ke lantai atas.',
            author: '@denny_pratama',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/denny_pratama/status/18940998',
            createdAt: '2026-11-27',
            status: 'Raw / Perlu Triage',
            folder: 'Pembayaran & QRIS',
            labels: [],
            likes: 45,
            shares: 12,
            comments: 6,
            interactions: 63,
          },
        ],
      },
    ],
  },
  {
    id: 'proj-checkout-umkm',
    name: 'Riset Checkout UMKM',
    description:
      'Analisis drop-off pada halaman keranjang dan checkout toko online UMKM lokal.',
    createdAt: '2026-11-18',
    activeVersionId: 'v1',
    farmingPresets: [],
    versions: [
      {
        id: 'v1',
        label: 'v1',
        keywordQuery: '("ongkir" OR "checkout") AND "umkm"',
        createdAt: '2026-11-18',
        notes: 'Audit awal kendala ongkir mahal dan panjangnya form checkout toko UMKM.',
        clusters: [],
        brief: null,
        finalReport: null,
        findings: [
          {
            id: 'FND-201',
            quote:
              'Harga keripik singkongnya cuma Rp18.000, tapi pas mau checkout ongkirnya Rp24.000. Langsung batal beli deh.',
            author: '@melani_s',
            source: 'Instagram',
            referenceUrl: 'https://instagram.com/p/C9aB881x',
            createdAt: '2026-11-19',
            status: 'Pain Point',
            folder: 'Ongkir & Logistik',
            labels: ['Ongkir Mahal'],
            quadrant: 'Says',
            likes: 420,
            shares: 72,
            comments: 44,
            interactions: 536,
            hasMedia: true,
            mentionedAccount: '@umkm_store.id',
          },
          {
            id: 'FND-202',
            quote:
              'Alur checkout-nya panjang banget! Harus bikin akun dulu, verifikasi email, isi alamat manual dari provinsi sampai kode pos. Keburu males.',
            author: 'Hendra Wijaya',
            source: 'Play Store',
            referenceUrl: 'https://play.google.com/store/apps/details?id=umkm.shop',
            createdAt: '2026-11-20',
            status: 'Pain Point',
            folder: 'Alur Checkout',
            labels: ['Alur Checkout Panjang'],
            quadrant: 'Feels',
            likes: 88,
            shares: 14,
            comments: 11,
            interactions: 113,
          },
          {
            id: 'FND-203',
            quote:
              'Daripada ribet ngisi form di web toko UMKM-nya, aku langsung screenshot keranjang terus chat admin lewat WhatsApp aja buat minta totalan + transfer.',
            author: '@tania.kitchen',
            source: 'X / Twitter',
            referenceUrl: 'https://x.com/tania_kitchen/status/18911209',
            createdAt: '2026-11-21',
            status: 'Workaround',
            folder: 'Alur Checkout',
            labels: ['Alur Checkout Panjang'],
            quadrant: 'Does',
            likes: 150,
            shares: 39,
            comments: 18,
            interactions: 207,
          },
          {
            id: 'FND-204',
            quote:
              'Faktor biaya pengiriman yang melebihi 40% nilai produk menjadi penyebab utama cart abandonment pada e-commerce UMKM di kota tier-2.',
            author: 'Pratama et al. (2025) — Journal of Digital Commerce',
            source: 'Jurnal (OpenAlex)',
            referenceUrl: 'https://openalex.org/W4398871201',
            createdAt: '2026-11-22',
            status: 'Raw / Perlu Triage',
            folder: 'Ongkir & Logistik',
            labels: [],
            likes: 22,
            shares: 7,
            comments: 3,
            interactions: 32,
          },
          {
            id: 'FND-205',
            quote:
              'Open jasa tambah followers dan likes UMKM murah meriah amanah, DM sekarang kak!',
            author: '@jasapromo_indo',
            source: 'Instagram',
            referenceUrl: 'https://instagram.com/p/C9spam123',
            createdAt: '2026-11-23',
            status: 'Noise / Archived',
            folder: 'Umum',
            labels: ['Spam'],
            likes: 1,
            shares: 0,
            comments: 0,
            interactions: 1,
          },
          {
            id: 'FND-206',
            quote:
              'Seneng banget toko @umkm_store.id udah dukung pembayaran QRIS instan tanpa perlu kirim bukti transfer manual lagi!',
            author: '@rizka_craft',
            source: 'Instagram',
            referenceUrl: 'https://instagram.com/p/C9pos881',
            createdAt: '2026-11-24',
            status: 'Positif / Delighter',
            folder: 'Alur Checkout',
            labels: ['Pembayaran Instan'],
            quadrant: 'Feels',
            likes: 195,
            shares: 28,
            comments: 21,
            interactions: 244,
            mentionedAccount: '@umkm_store.id',
          },
        ],
      },
    ],
  },
];

export function generateMockIntakeFindings(
  sourceTab: 'all' | 'social' | 'openalex' | 'csv',
  keyword: string,
  folderName: string,
  rawCsvText: string,
  nextCodeStart: number,
  enabledSources: WorkspaceSettings['enabledSources'] = DEFAULT_SETTINGS.enabledSources
): Finding[] {
  const today = new Date().toISOString().slice(0, 10);
  const kw = keyword.trim() || 'aplikasi';
  const targetFolder = folderName.trim() || 'Inbox / Riset Baru';

  if (sourceTab === 'all') {
    const candidates: Omit<Finding, 'id'>[] = [];
    if (enabledSources.twitter) {
      candidates.push({
        quote: `Serius nanya @signal_pay, kenapa masalah "${kw}" masih aja kejadian tiap jam sibuk? Bikin transaksi ke-hold padahal lagi buru-buru.`,
        author: '@naufal_ux',
        source: 'X / Twitter',
        referenceUrl: `https://x.com/search?q=${encodeURIComponent(kw)}`,
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
        likes: 412,
        shares: 96,
        comments: 44,
        interactions: 552,
        isVerified: true,
        hasMedia: true,
        isDirectTag: true,
        mentionedAccount: '@signal_pay',
      });
    }
    if (enabledSources.instagram) {
      candidates.push({
        quote: `Barusan ngalamin "${kw}" lagi pas mau bayar, akhirnya harus ulang dari awal dan cek mutasi berkali-kali biar tenang.`,
        author: '@clarissa.id',
        source: 'Instagram',
        referenceUrl: 'https://instagram.com/explore',
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
        likes: 185,
        shares: 21,
        comments: 30,
        interactions: 236,
        hasMedia: true,
      });
    }
    if (enabledSources.playStore) {
      candidates.push({
        quote: `Tolong perbaiki kendala "${kw}" di update berikutnya. Udah kasih bintang 3 dulu karena cukup sering menghambat pemakaian harian.`,
        author: 'Dimas Setiawan (Play Store)',
        source: 'Play Store',
        referenceUrl: 'https://play.google.com/store',
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
        likes: 64,
        shares: 4,
        comments: 9,
        interactions: 77,
      });
    }
    if (enabledSources.openAlex) {
      candidates.push({
        quote: `Temuan riset terkait "${kw}" menunjukkan bahwa ketidakpastian status sistem dan biaya tak terduga meningkatkan tingkat drop-off pengguna hingga 34%.`,
        author: 'Wibowo & Lestari (2025) — OpenAlex',
        source: 'Jurnal (OpenAlex)',
        referenceUrl: `https://openalex.org/works?search=${encodeURIComponent(kw)}`,
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
        likes: 28,
        shares: 15,
        comments: 4,
        interactions: 47,
      });
    }
    if (enabledSources.twitter) {
      candidates.push({
        quote: `Karena sering kena "${kw}", sekarang aku selalu screenshot bukti halaman sebelum klik konfirmasi buat jaga-jaga kalau perlu komplain CS.`,
        author: '@hana_prd',
        source: 'X / Twitter',
        referenceUrl: `https://x.com/search?q=${encodeURIComponent(kw)}`,
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
        likes: 219,
        shares: 53,
        comments: 19,
        interactions: 291,
        hasMedia: true,
      });
      candidates.push({
        quote: `Jujur setelah update terbaru, alur "${kw}" di @signal_pay jauh lebih cepat dan transparan sih! Notifikasinya instan dan UI-nya bersih banget.`,
        author: '@farhan.design',
        source: 'X / Twitter',
        referenceUrl: `https://x.com/search?q=${encodeURIComponent(kw)}`,
        createdAt: today,
        status: 'Positif / Delighter',
        folder: targetFolder,
        labels: ['UI Clean', 'Pengalaman Cepat'],
        likes: 534,
        shares: 88,
        comments: 37,
        interactions: 659,
        isVerified: true,
        isDirectTag: true,
        mentionedAccount: '@signal_pay',
      });
    }

    return candidates.map((item, idx) => ({
      id: `FND-${nextCodeStart + idx}`,
      ...item,
    }));
  }

  if (sourceTab === 'csv') {
    const lines = rawCsvText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const items = lines.length > 0 ? lines.slice(0, 5) : [
      `Keluhan pengguna terkait "${kw}": proses verifikasi lambat saat jam sibuk.`,
      `Masukan CSV: pengguna berharap ada opsi ringkasan biaya sebelum konfirmasi akhir.`,
    ];

    return items.map((line, idx) => ({
      id: `FND-${nextCodeStart + idx}`,
      quote: line.replace(/^["']|["']$/g, ''),
      author: 'Import CSV / Responden',
      source: 'CSV / Manual' as SourcePlatform,
      referenceUrl: 'local://import-csv',
      createdAt: today,
      status: 'Raw / Perlu Triage',
      folder: targetFolder,
      labels: [],
    }));
  }

  if (sourceTab === 'openalex') {
    return [
      {
        id: `FND-${nextCodeStart}`,
        quote: `Studi empiris terkait "${kw}" menemukan bahwa friksi pada tahap otentikasi dan transparansi biaya menurunkan tingkat penyelesaian transaksi hingga 31%.`,
        author: 'Hidayat & Putri (2025) — OpenAlex',
        source: 'Jurnal (OpenAlex)',
        referenceUrl: `https://openalex.org/works?search=${encodeURIComponent(kw)}`,
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
      },
      {
        id: `FND-${nextCodeStart + 1}`,
        quote: `Analisis UX pada "${kw}" menunjukkan pengguna muda cenderung meninggalkan alur jika terdapat lebih dari 3 langkah konfirmasi tanpa estimasi total biaya di awal.`,
        author: 'Nugraha et al. (2026) — OpenAlex',
        source: 'Jurnal (OpenAlex)',
        referenceUrl: `https://openalex.org/works?search=${encodeURIComponent(kw)}`,
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
      },
    ];
  }

  // social
  return [
    {
      id: `FND-${nextCodeStart}`,
      quote: `Baru nyoba "${kw}" barusan @signal_pay, kok malah muter-muter loading terus ya pas mau konfirmasi? Jadi ragu saldonya kepotong apa nggak.`,
      author: '@aldi_uxnote',
      source: 'X / Twitter',
      referenceUrl: `https://x.com/search?q=${encodeURIComponent(kw)}`,
      createdAt: today,
      status: 'Raw / Perlu Triage',
      folder: targetFolder,
      labels: [],
      likes: 492,
      shares: 112,
      comments: 47,
      interactions: 651,
      isVerified: true,
      isDirectTag: true,
      mentionedAccount: '@signal_pay',
    },
    {
      id: `FND-${nextCodeStart + 1}`,
      quote: `Plis perbaiki bagian "${kw}" dong min, masa tiap kali butuh cepat malah error terus. Kemarin temenku sampe batal transaksi.`,
      author: '@sinta.dw',
      source: 'Instagram',
      referenceUrl: 'https://instagram.com/explore',
      createdAt: today,
      status: 'Raw / Perlu Triage',
      folder: targetFolder,
      labels: [],
      likes: 230,
      shares: 34,
      comments: 29,
      interactions: 293,
      hasMedia: true,
    },
    {
      id: `FND-${nextCodeStart + 2}`,
      quote: `Suka banget sama pembaruan "${kw}" minggu ini! Prosesnya kerasa mulus dan nggak bikin bingung lagi buat pemula.`,
      author: 'Bagus Prakoso (Play Store)',
      source: 'Play Store',
      referenceUrl: 'https://play.google.com/store',
      createdAt: today,
      status: 'Positif / Delighter',
      folder: targetFolder,
      labels: ['Delighter', 'UI Clean'],
      likes: 168,
      shares: 19,
      comments: 12,
      interactions: 199,
    },
  ];
}

export function buildLocalClusters(findings: Finding[]): LocalCluster[] {
  const cleanFindings = findings.filter(
    (f) => f.status === 'Pain Point' || f.status === 'Workaround'
  );

  const map = new Map<string, Finding[]>();
  for (const f of cleanFindings) {
    const primaryTheme = f.labels[0] || f.folder || 'Tema Umum';
    const existing = map.get(primaryTheme) || [];
    existing.push(f);
    map.set(primaryTheme, existing);
  }

  const clusters: LocalCluster[] = [];
  let idx = 1;
  for (const [theme, items] of map.entries()) {
    const painCount = items.filter((i) => i.status === 'Pain Point').length;
    const workaroundCount = items.filter((i) => i.status === 'Workaround').length;
    const description =
      items.length === 1
        ? 'Temuan tunggal terdeteksi oleh analisis semantik lokal (MiniLM) — belum memiliki duplikat makna.'
        : `${painCount} Pain Point dan ${workaroundCount} Workaround terkelompok otomatis berdasarkan kemiripan semantik lokal (MiniLM).`;

    clusters.push({
      id: `CLU-${idx++}`,
      theme,
      description,
      findingIds: items.map((i) => i.id),
      frequency: items.length,
      selected: idx <= 3, // auto-select top 2 by default
    });
  }

  return clusters.sort((a, b) => b.frequency - a.frequency);
}

export function buildProblemBrief(
  projectName: string,
  selectedClusters: LocalCluster[],
  allFindings: Finding[]
): ProblemBrief {
  const selectedIds = new Set(selectedClusters.flatMap((c) => c.findingIds));
  const matchedFindings = allFindings.filter((f) => selectedIds.has(f.id));
  const themes = selectedClusters.map((c) => c.theme);
  const totalCount = matchedFindings.length;
  const painCount = matchedFindings.filter((f) => f.status === 'Pain Point').length;
  const workaroundCount = matchedFindings.filter(
    (f) => f.status === 'Workaround'
  ).length;
  const socialCount = matchedFindings.filter(
    (f) => f.source === 'X / Twitter' || f.source === 'Instagram'
  ).length;

  const dominantClassification: ProblemBrief['dominantClassification'] =
    workaroundCount >= painCount && workaroundCount > 0
      ? 'Workaround — Goldmine Ide Fitur'
      : 'Pain Point';

  const reach = Math.min(10, Math.max(3, Math.round(4 + totalCount * 1.1)));
  const severity = Math.min(
    10,
    Math.max(4, Math.round(5 + painCount * 1.0 + workaroundCount * 0.6))
  );
  const virality = Math.min(10, Math.max(3, Math.round(4 + socialCount * 1.4)));

  const impactNumeric = Number(((reach + severity + virality) / 3).toFixed(1));
  const impactLevel: ProblemBrief['impactLevel'] =
    impactNumeric >= 8.0 ? 'Critical' : impactNumeric >= 6.5 ? 'High' : 'Medium';

  const themeListStr = themes.join(', ');

  return {
    id: `BRF-${Date.now().toString().slice(-4)}`,
    generatedAt: new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    clusterThemes: themes,
    problemStatement: `Pada proyek "${projectName}", pengguna mengalami friksi berulang pada area ${themeListStr} (${totalCount} temuan tervalidasi). Hambatan utama muncul pada titik kritis transaksi sehingga memicu keraguan, kegagalan penyelesaian alur, serta ketergantungan pada workaround manual di luar aplikasi.`,
    dominantClassification,
    impactMatrix: {
      reach,
      severity,
      virality,
    },
    impactScore: `${impactNumeric}/10`,
    impactLevel,
    evidenceQuotes: matchedFindings.slice(0, 6).map((f) => ({
      id: f.id,
      quote: f.quote,
      source: f.source,
    })),
    recommendation: `Prioritaskan perbaikan pada alur ${themes[0] || 'utama'} dengan memangkas langkah verifikasi yang rentan gagal, menampilkan transparansi biaya sejak awal, dan menguji prototipe perbaikan kepada 5–8 responden segmen target.`,
    tokensUsed: 420 + totalCount * 45,
    cached: true,
  };
}

export function buildFinalReport(
  projectName: string,
  version: ResearchVersion,
  mode: 'ai' | 'local'
): FinalReport {
  const activeFindings = version.findings.filter(
    (f) => f.status !== 'Noise / Archived'
  );
  const codedFindings = activeFindings.filter(
    (f) => f.status === 'Pain Point' || f.status === 'Workaround'
  );
  const pool = codedFindings.length > 0 ? codedFindings : activeFindings;

  const painCount = pool.filter((f) => f.status === 'Pain Point').length;
  const workaroundCount = pool.filter((f) => f.status === 'Workaround').length;
  const positiveCount = activeFindings.filter((f) => f.status === 'Positif / Delighter').length;
  const socialCount = pool.filter(
    (f) => f.source === 'X / Twitter' || f.source === 'Instagram'
  ).length;

  const dominantClassification: FinalReport['dominantClassification'] =
    workaroundCount >= painCount && workaroundCount > 0
      ? 'Workaround — Goldmine Ide Fitur'
      : 'Pain Point';

  const reach = Math.min(10, Math.max(3, Math.round(4 + pool.length * 0.9)));
  const severity = Math.min(
    10,
    Math.max(4, Math.round(5 + painCount * 0.9 + workaroundCount * 0.6))
  );
  const virality = Math.min(10, Math.max(3, Math.round(4 + socialCount * 1.2)));
  const impactNumeric = Number(((reach + severity + virality) / 3).toFixed(1));
  const impactLevel: FinalReport['impactLevel'] =
    impactNumeric >= 8.0 ? 'Critical' : impactNumeric >= 6.5 ? 'High' : 'Medium';

  const themes = Array.from(
    new Set(pool.flatMap((f) => (f.labels.length > 0 ? f.labels : [f.folder])))
  ).slice(0, 4);
  const themeText = themes.length > 0 ? themes.join(', ') : 'pengalaman pengguna';

  const getQuadrantQuotes = (q: 'Says' | 'Thinks' | 'Feels' | 'Does') =>
    activeFindings
      .filter((f) => f.quadrant === q)
      .slice(0, 2)
      .map((f) => `${f.id}: "${f.quote}"`);

  const problemStatement =
    mode === 'ai'
      ? version.brief?.problemStatement ||
        `Berdasarkan sintesis lintas-sumber pada proyek "${projectName}" (${version.label}), ditemukan pola friksi berulang pada area ${themeText} (${pool.length} temuan aktif). Hambatan ini menyebabkan keraguan transaksi, penurunan penyelesaian alur, serta munculnya workaround manual di luar produk.`
      : `Kompilasi lokal (0% AI) untuk "${projectName}" (${version.label}): tercatat ${painCount} Pain Point, ${workaroundCount} Workaround, dan ${positiveCount} Positif/Delighter dari ${activeFindings.length} temuan aktif pada tema ${themeText}.`;

  const recommendations =
    mode === 'ai'
      ? [
          `Sederhanakan titik friksi utama pada tema ${themes[0] || 'prioritas'} dengan memangkas langkah konfirmasi yang berulang.`,
          `Tambahkan transparansi biaya/status secara real-time di awal alur agar pengguna tidak beralih ke workaround manual.`,
          `Validasi prototipe perbaikan bersama 5–8 responden target dan pantau penurunan keluhan pada kanal X & Play Store.`,
        ]
      : [
          `Tinjau ${painCount} temuan Pain Point pada tema ${themes[0] || 'utama'} bersama tim Product & Engineering.`,
          `Evaluasi ${workaroundCount} pola Workaround pengguna sebagai kandidat ide fitur baru.`,
          `Lengkapi pemetaan Empathy Map untuk temuan yang belum memiliki kuadran.`,
        ];

  return {
    id: `FIN-${Date.now().toString().slice(-4)}`,
    generatedAt: new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    mode,
    problemStatement,
    dominantClassification,
    impactMatrix: { reach, severity, virality },
    impactScore: `${impactNumeric}/10`,
    impactLevel,
    empathySummary: {
      says: getQuadrantQuotes('Says'),
      thinks: getQuadrantQuotes('Thinks'),
      feels: getQuadrantQuotes('Feels'),
      does: getQuadrantQuotes('Does'),
    },
    evidenceQuotes: pool.slice(0, 5).map((f) => ({
      id: f.id,
      quote: f.quote,
      source: f.source,
    })),
    recommendations,
    tokensUsed: mode === 'ai' ? 450 : 0,
  };
}

export interface ScoreBreakdownItem {
  label: string;
  points: number;
}

export interface ScoreEvaluationResult {
  totalScore: number;
  totalInteractions: number;
  passedThreshold: boolean;
  isMentionCollection: boolean;
  urgency: 'Rendah' | 'Sedang' | 'Tinggi';
  breakdown: ScoreBreakdownItem[];
}

export function calculateFindingScore(
  input: {
    quote: string;
    author?: string;
    likes?: number;
    shares?: number;
    comments?: number;
    interactions?: number;
    isVerified?: boolean;
    hasMedia?: boolean;
    isDirectTag?: boolean;
    mentionedAccount?: string;
  },
  config: ThresholdConfig,
  monitoredHandles: string[] = []
): ScoreEvaluationResult {
  const breakdown: ScoreBreakdownItem[] = [];
  const lowerText = input.quote.toLowerCase();
  const lowerMention = (input.mentionedAccount || '').toLowerCase();

  const normalizedHandles = monitoredHandles
    .map((h) => h.trim().toLowerCase())
    .filter((h) => h.startsWith('@') && h.length > 1);

  const isMonitoredMention = normalizedHandles.some(
    (handle) => lowerText.includes(handle) || lowerMention === handle
  );
  const hasMentionMatch =
    isMonitoredMention || Boolean(input.mentionedAccount) || Boolean(input.isDirectTag);

  const computedInteractions =
    (input.likes ?? 0) + (input.shares ?? 0) + (input.comments ?? 0);
  const totalInteractions =
    computedInteractions > 0 ? computedInteractions : (input.interactions ?? 0);

  for (const param of config.parameters) {
    if (!param.active) continue;

    if (param.type === 'keyword') {
      const kws = param.keywords || [];
      const matched = kws.filter((k) => lowerText.includes(k.toLowerCase()));
      if (matched.length > 0) {
        breakdown.push({
          label: `Kata kunci (${matched.slice(0, 2).join(', ')})`,
          points: param.points,
        });
      }
    } else if (param.type === 'interactions') {
      const min = param.minInteractions ?? 500;
      if (totalInteractions >= min) {
        breakdown.push({
          label: `Interaksi ≥ ${min}`,
          points: param.points,
        });
      }
    } else if (param.type === 'verified' && input.isVerified) {
      breakdown.push({ label: 'Akun terverifikasi', points: param.points });
    } else if (param.type === 'media' && input.hasMedia) {
      breakdown.push({ label: 'Sertaan media', points: param.points });
    } else if (param.type === 'direct_tag' && hasMentionMatch) {
      breakdown.push({ label: 'Tag langsung', points: param.points });
    }
  }

  const totalScore = breakdown.reduce((sum, item) => sum + item.points, 0);
  const threshold = Math.max(1, config.scoreThreshold);
  const passedThreshold = totalScore >= threshold;
  const isMentionCollection =
    isMonitoredMention || Boolean(input.mentionedAccount) || totalScore >= threshold;

  const urgency: ScoreEvaluationResult['urgency'] =
    totalScore >= threshold
      ? 'Tinggi'
      : totalScore >= Math.max(1, Math.floor(threshold * 0.5))
      ? 'Sedang'
      : 'Rendah';

  return {
    totalScore,
    totalInteractions,
    passedThreshold,
    isMentionCollection,
    urgency,
    breakdown,
  };
}

export function getEffectiveMoscowItems(version: ResearchVersion): MoscowItem[] {
  if (version.moscowItems && version.moscowItems.length > 0) {
    return version.moscowItems;
  }
  if (version.clusters.length > 0) {
    return version.clusters.map((c, idx) => ({
      id: `msc-${c.id}`,
      title: c.theme,
      sourceType: 'Cluster',
      category:
        idx === 0 ? 'Must-Have' : idx === 1 ? 'Should-Have' : 'Could-Have',
      notes: `${c.frequency} kutipan pendukung`,
    }));
  }
  return [
    {
      id: 'msc-default-1',
      title: 'Transparansi total biaya sebelum konfirmasi pembayaran',
      sourceType: 'Manual',
      category: 'Must-Have',
      notes: 'Menurunkan keraguan checkout',
    },
    {
      id: 'msc-default-2',
      title: 'Status loading & notifikasi instan pasca transaksi',
      sourceType: 'Manual',
      category: 'Should-Have',
      notes: 'Mencegah cek mutasi berulang',
    },
  ];
}

export function getEffectiveActionItems(
  version: ResearchVersion
): ActionRecommendation[] {
  if (version.actionItems && version.actionItems.length > 0) {
    return version.actionItems;
  }
  return [
    {
      id: 'act-1',
      title:
        version.brief?.recommendation ||
        `Sederhanakan langkah konfirmasi pada tema prioritas ${
          version.clusters[0]?.theme || 'utama'
        } & tampilkan rincian biaya sejak awal.`,
      impact: 'Tinggi',
      effort: 'Sedang',
      comments: [],
    },
    {
      id: 'act-2',
      title:
        'Tambahkan indikator status real-time & tombol salin ringkasan transaksi agar pengguna tidak perlu screenshot manual.',
      impact: 'Tinggi',
      effort: 'Rendah',
      comments: [],
    },
  ];
}
