import {
  FinalReport,
  Finding,
  LocalCluster,
  ProblemBrief,
  Project,
  SourcePlatform,
  WorkspaceSettings,
} from '@/types/problemhub';

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
    clusters: [],
    brief: null,
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
      },
      {
        id: 'FND-103',
        quote:
          'Sumpah kesel banget pas mau bayar QRIS di kasir, kode OTP buat verifikasi ulang malah nggak masuk-masuk sampai 3 menit. Dilihatin orang belakang antrian.',
        author: '@dinda.fshn',
        source: 'Instagram',
        referenceUrl: 'https://instagram.com/p/C9xK2L9p',
        createdAt: '2026-11-22',
        status: 'Pain Point',
        folder: 'Pembayaran & QRIS',
        labels: ['Gagal OTP', 'QRIS & Kasir'],
        quadrant: 'Feels',
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
      },
    ],
  },
  {
    id: 'proj-checkout-umkm',
    name: 'Riset Checkout UMKM',
    description:
      'Analisis drop-off pada halaman keranjang dan checkout toko online UMKM lokal.',
    createdAt: '2026-11-18',
    clusters: [],
    brief: null,
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
        quote: `Serius nanya, kenapa masalah "${kw}" masih aja kejadian tiap jam sibuk? Bikin transaksi ke-hold padahal lagi buru-buru.`,
        author: '@naufal_ux',
        source: 'X / Twitter',
        referenceUrl: `https://x.com/search?q=${encodeURIComponent(kw)}`,
        createdAt: today,
        status: 'Raw / Perlu Triage',
        folder: targetFolder,
        labels: [],
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
      quote: `Baru nyoba "${kw}" barusan, kok malah muter-muter loading terus ya pas mau konfirmasi? Jadi ragu saldonya kepotong apa nggak.`,
      author: '@aldi_uxnote',
      source: 'X / Twitter',
      referenceUrl: `https://x.com/search?q=${encodeURIComponent(kw)}`,
      createdAt: today,
      status: 'Raw / Perlu Triage',
      folder: targetFolder,
      labels: [],
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
    },
    {
      id: `FND-${nextCodeStart + 2}`,
      quote: `Udah update versi terbaru tapi masalah "${kw}" masih muncul kalau sinyal agak lemah. Harusnya ada mode ringan atau retry otomatis.`,
      author: 'Bagus Prakoso (Play Store)',
      source: 'Play Store',
      referenceUrl: 'https://play.google.com/store',
      createdAt: today,
      status: 'Raw / Perlu Triage',
      folder: targetFolder,
      labels: [],
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
  project: Project,
  mode: 'ai' | 'local'
): FinalReport {
  const activeFindings = project.findings.filter(
    (f) => f.status !== 'Noise / Archived'
  );
  const codedFindings = activeFindings.filter(
    (f) => f.status === 'Pain Point' || f.status === 'Workaround'
  );
  const pool = codedFindings.length > 0 ? codedFindings : activeFindings;

  const painCount = pool.filter((f) => f.status === 'Pain Point').length;
  const workaroundCount = pool.filter((f) => f.status === 'Workaround').length;
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
      ? project.brief?.problemStatement ||
        `Berdasarkan sintesis lintas-sumber pada proyek "${project.name}", ditemukan pola friksi berulang pada area ${themeText} (${pool.length} temuan aktif). Hambatan ini menyebabkan keraguan transaksi, penurunan penyelesaian alur, serta munculnya workaround manual di luar produk.`
      : `Kompilasi lokal (0% AI) untuk "${project.name}": tercatat ${painCount} Pain Point dan ${workaroundCount} Workaround dari ${activeFindings.length} temuan aktif pada tema ${themeText}.`;

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
