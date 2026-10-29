// Data Store: Manages Citizens, ABDM Consent Artifacts, and ASHA Dignity Points
// Offline-first, Persisted in localStorage

export const INITIAL_CITIZENS = [
  {
    id: 'cit-1',
    name: 'सुनीता देवी',
    age: 32,
    gender: 'महिला',
    village: 'सतरिख, बाराबंकी (उ.प्र.)',
    abhaId: '91-4821-3390-1204',
    abhaAddress: 'sunita.devi@abdm',
    healthContext: 'गर्भावस्था जांच (ANC Care) व खून की जांच',
    avatar: '👩🏽',
    status: 'ACTIVE',
    consentId: 'ABDM-CONSENT-2026-0891',
    createdDate: '29 Oct 2026, 11:30 AM',
    validUntil: '31 Oct 2026, 11:30 AM',
    durationHours: 48,
    dignityScore: 100,
    voiceSnippetText: 'डॉक्टर साहब को सिर्फ मेरी इस बीमारी का पर्चा और जांच 2 दिन दिखेगी। और मेरी मर्ज़ी है, मैं जब चाहूँ फोन से मना या रद्द कर सकती हूँ, मेरा इलाज नहीं रुकेगा।',
    audioDuration: '0:14',
    ashaName: 'शांति देवी (ASHA-BRB-108)'
  },
  {
    id: 'cit-2',
    name: 'रामू काका',
    age: 62,
    gender: 'पुरुष',
    village: 'मिल्कीपुर, अयोध्या (उ.प्र.)',
    abhaId: '91-3312-9901-4456',
    abhaAddress: 'ramu.farmer@abdm',
    healthContext: 'शुगर (डायबिटीज) व पुरानी खांसी का इलाज',
    avatar: '👴🏽',
    status: 'ACTIVE',
    consentId: 'ABDM-CONSENT-2026-0892',
    createdDate: '28 Oct 2026, 04:15 PM',
    validUntil: '30 Oct 2026, 04:15 PM',
    durationHours: 48,
    dignityScore: 95,
    voiceSnippetText: 'सिर्फ सरकारी अस्पताल के डॉक्टर बाबू को पर्चा 2 दिन दिखेगा। मेरा राशन पेंशन नहीं कटेगा और मैं कभी भी बंद करा सकता हूँ।',
    audioDuration: '0:12',
    ashaName: 'शांति देवी (ASHA-BRB-108)'
  },
  {
    id: 'cit-3',
    name: 'पूजा कुमारी',
    age: 21,
    gender: 'महिला',
    village: 'मोहद्दीपुर, गोरखपुर (उ.प्र.)',
    abhaId: '91-8819-0211-9982',
    abhaAddress: 'pooja.student@abdm',
    healthContext: 'एनीमिया परामर्श व पोषण सप्लीमेंट्स',
    avatar: '👩🏻',
    status: 'REVOKED',
    consentId: 'ABDM-CONSENT-2026-0870',
    createdDate: '26 Oct 2026, 10:00 AM',
    validUntil: '28 Oct 2026, 10:00 AM',
    durationHours: 48,
    dignityScore: 100,
    voiceSnippetText: 'डॉक्टर सिर्फ 48 घंटे रिपोर्ट देखेंगे। मैं मिस्ड कॉल देकर रोक सकती हूँ।',
    audioDuration: '0:09',
    revokedDate: '27 Oct 2026, 02:20 PM',
    revocationReason: 'परामर्श समाप्त हुआ — नागरिक ने अपनी मर्ज़ी से एक्सेस वापस लिया',
    ashaName: 'शांति देवी (ASHA-BRB-108)'
  }
];

class DataStore {
  constructor() {
    this.STORAGE_KEY = 'merimarzi_consents_v1';
    this.STATS_KEY = 'merimarzi_asha_stats_v1';
    this.consents = this.loadConsents();
    this.stats = this.loadStats();
    this.listeners = [];
  }

  loadConsents() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Storage read err', e);
    }
    return [...INITIAL_CITIZENS];
  }

  saveConsents() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.consents));
    } catch (e) {
      console.warn('Storage write err', e);
    }
    this.notify();
  }

  loadStats() {
    try {
      const raw = localStorage.getItem(this.STATS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Storage stats err', e);
    }
    return {
      totalConsents: 42,
      trueComprehensionRate: 97.6,
      blindYesPrevented: 19,
      misconceptionsResolved: 15,
      dignityPoints: 2150,
      ashaHonorariumBonus: 2150,
      offlineSyncPending: 0
    };
  }

  saveStats() {
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Stats write err', e);
    }
    this.notify();
  }

  subscribe(cb) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb({ consents: this.consents, stats: this.stats }));
  }

  getConsents() {
    return this.consents;
  }

  getStats() {
    return this.stats;
  }

  addConsent(citizenData) {
    const id = 'cit-' + Date.now();
    const consentId = 'ABDM-CONSENT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const expires = new Date(now.getTime() + (citizenData.durationHours || 48) * 60 * 60 * 1000);

    const newRecord = {
      id,
      consentId,
      name: citizenData.name,
      age: citizenData.age || 30,
      gender: citizenData.gender || 'अन्य',
      village: citizenData.village || 'सुल्तानपुर, उ.प्र.',
      abhaId: citizenData.abhaId || ('91-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000)),
      abhaAddress: (citizenData.name.toLowerCase().replace(/\s+/g, '.') + '@abdm'),
      healthContext: citizenData.healthContext || 'सामान्य स्वास्थ्य जांच व दवा पर्चा',
      avatar: citizenData.avatar || '👤',
      status: 'ACTIVE',
      createdDate: now.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      validUntil: expires.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      durationHours: citizenData.durationHours || 48,
      dignityScore: citizenData.dignityScore || 100,
      voiceSnippetText: citizenData.voiceSnippetText,
      audioDuration: citizenData.audioDuration || '0:15',
      audioUrl: citizenData.audioUrl || null,
      ashaName: 'शांति देवी (ASHA-BRB-108)',
      p1Verified: true,
      p2Verified: true,
      p3Verified: true,
      cryptographicHash: 'SHA256:' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    this.consents.unshift(newRecord);
    this.saveConsents();

    // Reward ASHA with Dignity Points & Honorarium
    this.stats.totalConsents += 1;
    this.stats.dignityPoints += 50;
    this.stats.ashaHonorariumBonus += 50;
    this.saveStats();

    return newRecord;
  }

  revokeConsent(consentId, reason = 'नागरिक ने अपनी मर्ज़ी से अनुमति रद्द की') {
    const item = this.consents.find(c => c.consentId === consentId || c.id === consentId);
    if (!item) return null;

    item.status = 'REVOKED';
    item.revokedDate = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    item.revocationReason = reason;

    this.saveConsents();
    return item;
  }

  restoreConsent(consentId) {
    const item = this.consents.find(c => c.consentId === consentId || c.id === consentId);
    if (!item) return null;

    item.status = 'ACTIVE';
    delete item.revokedDate;
    delete item.revocationReason;

    this.saveConsents();
    return item;
  }

  recordBlindYesIntervention() {
    this.stats.blindYesPrevented += 1;
    this.stats.dignityPoints += 20;
    this.saveStats();
  }

  recordMisconceptionResolved() {
    this.stats.misconceptionsResolved += 1;
    this.stats.dignityPoints += 25;
    this.saveStats();
  }
}

export const dataStore = new DataStore();
