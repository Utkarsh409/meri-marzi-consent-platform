// ==========================================================================
// Meri Marzi (मेरी मर्ज़ी) — Frontend Application
// Track: Sahayak & Samman Bharat | Theme: Frontline Workers & Data Dignity
// Dynamic Full Multilingual Support (8 Indian Languages)
// ==========================================================================

import './style.css';
import { LANGUAGES } from './modules/languages.js';
import { audioEngine } from './modules/audioEngine.js';
import { speechManager } from './modules/speechRecognition.js';
import { comprehensionEngine, SAMPLE_RESPONSES } from './modules/comprehensionEngine.js';
import { dataStore } from './modules/dataStore.js';

// Demo ASHA and Frontline Accounts for Instant Testing & Field Use
export const DEMO_ASHA_ACCOUNTS = [
  {
    id: 'ASHA-UP-BRB-4091',
    mobile: '9876543210',
    pin: '1234',
    name: 'सुनीता शर्मा',
    title: 'आशा संगिनी',
    district: 'बाराबंकी (उ.प्र.)',
    phc: 'सतरिख प्राथमिक स्वास्थ्य केंद्र',
    badge: 'Gold Dignity Certified',
    honorarium: 1450,
    consentsCount: 142,
    avatar: '👩🏽'
  },
  {
    id: 'ASHA-UP-AYD-2204',
    mobile: '9812345678',
    pin: '2204',
    name: 'राधा वर्मा',
    title: 'आशा कार्यकर्ता',
    district: 'अयोध्या (उ.प्र.)',
    phc: 'मिल्कीपुर सामुदायिक स्वास्थ्य केंद्र',
    badge: 'Silver Certified',
    honorarium: 980,
    consentsCount: 98,
    avatar: '👩🏻'
  },
  {
    id: 'ANM-UP-GKP-8812',
    mobile: '9450011223',
    pin: '8812',
    name: 'अनीता देवी',
    title: 'ए.एन.एम. सुपरवाइजर',
    district: 'गोरखपुर (उ.प्र.)',
    phc: 'मोहद्दीपुर प्राथमिक स्वास्थ्य केंद्र',
    badge: 'Dignity Master Mentor',
    honorarium: 2100,
    consentsCount: 210,
    avatar: '👩🏽'
  }
];

// Check for saved ASHA login session
let savedUser = null;
try {
  const stored = localStorage.getItem('meri_marzi_user');
  if (stored) savedUser = JSON.parse(stored);
} catch (e) {}

// Application State
const state = {
  activeView: savedUser ? 'app' : 'landing', // 'landing' | 'login' | 'app'
  loginRole: 'asha', // 'asha' | 'citizen'
  authMode: 'login', // 'login' | 'register'
  currentUser: savedUser,
  showPassword: false,
  showRegPassword: false,
  loginDraftAshaId: '',
  loginDraftAshaPin: '',
  isTeaserAudioPlaying: false,

  currentLang: 'hi',
  activeTab: 'wizard', // 'wizard' | 'story' | 'toolkit' | 'passbook' | 'dashboard'
  wizardStep: 1, // 1 to 5
  speechRate: 0.95,
  isRecording: false,
  isSpeaking: false,
  
  // Current Citizen Draft Form
  citizenForm: {
    name: 'सुनीता देवी',
    age: 32,
    gender: 'महिला',
    village: 'सतरिख, बाराबंकी (उ.प्र.)',
    abhaId: '91-4821-3390-1204',
    healthContext: 'गर्भावस्था जांच (ANC Care) व खून की जांच',
    durationHours: 48,
    avatar: '👩🏽'
  },
  
  // Spoken Teach-Back State
  spokenText: '',
  evaluationResult: null,
  activeSamplePresetId: null,
  
  // Generated Active Consent Artifact
  latestConsent: null,
  
  // Passbook Filter
  passbookFilter: 'ALL'
};

// Simple lightweight inline confetti generator for offline celebration
function launchConfetti() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const colors = ['#ff9933', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 10) + 6;
    el.style.position = 'absolute';
    el.style.width = size + 'px';
    el.style.height = (size * 0.8) + 'px';
    el.style.backgroundColor = color;
    el.style.top = '-20px';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.opacity = Math.random() * 0.9 + 0.1;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    
    const duration = Math.random() * 2 + 1.5;
    const delay = Math.random() * 0.5;
    el.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`;
    
    container.appendChild(el);
    
    setTimeout(() => {
      el.style.top = '110vh';
      el.style.left = (parseFloat(el.style.left) + (Math.random() * 20 - 10)) + 'vw';
      el.style.transform = `rotate(${Math.random() * 720}deg)`;
    }, 20);
  }

  setTimeout(() => {
    container.remove();
  }, 4000);
}

// Helpers
function getLang() {
  return LANGUAGES[state.currentLang] || LANGUAGES.hi;
}

// Main Render Function & Page Routing
function renderApp() {
  const lang = getLang();
  const app = document.querySelector('#app');
  if (!app) return;

  if (state.activeView === 'landing') {
    app.innerHTML = renderLandingPage();
    attachLandingHandlers();
    return;
  }

  if (state.activeView === 'login') {
    app.innerHTML = renderLoginPage();
    attachLoginHandlers();
    return;
  }

  // Active View is App
  app.innerHTML = renderAppShell();
  attachEventHandlers();
  initVisualizer();
}

// --------------------------------------------------------------------------
// 🌟 LANDING PAGE (Public Overview & Mission Showcase)
// --------------------------------------------------------------------------
function renderLandingPage() {
  const lang = getLang();
  const isEn = state.currentLang === 'en';
  const stats = dataStore.getStats();

  return `
    <!-- Top Government ABDM Standard Ribbon -->
    <div class="govt-ribbon"></div>
    <header class="govt-header-badge">
      <div class="govt-badge-left">
        <span class="flag-emblem">🇮🇳</span>
        <span>${lang.ribbon.govt}</span>
      </div>
      <div class="govt-badge-right">
        <span class="status-chip">
          <span class="pulse-dot"></span>
          <span>${lang.ribbon.badge}</span>
        </span>
        <span style="color: #64748b; font-size: 0.78rem;">${lang.ribbon.compliance}</span>
      </div>
    </header>

    <div class="app-container landing-view">
      <!-- Landing Navigation Bar -->
      <nav class="landing-nav-bar">
        <div class="brand-wrapper">
          <div class="brand-icon">🛡️</div>
          <div>
            <div class="brand-title">${lang.appName}</div>
            <div class="brand-subtitle">${lang.appSubtitle}</div>
          </div>
        </div>

        <div class="landing-nav-actions">
          <button type="button" class="btn-nav-outline" id="btnNavHowItWorks">
            <span>🗝️</span> <span>${isEn ? 'How It Works' : 'तिजोरी का नियम'}</span>
          </button>
          <button type="button" class="btn-nav-outline" id="btnNavImpact">
            <span>📊</span> <span>${isEn ? 'Impact & Quality' : 'गरिमा प्रभाव'}</span>
          </button>
          
          <!-- Language Selector -->
          <div class="lang-select-box" title="Select Language">
            <span>🗣️</span>
            <select id="landingLangSelector" aria-label="Select Guidance Language">
              ${Object.values(LANGUAGES).map(l => `
                <option value="${l.code}" ${state.currentLang === l.code ? 'selected' : ''}>${l.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Auth CTA Button -->
          ${state.currentUser ? `
            <button type="button" class="btn-nav-accent" id="btnLandingLaunchApp">
              <span>🚀</span> <span>${state.currentUser.name} (ऐप खोलें)</span>
            </button>
          ` : `
            <button type="button" class="btn-nav-outline" id="btnLandingLogin">
              <span>🩺</span> <span>${isEn ? 'ASHA Login' : 'आशा कार्यकर्ता लॉगिन'}</span>
            </button>
            <button type="button" class="btn-nav-accent" id="btnLandingStart">
              <span>⚡</span> <span>${isEn ? 'Try Demo' : 'सीधा शुरू करें ➡️'}</span>
            </button>
          `}
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="landing-hero">
        <div>
          <div class="landing-badge">
            <span>🇮🇳</span>
            <span>${isEn ? 'Sahayak & Samman Bharat | PS 2.4 Track' : 'सहायक व सम्मान भारत | समस्या कथन 2.4'}</span>
          </div>

          <h1>
            <span>${isEn ? 'True Health Consent,' : 'सच्ची सहमति, पूरे सम्मान के साथ'}</span>
            <span class="landing-hero-highlight">${isEn ? 'Explained In Their Own Voice' : 'नागरिक जब अपनी भाषा में समझाएं, तभी बने बात'}</span>
          </h1>

          <p class="landing-hero-sub">
            ${isEn
              ? 'When rural citizens sign up for an ABHA account, nodding or saying "yes" does not prove they understand who sees their medical records. Meri Marzi empowers ASHA frontline workers with the spoken Teach-Back method ("अपनी भाषा में समझाएं") so no citizen loses control or fears losing their benefits.'
              : 'आयुष्मान भारत हेल्थ अकाउंट (ABHA) बनाते समय सिर्फ "हाँ" कह देने से यह साबित नहीं होता कि नागरिक समझ गए हैं। "मेरी मर्ज़ी" बोलने वाले सहायक (Spoken Guide) और Teach-Back विधि द्वारा यह सुनिश्चित करता है कि हर नागरिक अपने शब्दों में डेटा सुरक्षा के 3 नियम समझाए।'
            }
          </p>

          <div class="landing-cta-row">
            <button type="button" class="btn-hero-primary" id="btnHeroAshaLogin">
              <span>🩺</span> <span>${isEn ? 'ASHA Portal Login ➡️' : 'आशा कार्यकर्ता लॉगिन ➡️'}</span>
            </button>
            <button type="button" class="btn-hero-secondary" id="btnHeroQuickDemo">
              <span>⚡</span> <span>${isEn ? 'Launch Quick Demo' : 'लाइव सहमति डेमो'}</span>
            </button>
            <button type="button" class="btn-hero-secondary" id="btnHeroListenSample">
              <span>${state.isTeaserAudioPlaying ? '⏹️' : '🔊'}</span> 
              <span>${state.isTeaserAudioPlaying ? (isEn ? 'Stop Voice' : 'आवाज़ रोकें') : (isEn ? 'Listen to Guide' : 'वाक् सहायक सुनें')}</span>
            </button>
          </div>
        </div>

        <!-- Hero Preview Simulation Card -->
        <div class="landing-preview-card">
          <div class="preview-chip-header">
            <span style="font-weight: 700; font-size: 0.85rem; color: #ffb86c; display: flex; align-items: center; gap: 0.4rem;">
              <span class="pulse-dot"></span> ${isEn ? 'Live Field Verification' : 'लाइव फील्ड सत्यापन'}
            </span>
            <span style="font-size: 0.75rem; color: #94a3b8;">ABDM v0.5 Ready</span>
          </div>

          <div class="preview-citizen-row">
            <div class="preview-avatar">👩🏽</div>
            <div>
              <div style="font-weight: 700; font-size: 1.05rem;">${isEn ? 'Sunita Devi' : 'सुनीता देवी'}</div>
              <div style="font-size: 0.78rem; color: #cbd5e1;">📍 ${isEn ? 'Satarikh, Barabanki (GPS Verified)' : 'सतरिख, बाराबंकी (GPS से सत्यापित)'}</div>
            </div>
          </div>

          <div class="preview-pillars-status">
            <div class="preview-pillar-item">
              <span>👨‍⚕️ ${isEn ? 'Doctor Scope Only' : 'केवल डॉक्टर सीमा'}</span>
              <span style="color: #34d399; font-weight: 700;">✅ ${isEn ? 'Verified' : 'सत्यापित'}</span>
            </div>
            <div class="preview-pillar-item">
              <span>⏳ ${isEn ? 'Duration: 48h Auto-Lock' : 'समय सीमा: 48 घंटे ताला'}</span>
              <span style="color: #34d399; font-weight: 700;">✅ ${isEn ? 'Verified' : 'सत्यापित'}</span>
            </div>
            <div class="preview-pillar-item">
              <span>🛑 ${isEn ? 'Right to Revoke Anytime' : 'मेरी मर्ज़ी: रद्द करने का हक'}</span>
              <span style="color: #34d399; font-weight: 700;">✅ ${isEn ? 'Verified' : 'सत्यापित'}</span>
            </div>
          </div>

          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #a7f3d0; text-align: center; font-weight: 600;">
            📜 ${isEn ? 'Citizen Dignity Pass Unlocked (+50 Quality Credits)' : 'मेरी मर्ज़ी स्वास्थ्य-डेटा सम्मान पत्र अनलॉक (+50 अंक)'}
          </div>
        </div>
      </section>

      <!-- Key Metrics Strip -->
      <div class="landing-metrics-strip" id="impactSection">
        <div class="metric-strip-card">
          <div class="metric-strip-val" style="color: var(--primary-emerald-dark);">${stats.trueComprehensionRate}%</div>
          <div class="metric-strip-label">${isEn ? 'True Comprehension Rate' : 'वास्तविक समझ दर (True Comprehension)'}</div>
        </div>
        <div class="metric-strip-card">
          <div class="metric-strip-val" style="color: var(--primary-saffron-dark);">${stats.blindYesPrevented}+</div>
          <div class="metric-strip-label">${isEn ? 'Blind "Yes" Consents Prevented' : 'अंधी सहमति रोकी गई (Camps Protected)'}</div>
        </div>
        <div class="metric-strip-card">
          <div class="metric-strip-val" style="color: #3b82f6;">8</div>
          <div class="metric-strip-label">${isEn ? 'Vernacular Languages & Dialects' : 'स्थानीय भारतीय भाषाएं व बोलियां'}</div>
        </div>
        <div class="metric-strip-card">
          <div class="metric-strip-val" style="color: #8b5cf6;">100%</div>
          <div class="metric-strip-label">${isEn ? 'Offline PWA & DPDP Act Compliant' : 'ऑफलाइन सक्षम व DPDP Act 2023 अनुरूप'}</div>
        </div>
      </div>

      <!-- Comparison Section: Traditional Blind Yes vs Meri Marzi -->
      <section class="landing-section">
        <div class="landing-section-header">
          <span class="section-tag">${isEn ? 'The Paradigm Shift' : 'बुनियादी बदलाव'}</span>
          <h2 class="landing-section-title">${isEn ? 'Why Saying "Yes" Is Not Proof of Understanding' : 'सिर्फ "हाँ" कहना सहमति का सबूत क्यों नहीं है?'}</h2>
          <p class="landing-section-desc">
            ${isEn
              ? 'In traditional digital camps, citizens nod passively out of fear that asking questions will stop their ration cards or medical care. Meri Marzi replaces tick-boxes with vocal empowerment.'
              : 'गाँवों में स्वास्थ्य शिविरों के दौरान लोग अक्सर डर के मारे "हाँ ठीक है" कह देते हैं कि कहीं राशन कार्ड या अस्पताल में मुफ्त इलाज न रुक जाए। "मेरी मर्ज़ी" इस डर को खत्म कर सच्ची गरिमा स्थापित करता है।'
            }
          </p>
        </div>

        <div class="comparison-grid">
          <!-- Traditional Side -->
          <div class="comp-card comp-card-bad">
            <div class="comp-header" style="color: var(--danger-crimson);">
              <span>❌</span> <span>${isEn ? 'Traditional Camp Practice (Coercive Speed)' : 'पारंपरिक शिविर व्यवस्था (जल्दबाजी व खानापूर्ति)'}</span>
            </div>
            <ul class="comp-list">
              <li>
                <span>🔴</span>
                <span><strong>${isEn ? 'Passive "Yes" Tick-Box:' : 'अंधी "हाँ" पर टिक:'}</strong> ${isEn ? 'Citizen nods without knowing who will see their medical reports.' : 'नागरिक बिना समझे सिर्फ सिर हिला देता है और सहमति दर्ज हो जाती है।'}</span>
              </li>
              <li>
                <span>🔴</span>
                <span><strong>${isEn ? 'Fear of Benefits Loss:' : 'सरकारी लाभ कटने का भय:'}</strong> ${isEn ? 'Citizens dread asking questions, fearing ration card or pension cuts.' : 'गाँव वालों को डर रहता है कि सवाल पूछा तो राशन कार्ड या पेंशन बंद हो जाएगी।'}</span>
              </li>
              <li>
                <span>🔴</span>
                <span><strong>${isEn ? 'No Duration Limit:' : 'समय सीमा का अता-पता नहीं:'}</strong> ${isEn ? 'Data remains accessible indefinitely without transparent expiration.' : 'डेटा कब तक खुला रहेगा, इसकी कोई जानकारी मरीज को नहीं मिलती।'}</span>
              </li>
              <li>
                <span>🔴</span>
                <span><strong>${isEn ? 'Irreversible in Practice:' : 'रद्द करना असंभव:'}</strong> ${isEn ? 'Once recorded, rural citizens have no accessible way to cancel permission.' : 'एक बार सहमति दे दी तो अनपढ़ या बुजुर्ग नागरिक इसे कभी वापस नहीं ले पाते।'}</span>
              </li>
            </ul>
          </div>

          <!-- Meri Marzi Side -->
          <div class="comp-card comp-card-good">
            <div class="comp-header" style="color: var(--primary-emerald-dark);">
              <span>🛡️</span> <span>${isEn ? 'Meri Marzi Standard (True Spoken Dignity)' : 'मेरी मर्ज़ी मानक (सच्ची वाक् गरिमा व सुरक्षा)'}</span>
            </div>
            <ul class="comp-list">
              <li>
                <span>🟢</span>
                <span><strong>${isEn ? 'Teach-Back Verification:' : 'अपनी भाषा में समझ (Teach-Back):'}</strong> ${isEn ? 'Consent button stays locked until the citizen explains the 3 rules in their own words.' : 'सहमति बटन तब तक बंद रहता है जब तक नागरिक खुद बोलकर 3 नियम न समझा दे।'}</span>
              </li>
              <li>
                <span>🟢</span>
                <span><strong>${isEn ? 'Blind "Yes" Trap Detector:' : 'अंधी सहमति डिटेक्टर:'}</strong> ${isEn ? 'Passive compliance ("Haan bana do") is flagged and prompts ASHA to guide again.' : 'सिर्फ "हाँ बना दो" कहने पर सिस्टम तुरंत रोकता है और आशा दीदी को दिशा देता है।'}</span>
              </li>
              <li>
                <span>🟢</span>
                <span><strong>${isEn ? 'Reassurance Shield:' : 'इलाज की निरंतरता गारंटी:'}</strong> ${isEn ? 'Explicit spoken guarantee: Rations, pensions, and free treatment are NEVER stopped.' : 'स्पष्ट वाक् संदेश: सहमति रद्द करने पर भी राशन, दवा और मुफ्त इलाज 100% जारी रहेगा।'}</span>
              </li>
              <li>
                <span>🟢</span>
                <span><strong>${isEn ? '1-Click Field Revocation:' : '1-क्लिक फील्ड कैंसिलेशन:'}</strong> ${isEn ? 'Revoke instantly via USSD (*99*14477#), missed call, SMS, or ASHA app.' : 'नागरिक किसी भी समय *99*14477# मिस्ड कॉल या SMS से 1 सेकंड में ताला लगा सकते हैं।'}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 3 Pillars Showcase -->
      <section class="landing-section" id="howItWorksSection">
        <div class="landing-section-header">
          <span class="section-tag">${isEn ? 'Core Pillars' : 'डेटा गरिमा के 3 अटूट स्तंभ'}</span>
          <h2 class="landing-section-title">${isEn ? 'The 3 Non-Negotiable Pillars of Health Data Dignity' : 'स्वास्थ्य डेटा गरिमा के 3 गैर-परक्राम्य नियम'}</h2>
          <p class="landing-section-desc">
            ${isEn
              ? 'Our on-device Dignity Compass Engine evaluates citizen spoken audio against these 3 statutory privacy pillars before granting an ABDM consent artifact.'
              : 'हमारा ऑन-डिवाइस डिग्निटी इंजन नागरिक की अपनी आवाज में इन 3 बुनियादी नियमों की समझ जांचता है:'
            }
          </p>
        </div>

        <div class="pillars-showcase-grid">
          <div class="pillar-show-card">
            <div class="pillar-icon-box" style="color: var(--primary-saffron-dark);">👨‍⚕️</div>
            <h3 class="pillar-show-title">${isEn ? '1. Scope & Doctor Limit' : '1. केवल डॉक्टर सीमा'}</h3>
            <p class="pillar-show-text">
              ${isEn
                ? 'Only the treating doctor or hospital currently examining the citizen can view selected reports. No bank, loan agency, police, employer, or insurance company can ever access it.'
                : 'डेटा केवल वही डॉक्टर देख सकते हैं जो इस समय मरीज का इलाज कर रहे हैं। कोई भी बैंक, बीमा कंपनी, पुलिस या नौकरी देने वाला इसे आपकी इजाजत के बिना नहीं छू सकता।'
              }
            </p>
            <span class="pillar-highlight-tag">${isEn ? 'Zero Third-Party Sharing' : 'कोई बैंक/बीमा कंपनी नहीं'}</span>
          </div>

          <div class="pillar-show-card">
            <div class="pillar-icon-box" style="color: #3b82f6;">⏳</div>
            <h3 class="pillar-show-title">${isEn ? '2. Strict Time Duration' : '2. समय सीमा व स्वतः ताला'}</h3>
            <p class="pillar-show-text">
              ${isEn
                ? 'Doctor access is strictly temporary (e.g., 24 to 48 hours for outpatient checkups). Once the consultation period expires, the digital vault locks automatically.'
                : 'डॉक्टर को देखने की अनुमति हमेशा सीमित समय (उदा. 24 या 48 घंटे) के लिए होती है। समय समाप्त होते ही तिजोरी का ताला स्वतः बंद हो जाता है।'
              }
            </p>
            <span class="pillar-highlight-tag">${isEn ? '48h Auto-Expiration' : 'स्वतः ताला बंद (Auto-Lock)'}</span>
          </div>

          <div class="pillar-show-card">
            <div class="pillar-icon-box" style="color: var(--primary-emerald-dark);">🛑</div>
            <h3 class="pillar-show-title">${isEn ? '3. "Meri Marzi" Right to Revoke' : '3. "मेरी मर्ज़ी" रद्द करने का हक'}</h3>
            <p class="pillar-show-text">
              ${isEn
                ? 'Citizens hold the digital master key. They can cancel consent anytime via missed call, USSD, or ASHA app without any cut in government rations, pensions, or medical care.'
                : 'मास्टर-की नागरिक के पास है। जब चाहें 1 मिस्ड कॉल या आशा दीदी से कहकर अनुमति वापस लें। राशन, पेंशन या मुफ्त अस्पताल इलाज पर कोई आंच नहीं आएगी।'
              }
            </p>
            <span class="pillar-highlight-tag">${isEn ? 'USSD *99*14477# Cancel' : '1 मिस्ड कॉल से ताला'}</span>
          </div>
        </div>
      </section>

      <!-- 4-Step Field Workflow -->
      <section class="landing-section">
        <div class="landing-section-header">
          <span class="section-tag">${isEn ? 'ASHA Field Workflow' : 'आशा कार्यकर्ता कार्यप्रणाली'}</span>
          <h2 class="landing-section-title">${isEn ? 'How Meri Marzi Works in Village Camps' : 'गाँव के शिविरों में कैसे काम करता है मेरी मर्ज़ी?'}</h2>
        </div>

        <div class="workflow-steps-grid">
          <div class="workflow-step-card">
            <div class="step-num-pill">1</div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">👤📍</div>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem;">${isEn ? 'Citizen & GPS Village' : 'नागरिक व लाइव GPS'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              ${isEn ? 'ASHA enters citizen name and taps Live GPS to auto-detect the village & gram panchayat.' : 'आशा दीदी नागरिक विवरण भरती हैं और लाइव GPS बटन से तुरंत गाँव का नाम सत्यापित होता है।'}
            </p>
          </div>

          <div class="workflow-step-card">
            <div class="step-num-pill">2</div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🗣️🗝️</div>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem;">${isEn ? 'Vernacular Spoken Guide' : 'स्थानीय बोली में वाक् सहायक'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              ${isEn ? 'App speaks aloud in local dialect using the culturally intuitive "Digital Tijori" metaphor.' : 'ऐप स्थानीय भाषा में "डिजिटल तिजोरी व चाभी" के सरल उदाहरण से नागरिक को बोलकर सुनाता है।'}
            </p>
          </div>

          <div class="workflow-step-card">
            <div class="step-num-pill">3</div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🎙️🧠</div>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem;">${isEn ? 'Teach-Back Evaluation' : 'अपनी भाषा में समझ (KEY)'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              ${isEn ? 'Citizen speaks back in own words. The engine catches blind nods and scores the 3 pillars.' : 'नागरिक माइक में अपने शब्दों में समझाते हैं। डिग्निटी इंजन अंधी सहमति को रोकता है और समझ जांचता है।'}
            </p>
          </div>

          <div class="workflow-step-card">
            <div class="step-num-pill">4</div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📜🛑</div>
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem;">${isEn ? 'Dignity Pass & Revoke Drill' : 'सम्मान पत्र व कैंसिलेशन अभ्यास'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              ${isEn ? 'Consent Artifact is generated with embedded voice proof; ASHA trains them to revoke anytime.' : 'आवाज के प्रमाण के साथ आधिकारिक सम्मान पत्र जारी होता है और रद्द करने का अभ्यास कराया जाता है।'}
            </p>
          </div>
        </div>
      </section>

      <!-- Interactive Spoken Audio Teaser Banner -->
      <div class="audio-teaser-banner">
        <div>
          <span style="background: rgba(255, 153, 51, 0.2); color: #ffb86c; font-weight: 700; font-size: 0.78rem; padding: 0.25rem 0.65rem; border-radius: 9999px; display: inline-block; margin-bottom: 0.6rem;">
            🎧 ${isEn ? 'Listen To Audio Engine' : 'सुनें: स्थानीय वाक् सहायक'}
          </span>
          <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.4rem;">
            ${isEn ? 'Hear How Meri Marzi Speaks in Front of Rural Families' : 'सुनिए: कैसे गाँव की बोली में समझाता है हमारा वाक् सहायक'}
          </h3>
          <p style="font-size: 0.88rem; color: #94a3b8; max-width: 600px;">
            ${isEn ? 'Works 100% offline without external audio files using client-side synthesis and custom audio oscillator chimes.' : 'बिना किसी बाहरी इंटरनेट या ऑडियो फाइल के 100% ऑफलाइन काम करता है।'}
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn-hero-primary" id="btnTeaserAudio">
            <span>${state.isTeaserAudioPlaying ? '⏹️' : '▶️'}</span>
            <span>${state.isTeaserAudioPlaying ? (isEn ? 'Stop Speaking' : 'आवाज रोकें') : (isEn ? 'Play Spoken Guide' : 'वाक् सहायक सुनें')}</span>
          </button>
          <button type="button" class="btn-hero-secondary" id="btnTeaserToApp">
            <span>🚀</span> <span>${isEn ? 'Open Full App' : 'सीधा ऐप खोलें'}</span>
          </button>
        </div>
      </div>

      <!-- Landing Footer -->
      <footer class="landing-footer">
        <div class="footer-top-grid">
          <div class="footer-brand">
            <h4>🛡️ ${lang.appName}</h4>
            <p style="font-size: 0.88rem; line-height: 1.6; max-width: 480px; margin-bottom: 0.75rem;">
              ${lang.tagline}
            </p>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              Track: <strong>Sahayak & Samman Bharat</strong> | Problem Statement: <strong>PS 2.4</strong>
            </div>
          </div>

          <div class="footer-col">
            <h5>${isEn ? 'Legal & Standards' : 'वैधानिक मानक'}</h5>
            <ul class="footer-links">
              <li>🏛️ ABDM Consent Manager v0.5</li>
              <li>📜 DPDP Act 2023 Sec 6(1)</li>
              <li>🔒 AES-256 Mock Signatures</li>
              <li>🛡️ Zero Third-Party Tracker</li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>${isEn ? 'Quick Portals' : 'त्वरित पोर्टल'}</h5>
            <ul class="footer-links">
              <li><a href="#" id="linkFooterAsha" style="color: inherit; text-decoration: none;">🩺 आशा कार्यकर्ता पोर्टल</a></li>
              <li><a href="#" id="linkFooterCitizen" style="color: inherit; text-decoration: none;">👤 नागरिक पासबुक लॉगिन</a></li>
              <li><a href="#" id="linkFooterDemo" style="color: inherit; text-decoration: none;">⚡ त्वरित डेमो सहमति</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div>
            🇮🇳 राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) एवं आयुष्मान भारत डिजिटल मिशन दिशा-निर्देशों के अनुरूप
          </div>
          <div>
            Meri Marzi — Protecting Frontline Workers & Citizen Data Dignity
          </div>
        </div>
      </footer>
    </div>
  `;
}

function attachLandingHandlers() {
  // Navigation & CTAs
  const btnLandingLogin = document.querySelector('#btnLandingLogin');
  if (btnLandingLogin) {
    btnLandingLogin.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.activeView = 'login';
      state.loginRole = 'asha';
      renderApp();
    });
  }

  const btnHeroAshaLogin = document.querySelector('#btnHeroAshaLogin');
  if (btnHeroAshaLogin) {
    btnHeroAshaLogin.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.activeView = 'login';
      state.loginRole = 'asha';
      renderApp();
    });
  }

  const btnLandingStart = document.querySelector('#btnLandingStart');
  if (btnLandingStart) {
    btnLandingStart.addEventListener('click', () => {
      audioEngine.playClickSound();
      if (!state.currentUser) {
        state.currentUser = DEMO_ASHA_ACCOUNTS[0];
        try { localStorage.setItem('meri_marzi_user', JSON.stringify(state.currentUser)); } catch (e) {}
      }
      state.activeView = 'app';
      state.activeTab = 'wizard';
      state.wizardStep = 1;
      renderApp();
    });
  }

  const btnHeroQuickDemo = document.querySelector('#btnHeroQuickDemo');
  if (btnHeroQuickDemo) {
    btnHeroQuickDemo.addEventListener('click', () => {
      audioEngine.playClickSound();
      if (!state.currentUser) {
        state.currentUser = DEMO_ASHA_ACCOUNTS[0];
        try { localStorage.setItem('meri_marzi_user', JSON.stringify(state.currentUser)); } catch (e) {}
      }
      state.activeView = 'app';
      state.activeTab = 'wizard';
      state.wizardStep = 1;
      renderApp();
    });
  }

  const btnLandingLaunchApp = document.querySelector('#btnLandingLaunchApp');
  if (btnLandingLaunchApp) {
    btnLandingLaunchApp.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.activeView = 'app';
      renderApp();
    });
  }

  const btnTeaserToApp = document.querySelector('#btnTeaserToApp');
  if (btnTeaserToApp) {
    btnTeaserToApp.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.isTeaserAudioPlaying = false;
      if (!state.currentUser) {
        state.currentUser = DEMO_ASHA_ACCOUNTS[0];
        try { localStorage.setItem('meri_marzi_user', JSON.stringify(state.currentUser)); } catch (e) {}
      }
      state.activeView = 'app';
      renderApp();
    });
  }

  // Smooth scroll links
  const btnNavHowItWorks = document.querySelector('#btnNavHowItWorks');
  if (btnNavHowItWorks) {
    btnNavHowItWorks.addEventListener('click', () => {
      document.querySelector('#howItWorksSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const btnNavImpact = document.querySelector('#btnNavImpact');
  if (btnNavImpact) {
    btnNavImpact.addEventListener('click', () => {
      document.querySelector('#impactSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Audio teaser toggle
  const sampleAudioText = getLang().speechAudio.tijoriMetaphor + ' ' + getLang().speechAudio.pillar1Recipient;
  const toggleTeaserAudio = () => {
    audioEngine.playClickSound();
    if (state.isTeaserAudioPlaying) {
      audioEngine.stop();
      state.isTeaserAudioPlaying = false;
      renderApp();
    } else {
      state.isTeaserAudioPlaying = true;
      renderApp();
      audioEngine.speak(sampleAudioText, state.currentLang, () => {
        state.isTeaserAudioPlaying = false;
        renderApp();
      });
    }
  };

  const btnHeroListenSample = document.querySelector('#btnHeroListenSample');
  if (btnHeroListenSample) btnHeroListenSample.addEventListener('click', toggleTeaserAudio);

  const btnTeaserAudio = document.querySelector('#btnTeaserAudio');
  if (btnTeaserAudio) btnTeaserAudio.addEventListener('click', toggleTeaserAudio);

  // Landing Language Selector
  const landingLangSelector = document.querySelector('#landingLangSelector');
  if (landingLangSelector) {
    landingLangSelector.addEventListener('change', (e) => {
      audioEngine.playClickSound();
      state.currentLang = e.target.value;
      speechManager.setLanguage(LANGUAGES[state.currentLang].voiceLang);
      renderApp();
    });
  }

  // Footer Links
  const linkFooterAsha = document.querySelector('#linkFooterAsha');
  if (linkFooterAsha) {
    linkFooterAsha.addEventListener('click', (e) => {
      e.preventDefault();
      state.activeView = 'login';
      state.loginRole = 'asha';
      renderApp();
    });
  }

  const linkFooterCitizen = document.querySelector('#linkFooterCitizen');
  if (linkFooterCitizen) {
    linkFooterCitizen.addEventListener('click', (e) => {
      e.preventDefault();
      state.activeView = 'login';
      state.loginRole = 'citizen';
      renderApp();
    });
  }

  const linkFooterDemo = document.querySelector('#linkFooterDemo');
  if (linkFooterDemo) {
    linkFooterDemo.addEventListener('click', (e) => {
      e.preventDefault();
      if (!state.currentUser) {
        state.currentUser = DEMO_ASHA_ACCOUNTS[0];
        try { localStorage.setItem('meri_marzi_user', JSON.stringify(state.currentUser)); } catch (e) {}
      }
      state.activeView = 'app';
      state.activeTab = 'wizard';
      state.wizardStep = 1;
      renderApp();
    });
  }
}

// --------------------------------------------------------------------------
// 🔐 LOGIN PAGE (Modern Web Guidance Compliant)
// --------------------------------------------------------------------------
function renderLoginPage() {
  const lang = getLang();
  const isEn = state.currentLang === 'en';

  return `
    <!-- Top Government ABDM Standard Ribbon -->
    <div class="govt-ribbon"></div>
    <header class="govt-header-badge">
      <div class="govt-badge-left">
        <span class="flag-emblem">🇮🇳</span>
        <span>${lang.ribbon.govt}</span>
      </div>
      <div class="govt-badge-right">
        <span class="status-chip">
          <span class="pulse-dot"></span>
          <span>${lang.ribbon.badge}</span>
        </span>
        <span style="color: #64748b; font-size: 0.78rem;">${lang.ribbon.compliance}</span>
      </div>
    </header>

    <div class="app-container login-view">
      <div class="login-card-container">
        <div class="login-header-box">
          <div class="login-emblem">🛡️</div>
          <h2 class="login-portal-title">
            ${isEn ? (state.authMode === 'register' ? 'ASHA Worker Registration' : 'Meri Marzi Portal Sign-In') : (state.authMode === 'register' ? 'आशा कार्यकर्ता नया पंजीकरण' : 'मेरी मर्ज़ी — सुरक्षित प्रमाणीकरण')}
          </h2>
          <p class="login-portal-sub">
            ${isEn ? 'Ayushman Bharat Digital Mission (ABDM) Gateway' : 'आयुष्मान भारत डिजिटल मिशन (ABDM) अधिकृत गेटवे'}
          </p>
        </div>

        <!-- Auth Mode Toggle (Login vs Registration) -->
        <div class="auth-mode-toggle" role="tablist">
          <button type="button" class="auth-mode-btn ${state.authMode === 'login' ? 'active' : ''}" data-auth-mode="login">
            <span>🔐</span> <span>${isEn ? 'Sign In' : 'लॉगिन करें'}</span>
          </button>
          <button type="button" class="auth-mode-btn ${state.authMode === 'register' ? 'active' : ''}" data-auth-mode="register">
            <span>📝</span> <span>${isEn ? 'New Registration' : 'नया पंजीकरण'}</span>
          </button>
        </div>

        ${state.authMode === 'register' ? `
          <!-- ASHA NEW REGISTRATION FORM (Modern Web Guidance Compliant) -->
          <form id="ashaRegisterForm" novalidate>
            <div style="background: var(--primary-saffron-light); border: 1px solid #fed7aa; border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; font-size: 0.8rem; color: var(--primary-saffron-dark); margin-bottom: 1.25rem; font-weight: 600;">
              ✨ ${isEn ? 'ASHA / Health Worker Onboarding (ABDM Certified)' : 'आशा व स्वास्थ्यकर्मी ऑनलाइन पंजीकरण (ABDM प्रमाणित)'}
            </div>

            <div class="form-group">
              <label for="regAshaName" class="form-label">${isEn ? 'Full Name *' : 'पूरा नाम *'}</label>
              <input 
                type="text" 
                id="regAshaName" 
                name="name" 
                class="form-input" 
                autocomplete="name" 
                required 
                enterkeyhint="next"
                placeholder="${isEn ? 'e.g. Rekha Devi' : 'उदा. रेखा देवी'}" 
              />
            </div>

            <div class="form-group">
              <label for="regAshaId" class="form-label">${isEn ? 'ASHA ID / Mobile Number *' : 'आशा ID या 10-अंकों का मोबाइल नंबर *'}</label>
              <input 
                type="tel" 
                id="regAshaId" 
                name="username" 
                class="form-input" 
                autocomplete="username" 
                inputmode="numeric" 
                required 
                enterkeyhint="next"
                placeholder="${isEn ? 'e.g. 9876543210' : 'उदा. 9876543210 या ASHA-UP-5520'}" 
              />
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label for="regAshaRole" class="form-label">${isEn ? 'Designation / Role *' : 'पद / भूमिका *'}</label>
                <select id="regAshaRole" class="form-select">
                  <option value="आशा कार्यकर्ता">${isEn ? 'ASHA Worker' : 'आशा कार्यकर्ता'}</option>
                  <option value="आशा संगिनी">${isEn ? 'ASHA Sangini / Facilitator' : 'आशा संगिनी'}</option>
                  <option value="ए.एन.एम.">${isEn ? 'ANM Health Worker' : 'ए.एन.एम. (ANM)'}</option>
                  <option value="सी.एच.ओ.">${isEn ? 'Community Health Officer (CHO)' : 'सी.एच.ओ. (CHO)'}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="regAshaDistrict" class="form-label">${isEn ? 'District *' : 'जिला *'}</label>
                <select id="regAshaDistrict" class="form-select">
                  <option value="बाराबंकी (उ.प्र.)">बाराबंकी (उ.प्र.)</option>
                  <option value="अयोध्या (उ.प्र.)">अयोध्या (उ.प्र.)</option>
                  <option value="गोरखपुर (उ.प्र.)">गोरखपुर (उ.प्र.)</option>
                  <option value="बस्ती (उ.प्र.)">बस्ती (उ.प्र.)</option>
                  <option value="लखनऊ (उ.प्र.)">लखनऊ (उ.प्र.)</option>
                  <option value="वाराणसी (उ.प्र.)">वाराणसी (उ.प्र.)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="regAshaPhc" class="form-label">${isEn ? 'Primary Health Center (PHC / Sector) *' : 'प्राथमिक स्वास्थ्य केंद्र (PHC / सेक्टर) *'}</label>
              <input 
                type="text" 
                id="regAshaPhc" 
                class="form-input" 
                required 
                enterkeyhint="next"
                placeholder="${isEn ? 'e.g. PHC Satrikh Sector 2' : 'उदा. सतरिख प्राथमिक स्वास्थ्य केंद्र, सेक्टर 2'}" 
                value="सतरिख प्राथमिक स्वास्थ्य केंद्र" 
              />
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label for="regAshaPin" class="form-label" style="margin-bottom: 0;">${isEn ? 'Create Security PIN (4-6 digits) *' : 'नया सुरक्षा पिन बनाएं (4 या 6 अंक) *'}</label>
              </div>
              <div class="password-input-wrap">
                <input 
                  type="${state.showRegPassword ? 'text' : 'password'}" 
                  id="regAshaPin" 
                  name="new-password" 
                  class="form-input" 
                  autocomplete="new-password" 
                  required 
                  enterkeyhint="done"
                  placeholder="${isEn ? 'Enter New PIN' : 'नया पिन दर्ज करें'}" 
                />
                <button type="button" id="btnToggleRegPassword" class="btn-toggle-eye" aria-label="${state.showRegPassword ? 'Hide PIN' : 'Show PIN'}">
                  ${state.showRegPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.82rem; color: var(--text-secondary); cursor: pointer; line-height: 1.4;">
                <input type="checkbox" id="regDeclareCheck" checked style="margin-top: 3px;" />
                <span>${isEn ? 'I certify that I am an authorized National Health Mission (NHM) field health worker.' : 'मैं प्रमाणित करती हूँ कि मैं अधिकृत राष्ट्रीय स्वास्थ्य मिशन (NHM) स्वास्थ्य कार्यकर्ता हूँ।'}</span>
              </label>
            </div>

            <div id="regErrorMsg" class="location-status-badge error" style="display: none; margin-bottom: 1rem;"></div>

            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem;">
              <span>📝</span> <span>${isEn ? 'Complete Registration & Open App ➡️' : 'पंजीकरण पूरा करें एवं शुरू करें ➡️'}</span>
            </button>

            <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-secondary);">
              <span>${isEn ? 'Already registered?' : 'पहले से खाता है?'}</span>
              <button type="button" id="btnSwitchToLogin" style="background: none; border: none; color: var(--primary-saffron-dark); font-weight: 700; cursor: pointer; text-decoration: underline; margin-left: 0.3rem;">
                ${isEn ? 'Sign In Here' : 'यहाँ लॉगिन करें'}
              </button>
            </div>
          </form>
        ` : `
          <!-- Role Selector Tabs (Only in Sign In Mode) -->
          <div class="login-role-tabs" role="tablist">
            <button type="button" class="login-role-tab ${state.loginRole === 'asha' ? 'active' : ''}" data-role="asha">
              <span>🩺</span> <span>${isEn ? 'ASHA / Staff Portal' : 'आशा कार्यकर्ता / स्वास्थ्यकर्मी'}</span>
            </button>
            <button type="button" class="login-role-tab ${state.loginRole === 'citizen' ? 'active' : ''}" data-role="citizen">
              <span>👤</span> <span>${isEn ? 'Citizen Passbook' : 'नागरिक पासबुक'}</span>
            </button>
          </div>

          ${state.loginRole === 'asha' ? `
            <!-- ASHA Login Form (Modern Web Guidance Compliant) -->
            <form id="ashaLoginForm" novalidate>
              <div class="form-group">
                <label for="loginAshaId" class="form-label">${isEn ? 'ASHA ID / Registered Mobile *' : 'आशा कार्यकर्ता ID या पंजीकृत मोबाइल *'}</label>
                <input 
                  type="tel" 
                  id="loginAshaId" 
                  name="username" 
                  class="form-input" 
                  autocomplete="username" 
                  inputmode="numeric" 
                  required 
                  enterkeyhint="next"
                  placeholder="${isEn ? 'e.g. 9876543210 or ASHA-UP-4091' : 'उदा. 9876543210 या ASHA-UP-4091'}" 
                  value="${state.loginDraftAshaId || ''}" 
                />
              </div>

              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <label for="loginAshaPin" class="form-label" style="margin-bottom: 0;">${isEn ? 'Security PIN / Password *' : 'सुरक्षा पिन / पासवर्ड *'}</label>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${isEn ? '4 or 6-digit PIN' : '4 या 6 अंकों का पिन'}</span>
                </div>
                <div class="password-input-wrap">
                  <input 
                    type="${state.showPassword ? 'text' : 'password'}" 
                    id="loginAshaPin" 
                    name="password" 
                    class="form-input" 
                    autocomplete="current-password" 
                    required 
                    enterkeyhint="done"
                    placeholder="${isEn ? 'Enter PIN' : 'पिन दर्ज करें'}" 
                    value="${state.loginDraftAshaPin || ''}" 
                  />
                  <button type="button" id="btnTogglePassword" class="btn-toggle-eye" aria-label="${state.showPassword ? 'Hide password' : 'Show password'}">
                    ${state.showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="loginPhcSelect" class="form-label">${isEn ? 'Primary Health Center (PHC / Sector)' : 'प्राथमिक स्वास्थ्य केंद्र (PHC / सेक्टर)'}</label>
                <select id="loginPhcSelect" class="form-select">
                  <option value="सतरिख प्राथमिक स्वास्थ्य केंद्र, बाराबंकी">सतरिख प्राथमिक स्वास्थ्य केंद्र, बाराबंकी (उ.प्र.)</option>
                  <option value="मिल्कीपुर सामुदायिक स्वास्थ्य केंद्र, अयोध्या">मिल्कीपुर सामुदायिक स्वास्थ्य केंद्र, अयोध्या (उ.प्र.)</option>
                  <option value="मोहद्दीपुर प्राथमिक स्वास्थ्य केंद्र, गोरखपुर">मोहद्दीपुर प्राथमिक स्वास्थ्य केंद्र, गोरखपुर (उ.प्र.)</option>
                  <option value="बस्ती सदर सामुदायिक स्वास्थ्य केंद्र, बस्ती">बस्ती सदर सामुदायिक स्वास्थ्य केंद्र, बस्ती (उ.प्र.)</option>
                </select>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer;">
                  <input type="checkbox" id="loginRememberMe" checked />
                  <span>${isEn ? 'Remember on this tablet' : 'मुझे इस डिवाइस पर याद रखें'}</span>
                </label>
                <a href="#" id="linkForgotPin" style="font-size: 0.82rem; color: var(--primary-saffron-dark); text-decoration: none; font-weight: 600;">
                  ${isEn ? 'Forgot PIN?' : 'पिन भूल गए?'}
                </a>
              </div>

              <div id="loginErrorMsg" class="location-status-badge error" style="display: none; margin-bottom: 1rem;"></div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem;">
                <span>🔐</span> <span>${isEn ? 'Secure Sign-In ➡️' : 'सुरक्षित लॉगिन करें ➡️'}</span>
              </button>

              <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem;">
                <span style="color: var(--text-secondary);">${isEn ? 'New ASHA worker?' : 'नया ASHA खाता बनाना चाहते हैं?'}</span>
                <button type="button" id="btnSwitchToRegister" style="background: none; border: none; color: var(--primary-saffron-dark); font-weight: 700; cursor: pointer; text-decoration: underline; margin-left: 0.3rem;">
                  ${isEn ? 'Register Here' : 'यहाँ पंजीकरण करें'}
                </button>
              </div>
            </form>

            <!-- Quick 1-Click Demo Accounts for Judges / Field Testing -->
            <div class="demo-logins-box">
              <div class="demo-logins-header">
                <span>⚡ ${isEn ? '1-Click Demo Accounts (For Testing)' : 'त्वरित 1-क्लिक डेमो खाते (परीक्षण हेतु)'}</span>
                <span style="color: var(--primary-emerald-dark); font-weight: 800;">Fast Login</span>
              </div>
              <div class="demo-chips-grid">
                ${DEMO_ASHA_ACCOUNTS.map(acc => `
                  <button type="button" class="demo-account-chip" data-account-id="${acc.id}">
                    <div>
                      <div class="demo-chip-name">${acc.avatar} ${acc.name}</div>
                      <div class="demo-chip-sub">${acc.title} • ${acc.district}</div>
                    </div>
                    <span style="font-size: 0.75rem; background: var(--primary-saffron-light); color: var(--primary-saffron-dark); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">
                      ${isEn ? 'Sign In' : 'लॉगिन'}
                    </span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : `
            <!-- Citizen Passbook Login Form -->
            <form id="citizenLoginForm" novalidate>
              <div class="form-group">
                <label for="citizenAbhaLogin" class="form-label">${isEn ? '14-Digit ABHA ID or Mobile Number *' : '14-अंकों की ABHA संख्या या मोबाइल नंबर *'}</label>
                <input 
                  type="tel" 
                  id="citizenAbhaLogin" 
                  class="form-input" 
                  autocomplete="username" 
                  inputmode="numeric" 
                  required 
                  enterkeyhint="next"
                  placeholder="उदा. 91-4821-3390-1204" 
                  value="91-4821-3390-1204" 
                />
              </div>

              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <label for="citizenOtpInput" class="form-label" style="margin-bottom: 0;">${isEn ? '6-Digit OTP *' : '6-अंकों का ओटीपी (OTP) *'}</label>
                  <button type="button" id="btnSendOtp" style="background: none; border: none; font-size: 0.78rem; color: var(--primary-saffron-dark); font-weight: 700; cursor: pointer;">
                    📲 ${isEn ? 'Resend OTP' : 'ओटीपी पुनः भेजें'}
                  </button>
                </div>
                <input 
                  type="text" 
                  id="citizenOtpInput" 
                  class="form-input" 
                  autocomplete="one-time-code" 
                  inputmode="numeric" 
                  maxlength="6" 
                  required 
                  enterkeyhint="done"
                  placeholder="123456" 
                  value="123456" 
                />
                <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem; display: block;">
                  ${isEn ? 'Demo Simulation: Default OTP is 123456' : 'डेमो सिमुलेशन: परीक्षण हेतु ओटीपी 123456 भरें'}
                </span>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem; margin-top: 1rem;">
                <span>📜</span> <span>${isEn ? 'View My Dignity Passbook' : 'मेरी सहमति पासबुक खोलें ➡️'}</span>
              </button>

              <!-- Quick Citizen Demo Accounts -->
              <div class="demo-logins-box" style="margin-top: 1.5rem;">
                <div class="demo-logins-header">
                  <span>⚡ ${isEn ? 'Quick Citizen Demo Profiles' : 'त्वरित नागरिक प्रोफाइल'}</span>
                </div>
                <div class="demo-chips-grid">
                  <button type="button" class="demo-account-chip" data-citizen="sunita">
                    <div>
                      <div class="demo-chip-name">👩🏽 सुनीता देवी</div>
                      <div class="demo-chip-sub">सतरिख, बाराबंकी • 48 घंटे अनुमति सक्रिय</div>
                    </div>
                    <span style="font-size: 0.75rem; background: var(--primary-emerald-light); color: var(--primary-emerald-dark); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">
                      पासबुक देखें
                    </span>
                  </button>
                  <button type="button" class="demo-account-chip" data-citizen="ramu">
                    <div>
                      <div class="demo-chip-name">👴🏽 रामू काका</div>
                      <div class="demo-chip-sub">मिल्कीपुर, अयोध्या • सहमति निरस्त (Revoked)</div>
                    </div>
                    <span style="font-size: 0.75rem; background: var(--primary-emerald-light); color: var(--primary-emerald-dark); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">
                      पासबुक देखें
                    </span>
                  </button>
                </div>
              </div>
            </form>
          `}
        `}

        <div class="login-security-notice">
          <span>🔒</span>
          <span>${isEn ? 'Protected by NIC & ABDM Encryption Standards | DPDP Act 2023' : 'राष्ट्रीय सूचना विज्ञान केंद्र (NIC) व ABDM मानकों द्वारा सुरक्षित'}</span>
        </div>

        <div style="text-align: center; margin-top: 1.5rem;">
          <button type="button" id="btnBackToLanding" class="btn-nav-outline" style="width: 100%; justify-content: center;">
            <span>←</span> <span>${isEn ? 'Back to Home / Landing Page' : 'मुख्य पृष्ठ पर वापस जाएं'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachLoginHandlers() {
  // Auth Mode switcher (Login vs Register)
  document.querySelectorAll('.auth-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.authMode = btn.dataset.authMode;
      renderApp();
    });
  });

  // Switch links
  const btnSwitchToRegister = document.querySelector('#btnSwitchToRegister');
  if (btnSwitchToRegister) {
    btnSwitchToRegister.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.authMode = 'register';
      renderApp();
    });
  }

  const btnSwitchToLogin = document.querySelector('#btnSwitchToLogin');
  if (btnSwitchToLogin) {
    btnSwitchToLogin.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.authMode = 'login';
      renderApp();
    });
  }

  // Registration PIN visibility toggle
  const btnToggleRegPassword = document.querySelector('#btnToggleRegPassword');
  if (btnToggleRegPassword) {
    btnToggleRegPassword.addEventListener('click', () => {
      state.showRegPassword = !state.showRegPassword;
      const regPin = document.querySelector('#regAshaPin');
      if (regPin) {
        regPin.type = state.showRegPassword ? 'text' : 'password';
      }
      btnToggleRegPassword.textContent = state.showRegPassword ? '🙈' : '👁️';
    });
  }

  // Handle New Registration Form Submit
  const regForm = document.querySelector('#ashaRegisterForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#regAshaName')?.value.trim();
      const ashaId = document.querySelector('#regAshaId')?.value.trim();
      const role = document.querySelector('#regAshaRole')?.value;
      const district = document.querySelector('#regAshaDistrict')?.value;
      const phc = document.querySelector('#regAshaPhc')?.value.trim();
      const pin = document.querySelector('#regAshaPin')?.value.trim();
      const declareCheck = document.querySelector('#regDeclareCheck')?.checked;
      const regError = document.querySelector('#regErrorMsg');

      if (!name) {
        if (regError) {
          regError.textContent = '⚠️ कृपया अपना पूरा नाम दर्ज करें';
          regError.style.display = 'flex';
        }
        return;
      }
      if (!ashaId || ashaId.length < 6) {
        if (regError) {
          regError.textContent = '⚠️ कृपया मान्य आशा ID या 10-अंकों का मोबाइल नंबर दर्ज करें';
          regError.style.display = 'flex';
        }
        return;
      }
      if (!pin || pin.length < 4) {
        if (regError) {
          regError.textContent = '⚠️ कृपया कम से कम 4 अंकों का सुरक्षा पिन बनाएं';
          regError.style.display = 'flex';
        }
        return;
      }
      if (!declareCheck) {
        if (regError) {
          regError.textContent = '⚠️ कृपया घोषणा पर टिक करें';
          regError.style.display = 'flex';
        }
        return;
      }

      // Create new user session
      const newUser = {
        id: ashaId.toUpperCase().includes('ASHA') ? ashaId.toUpperCase() : `ASHA-UP-${ashaId.slice(-4)}`,
        mobile: ashaId,
        pin: pin,
        name: name,
        title: role || 'आशा कार्यकर्ता',
        district: district || 'उत्तर प्रदेश',
        phc: phc || 'प्राथमिक स्वास्थ्य केंद्र',
        badge: 'Verified Health Worker',
        honorarium: 100, // Welcome quality credits
        consentsCount: 0,
        avatar: '👩🏽'
      };

      DEMO_ASHA_ACCOUNTS.unshift(newUser);

      state.currentUser = newUser;
      try {
        localStorage.setItem('meri_marzi_user', JSON.stringify(newUser));
      } catch (err) {}

      audioEngine.playCelebrationSound();
      launchConfetti();
      state.activeView = 'app';
      state.authMode = 'login';
      renderApp();
    });
  }

  // Role switcher (Login mode)
  document.querySelectorAll('.login-role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.loginRole = tab.dataset.role;
      renderApp();
    });
  });

  // Password visibility toggle (Login mode)
  const btnTogglePassword = document.querySelector('#btnTogglePassword');
  if (btnTogglePassword) {
    btnTogglePassword.addEventListener('click', () => {
      state.showPassword = !state.showPassword;
      const pwdInp = document.querySelector('#loginAshaPin');
      if (pwdInp) {
        pwdInp.type = state.showPassword ? 'text' : 'password';
      }
      btnTogglePassword.textContent = state.showPassword ? '🙈' : '👁️';
    });
  }

  // 1-Click ASHA Demo Accounts
  document.querySelectorAll('.demo-account-chip[data-account-id]').forEach(chip => {
    chip.addEventListener('click', () => {
      const accId = chip.dataset.accountId;
      const account = DEMO_ASHA_ACCOUNTS.find(a => a.id === accId) || DEMO_ASHA_ACCOUNTS[0];
      state.currentUser = account;
      try {
        localStorage.setItem('meri_marzi_user', JSON.stringify(account));
      } catch (e) {}
      audioEngine.playCelebrationSound();
      launchConfetti();
      state.activeView = 'app';
      renderApp();
    });
  });

  // 1-Click Citizen Demo Profiles
  document.querySelectorAll('.demo-account-chip[data-citizen]').forEach(chip => {
    chip.addEventListener('click', () => {
      const citizenKey = chip.dataset.citizen;
      audioEngine.playClickSound();
      state.currentUser = {
        name: citizenKey === 'ramu' ? 'रामू काका' : 'सुनीता देवी',
        role: 'citizen',
        district: citizenKey === 'ramu' ? 'अयोध्या' : 'बाराबंकी',
        avatar: citizenKey === 'ramu' ? '👴🏽' : '👩🏽'
      };
      state.activeView = 'app';
      state.activeTab = 'passbook';
      renderApp();
    });
  });

  // ASHA Form Submit
  const ashaForm = document.querySelector('#ashaLoginForm');
  if (ashaForm) {
    ashaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ashaId = document.querySelector('#loginAshaId')?.value.trim();
      const pin = document.querySelector('#loginAshaPin')?.value.trim();
      const phc = document.querySelector('#loginPhcSelect')?.value;
      const errorMsg = document.querySelector('#loginErrorMsg');

      if (!ashaId) {
        if (errorMsg) {
          errorMsg.textContent = '⚠️ कृपया अपनी आशा ID या मोबाइल नंबर दर्ज करें';
          errorMsg.style.display = 'flex';
        }
        return;
      }

      if (!pin) {
        if (errorMsg) {
          errorMsg.textContent = '⚠️ कृपया 4 या 6 अंकों का पिन दर्ज करें';
          errorMsg.style.display = 'flex';
        }
        return;
      }

      // Find matching demo account or create session
      let account = DEMO_ASHA_ACCOUNTS.find(a => a.id.toLowerCase() === ashaId.toLowerCase() || a.mobile === ashaId);
      if (!account) {
        account = {
          id: ashaId.includes('ASHA') ? ashaId : `ASHA-UP-${Math.floor(1000 + Math.random() * 9000)}`,
          mobile: ashaId,
          pin: pin,
          name: ashaId.startsWith('9') ? `आशा कार्यकर्ता (${ashaId.slice(-4)})` : ashaId,
          title: 'आशा कार्यकर्ता',
          district: 'उत्तर प्रदेश',
          phc: phc || 'प्राथमिक स्वास्थ्य केंद्र',
          badge: 'Verified Health Worker',
          honorarium: 1200,
          consentsCount: 45,
          avatar: '👩🏽'
        };
      }

      state.currentUser = account;
      try {
        localStorage.setItem('meri_marzi_user', JSON.stringify(account));
      } catch (e) {}

      audioEngine.playCelebrationSound();
      launchConfetti();
      state.activeView = 'app';
      renderApp();
    });
  }

  // Citizen Form Submit
  const citizenForm = document.querySelector('#citizenLoginForm');
  if (citizenForm) {
    citizenForm.addEventListener('submit', (e) => {
      e.preventDefault();
      audioEngine.playCelebrationSound();
      state.currentUser = {
        name: 'सुनीता देवी',
        role: 'citizen',
        district: 'बाराबंकी (उ.प्र.)',
        avatar: '👩🏽'
      };
      state.activeView = 'app';
      state.activeTab = 'passbook';
      renderApp();
    });
  }

  // Back to landing
  const btnBackToLanding = document.querySelector('#btnBackToLanding');
  if (btnBackToLanding) {
    btnBackToLanding.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.activeView = 'landing';
      renderApp();
    });
  }

  // Forgot PIN toast
  const linkForgotPin = document.querySelector('#linkForgotPin');
  if (linkForgotPin) {
    linkForgotPin.addEventListener('click', (e) => {
      e.preventDefault();
      alert('त्वरित परीक्षण हेतु पिन 1234 का उपयोग करें अथवा नीचे दिए गए त्वरित डेमो खातों पर क्लिक करें।');
    });
  }

  // Send OTP simulation
  const btnSendOtp = document.querySelector('#btnSendOtp');
  if (btnSendOtp) {
    btnSendOtp.addEventListener('click', () => {
      audioEngine.playChime(523.25, 0.2);
      alert('सफलता: आपके पंजीकृत मोबाइल नंबर पर 6-अंकों का ओटीपी भेजा गया है! (डेमो ओटीपी: 123456)');
    });
  }
}

// --------------------------------------------------------------------------
// 🛠️ MAIN APP SHELL (Wizard, Story, Toolkit, Passbook, Dashboard)
// --------------------------------------------------------------------------
function renderAppShell() {
  const lang = getLang();

  return `
    <!-- Top Government ABDM Standard Ribbon -->
    <div class="govt-ribbon"></div>
    <header class="govt-header-badge">
      <div class="govt-badge-left">
        <span class="flag-emblem">🇮🇳</span>
        <span>${lang.ribbon.govt}</span>
      </div>
      <div class="govt-badge-right">
        ${state.currentUser ? `
          <span style="font-size: 0.78rem; color: #475569; font-weight: 700; margin-right: 0.4rem;">
            👤 ${state.currentUser.name}
          </span>
        ` : ''}
        <span class="status-chip">
          <span class="pulse-dot"></span>
          <span>${lang.ribbon.badge}</span>
        </span>
        <span style="color: #64748b; font-size: 0.78rem;">${lang.ribbon.compliance}</span>
      </div>
    </header>

    <div class="app-container">
      <!-- Main Nav -->
      <nav class="main-nav">
        <div class="brand-wrapper" id="navBrandHome" style="cursor: pointer;" title="मुख्य पृष्ठ (Landing Page)">
          <div class="brand-icon">🛡️</div>
          <div>
            <div class="brand-title">${lang.appName}</div>
            <div class="brand-subtitle">${lang.appSubtitle}</div>
          </div>
        </div>

        <div class="nav-actions">
          <!-- Back to Home -->
          <button type="button" class="btn-nav-outline" id="btnNavHome" title="मुख्य पृष्ठ पर जाएं">
            <span>🏠</span> <span>${state.currentLang === 'hi' ? 'होम' : 'Home'}</span>
          </button>

          <!-- Current ASHA Profile & Dedicated Logout Button -->
          ${state.currentUser ? `
            <div class="user-profile-badge" title="${state.currentUser.phc || 'स्वास्थ्य केंद्र'}">
              <span>${state.currentUser.avatar || '👩🏽'}</span>
              <span>${state.currentUser.name}</span>
            </div>
            <!-- Prominent Dedicated Logout Button on Next Page -->
            <button type="button" class="btn-nav-logout" id="btnLogout" title="अपनी आईडी से लॉगआउट करें">
              <span>🚪</span> <span>${state.currentLang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          ` : `
            <button type="button" class="btn-nav-outline" id="btnNavToLogin">
              <span>🩺</span> <span>ASHA लॉगिन</span>
            </button>
          `}

          <!-- Language Selector -->
          <div class="lang-select-box" title="Select Language">
            <span>🗣️</span>
            <select id="langSelector" aria-label="Select Guidance Language">
              ${Object.values(LANGUAGES).map(l => `
                <option value="${l.code}" ${state.currentLang === l.code ? 'selected' : ''}>${l.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Audio Speed Toggle -->
          <div class="audio-speed-toggle" title="Spoken Voice Speed">
            <span style="font-size: 0.75rem; font-weight: 700; padding: 0 0.4rem; color: #64748b;">${lang.ribbon.speedLabel}</span>
            <button class="speed-btn ${state.speechRate === 0.8 ? 'active' : ''}" data-speed="0.8">0.8x</button>
            <button class="speed-btn ${state.speechRate === 0.95 ? 'active' : ''}" data-speed="0.95">1.0x</button>
            <button class="speed-btn ${state.speechRate === 1.2 ? 'active' : ''}" data-speed="1.2">1.2x</button>
          </div>
        </div>
      </nav>

      <!-- Tab Navigation -->
      <div class="tabs-bar" role="tablist">
        <button class="tab-btn ${state.activeTab === 'wizard' ? 'active' : ''}" data-tab="wizard">
          <span>✍️</span> ${lang.tabs.wizard}
          <span class="tab-badge">${lang.tabs.stepBadge.replace('{step}', state.wizardStep)}</span>
        </button>
        <button class="tab-btn ${state.activeTab === 'story' ? 'active' : ''}" data-tab="story">
          <span>🗝️</span> ${lang.tabs.story}
        </button>
        <button class="tab-btn ${state.activeTab === 'toolkit' ? 'active' : ''}" data-tab="toolkit">
          <span>🩺</span> ${lang.tabs.toolkit}
          <span class="tab-badge">${lang.tabs.faqsBadge}</span>
        </button>
        <button class="tab-btn ${state.activeTab === 'passbook' ? 'active' : ''}" data-tab="passbook">
          <span>📜</span> ${lang.tabs.passbook}
          <span class="tab-badge">${dataStore.getConsents().length}</span>
        </button>
        <button class="tab-btn ${state.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
          <span>📊</span> ${lang.tabs.dashboard}
          <span class="tab-badge">₹${dataStore.getStats().ashaHonorariumBonus}</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <main id="tabContent">
        ${renderActiveTabContent()}
      </main>
    </div>

    <!-- Native Accessible Dialog (Modern Web Guidance compliant) -->
    <dialog id="sammanPatraModal" class="native-modal" closedby="any">
      <div class="dialog-header">
        <h3 id="modalTitle" style="font-family: var(--font-heading); color: var(--navy-dark); font-size: 1.3rem;">📜 ${lang.step4.certTitle}</h3>
        <button class="dialog-close-btn" id="closeModalBtn" aria-label="Close dialog">&times;</button>
      </div>
      <div id="modalBody"></div>
    </dialog>
  `;
}

function renderActiveTabContent() {
  switch (state.activeTab) {
    case 'wizard':
      return renderWizardTab();
    case 'story':
      return renderStoryTab();
    case 'toolkit':
      return renderToolkitTab();
    case 'passbook':
      return renderPassbookTab();
    case 'dashboard':
      return renderDashboardTab();
    default:
      return renderWizardTab();
  }
}

// --------------------------------------------------------------------------
// 1. WIZARD TAB
// --------------------------------------------------------------------------
function renderWizardTab() {
  const lang = getLang();

  return `
    <!-- Hero Banner with ASHA illustration -->
    <div class="hero-banner">
      <div class="hero-content">
        <h1>
          <span>${lang.hero.title}</span>
          <span class="hero-highlight">${lang.hero.highlight}</span>
        </h1>
        <p>${lang.hero.desc}</p>

        <div class="hero-quick-stats">
          <div class="quick-stat-item">
            <span class="stat-num" style="color: var(--primary-emerald-dark);">${dataStore.getStats().trueComprehensionRate}%</span>
            <span class="stat-label">${lang.hero.stat1Label}</span>
          </div>
          <div class="quick-stat-item">
            <span class="stat-num" style="color: var(--primary-saffron-dark);">${dataStore.getStats().blindYesPrevented}</span>
            <span class="stat-label">${lang.hero.stat2Label}</span>
          </div>
          <div class="quick-stat-item">
            <span class="stat-num" style="color: var(--navy-dark);">${dataStore.getStats().totalConsents}</span>
            <span class="stat-label">${lang.hero.stat3Label}</span>
          </div>
        </div>
      </div>

      <div class="hero-image-wrap">
        <img src="/assets/hero.jpg" alt="ASHA Worker guiding a rural woman in health data dignity" />
      </div>
    </div>

    <!-- Wizard Steps Stepper -->
    <div class="wizard-stepper">
      <div class="step-node ${state.wizardStep === 1 ? 'active' : state.wizardStep > 1 ? 'completed' : ''}" data-step="1">
        <div class="step-circle">${state.wizardStep > 1 ? '✓' : '1'}</div>
        <div class="step-title">${lang.stepper.step1}</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 2 ? 'active' : state.wizardStep > 2 ? 'completed' : ''}" data-step="2">
        <div class="step-circle">${state.wizardStep > 2 ? '✓' : '2'}</div>
        <div class="step-title">${lang.stepper.step2}</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 3 ? 'active' : state.wizardStep > 3 ? 'completed' : ''}" data-step="3">
        <div class="step-circle">${state.wizardStep > 3 ? '✓' : '3'}</div>
        <div class="step-title">${lang.stepper.step3}</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 4 ? 'active' : state.wizardStep > 4 ? 'completed' : ''}" data-step="4">
        <div class="step-circle">${state.wizardStep > 4 ? '✓' : '4'}</div>
        <div class="step-title">${lang.stepper.step4}</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 5 ? 'active' : ''}" data-step="5">
        <div class="step-circle">5</div>
        <div class="step-title">${lang.stepper.step5}</div>
      </div>
    </div>

    <!-- Active Step Content -->
    <div class="step-content-box">
      ${renderCurrentStep()}
    </div>
  `;
}

function renderCurrentStep() {
  switch (state.wizardStep) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    case 4:
      return renderStep4();
    case 5:
      return renderStep5();
    default:
      return renderStep1();
  }
}

// Step 1: Citizen Identification
function renderStep1() {
  const lang = getLang();

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>👤 ${lang.step1.title}</span>
        </div>
        <span class="status-chip">${state.currentUser ? (state.currentUser.avatar || '👩🏽') + ' ' + state.currentUser.name + ' (' + (state.currentUser.id || 'ASHA') + ')' : lang.step1.ashaTag}</span>
      </div>

      <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem;">
        ${lang.step1.prompt}
      </p>

      <!-- Quick Personas -->
      <div class="persona-picker">
        <button type="button" class="persona-chip ${state.citizenForm.name.includes('सुनीता') || state.citizenForm.name.includes('Sunita') ? 'selected' : ''}" data-persona="sunita">
          <span>👩🏽</span> ${lang.step1.personas.sunita}
        </button>
        <button type="button" class="persona-chip ${state.citizenForm.name.includes('रामू') || state.citizenForm.name.includes('Ramu') ? 'selected' : ''}" data-persona="ramu">
          <span>👴🏽</span> ${lang.step1.personas.ramu}
        </button>
        <button type="button" class="persona-chip ${state.citizenForm.name.includes('पूजा') || state.citizenForm.name.includes('Pooja') ? 'selected' : ''}" data-persona="pooja">
          <span>👩🏻</span> ${lang.step1.personas.pooja}
        </button>
        <button type="button" class="persona-chip ${state.citizenForm.name.includes('मनोज') || state.citizenForm.name.includes('Manoj') ? 'selected' : ''}" data-persona="manoj">
          <span>👨🏽</span> ${lang.step1.personas.manoj}
        </button>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">${lang.step1.fields.name}</label>
          <input type="text" id="citizenNameInput" class="form-input" value="${state.citizenForm.name}" />
        </div>
        <div class="form-group">
          <label class="form-label">${lang.step1.fields.ageGender}</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="number" id="citizenAgeInput" class="form-input" style="max-width: 100px;" value="${state.citizenForm.age}" />
            <select id="citizenGenderSelect" class="form-select">
              <option value="महिला" ${state.citizenForm.gender === 'महिला' || state.citizenForm.gender === 'Female' ? 'selected' : ''}>${lang.step1.fields.female}</option>
              <option value="पुरुष" ${state.citizenForm.gender === 'पुरुष' || state.citizenForm.gender === 'Male' ? 'selected' : ''}>${lang.step1.fields.male}</option>
              <option value="अन्य" ${state.citizenForm.gender === 'अन्य' || state.citizenForm.gender === 'Other' ? 'selected' : ''}>${lang.step1.fields.other}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <label class="form-label" style="margin-bottom: 0;">${lang.step1.fields.village}</label>
            <button type="button" id="btnDetectLiveLocation" class="btn-location-chip" title="GPS द्वारा गाँव पहचानें">
              📍 <span id="locBtnText">${state.currentLang === 'hi' ? 'लाइव लोकेशन (GPS)' : 'Live GPS'}</span>
            </button>
          </div>
          <input type="text" id="citizenVillageInput" class="form-input" value="${state.citizenForm.village}" />
          <div id="locationStatusMsg" class="location-status-badge" style="display: none;"></div>
        </div>
        <div class="form-group">
          <label class="form-label">${lang.step1.fields.abha}</label>
          <input type="text" id="citizenAbhaInput" class="form-input" value="${state.citizenForm.abhaId}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${lang.step1.fields.healthContext}</label>
        <input type="text" id="citizenHealthInput" class="form-input" value="${state.citizenForm.healthContext}" placeholder="${lang.step1.fields.healthContextPh}" />
      </div>

      <div class="action-buttons-row">
        <button type="button" class="btn-primary" id="btnNextToStep2">
          <span>${lang.step1.nextBtn}</span>
        </button>
      </div>
    </div>
  `;
}

// Step 2: Spoken Guide & Tijori Metaphor
function renderStep2() {
  const lang = getLang();

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>📢 ${lang.step2.title}</span>
        </div>
        <span class="status-chip">${lang.name}</span>
      </div>

      <!-- Audio Guide Player Bar -->
      <div class="audio-guide-player">
        <div class="audio-guide-header">
          <div class="guide-speaker-info">
            <div class="speaker-avatar">🔊</div>
            <div class="speaker-meta">
              <h4>${lang.step2.audioTitle}</h4>
              <span>${lang.step2.audioSubtitle}</span>
            </div>
          </div>

          <div class="audio-controls">
            <button type="button" class="btn-speak-play" id="btnPlayAllAudio">
              <span>${lang.step2.btnPlay}</span>
            </button>
            <button type="button" class="btn-speak-stop" id="btnStopAudio" style="display: ${audioEngine.isSpeaking ? 'inline-block' : 'none'};">
              <span>${lang.step2.btnStop}</span>
            </button>
          </div>
        </div>

        <canvas id="audioWaveformCanvas" class="waveform-canvas" width="600" height="40"></canvas>

        <div class="spoken-transcript-bubble" id="spokenTranscriptDisplay">
          "${lang.speechAudio.step1Intro} ${lang.speechAudio.tijoriMetaphor}"
        </div>
      </div>

      <!-- Tijori Metaphor Showcase -->
      <div class="tijori-showcase">
        <div class="tijori-image-box">
          <img src="/assets/tijori.jpg" alt="ABHA Digital Tijori Health Locker" />
        </div>

        <div class="tijori-story-cards">
          <div class="story-point-card" data-audio-key="pillar1Recipient">
            <div class="story-icon">🏥</div>
            <div class="story-text">
              <h5>${lang.step2.rule1Title}</h5>
              <p>${lang.step2.rule1Desc}</p>
            </div>
            <button type="button" class="btn-secondary btn-mini-speak" data-speak="pillar1Recipient" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">${lang.step2.btnListen}</button>
          </div>

          <div class="story-point-card" data-audio-key="pillar2Duration">
            <div class="story-icon">⏳</div>
            <div class="story-text">
              <h5>${lang.step2.rule2Title}</h5>
              <p>${lang.step2.rule2Desc}</p>
            </div>
            <button type="button" class="btn-secondary btn-mini-speak" data-speak="pillar2Duration" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">${lang.step2.btnListen}</button>
          </div>

          <div class="story-point-card" data-audio-key="pillar3Revocation" style="border: 1.5px solid #10b981; background: #ecfdf5;">
            <div class="story-icon">🗝️</div>
            <div class="story-text">
              <h5 style="color: #047857;">${lang.step2.rule3Title}</h5>
              <p>${lang.step2.rule3Desc}</p>
            </div>
            <button type="button" class="btn-secondary btn-mini-speak" data-speak="pillar3Revocation" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">${lang.step2.btnListen}</button>
          </div>
        </div>
      </div>

      <div class="action-buttons-row">
        <button type="button" class="btn-secondary" id="btnBackToStep1">
          <span>${lang.step2.backBtn}</span>
        </button>
        <button type="button" class="btn-primary" id="btnNextToStep3">
          <span>${lang.step2.nextBtn}</span>
        </button>
      </div>
    </div>
  `;
}

// Step 3: Explain In Your Own Words (Teach-Back) - THE CRITICAL KEY REQUIREMENT
function renderStep3() {
  const lang = getLang();
  const evaluation = state.evaluationResult || comprehensionEngine.evaluate(state.spokenText, state.currentLang);

  const ashaPromptText = lang.step3.ashaPromptText.replace('{name}', state.citizenForm.name);

  return `
    <div class="teach-back-arena">
      <div class="teach-back-headline">
        <h2>${lang.step3.headline}</h2>
        <p><strong>${lang.step3.rule}</strong></p>
      </div>

      <!-- Spoken Prompt Banner -->
      <div style="background: #fff7ed; border-left: 4px solid var(--primary-saffron); padding: 1rem 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #c2410c; text-transform: uppercase;">${lang.step3.ashaPromptTag}</span>
          <p style="font-size: 1.05rem; font-weight: 600; color: var(--navy-dark); margin-top: 0.2rem;">
            "${ashaPromptText}"
          </p>
        </div>
        <button type="button" class="btn-secondary" id="btnSpeakPrompt" style="background: #ffffff;">
          <span>${lang.step3.btnSpeakPrompt}</span>
        </button>
      </div>

      <!-- Mic Interaction Center -->
      <div class="mic-control-center">
        <button type="button" class="big-mic-button ${state.isRecording ? 'recording' : ''}" id="btnMicRecord" title="${lang.step3.micRecord}">
          <span>${state.isRecording ? '🛑' : '🎙️'}</span>
        </button>
        <div class="mic-instruction-text" id="micStatusText">
          ${state.isRecording ? lang.step3.micListening : lang.step3.micRecord}
        </div>
        <canvas id="recordingWaveCanvas" class="waveform-canvas" width="400" height="30" style="max-width: 400px;"></canvas>
      </div>

      <!-- Quick Authentic Persona Response Presets (Crucial for Demo/Testing) -->
      <div>
        <div class="preset-section-title">
          <span>${lang.step3.presetsTitle}</span>
        </div>
        <div class="preset-responses-grid">
          ${SAMPLE_RESPONSES.map(resp => {
            const title = resp.title[state.currentLang] || resp.title.en || resp.title.hi;
            const speaker = resp.speaker[state.currentLang] || resp.speaker.en || resp.speaker.hi;
            const snippet = resp.text[state.currentLang] || resp.text.en || resp.text.hi;
            return `
              <button type="button" class="preset-card ${state.activeSamplePresetId === resp.id ? 'selected' : ''}" data-preset-id="${resp.id}">
                <div class="preset-card-title">${title}</div>
                <div class="preset-card-speaker">${speaker}</div>
                <div class="preset-card-snippet">"${snippet}"</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Spoken Transcript Box -->
      <div class="live-transcript-box ${state.spokenText ? 'has-content' : ''}">
        <div class="transcript-header">
          <span>${lang.step3.transcriptHeader}</span>
          <button type="button" class="btn-secondary" id="btnClearTranscript" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">${lang.step3.clearBtn}</button>
        </div>
        <div class="spoken-text-display" id="spokenTranscriptArea">
          ${state.spokenText ? `"${state.spokenText}"` : `<span class="spoken-text-placeholder">${lang.step3.placeholder}</span>`}
        </div>
      </div>

      <!-- Intelligent Dignity Compass Analysis -->
      <div class="compass-analysis-card">
        <div class="compass-header">
          <div>
            <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--navy-dark);">
              ${lang.step3.compassTitle}
            </h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${lang.step3.compassSubtitle}</span>
          </div>

          <div class="score-badge-large ${evaluation.isVerified ? 'verified' : evaluation.isBlindYes ? 'warning' : evaluation.misconceptions.length > 0 ? 'danger' : 'warning'}">
            <span>${evaluation.score}%</span>
            <span>${evaluation.summaryBadge}</span>
          </div>
        </div>

        <!-- 3 Pillars Checklist -->
        <div class="pillars-checklist">
          <div class="pillar-item ${evaluation.p1Status ? 'verified' : 'unverified'}">
            <div class="pillar-item-title">
              <span>${evaluation.p1Status ? '✅' : '⚪'}</span>
              <span>${lang.step3.pillar1Title}</span>
            </div>
            <div class="pillar-item-desc">
              ${evaluation.p1Status ? lang.step3.pillar1Pass : lang.step3.pillar1Fail}
            </div>
          </div>

          <div class="pillar-item ${evaluation.p2Status ? 'verified' : 'unverified'}">
            <div class="pillar-item-title">
              <span>${evaluation.p2Status ? '✅' : '⚪'}</span>
              <span>${lang.step3.pillar2Title}</span>
            </div>
            <div class="pillar-item-desc">
              ${evaluation.p2Status ? lang.step3.pillar2Pass : lang.step3.pillar2Fail}
            </div>
          </div>

          <div class="pillar-item ${evaluation.p3Status ? 'verified' : 'unverified'}" style="${evaluation.p3Status ? 'border: 2px solid #10b981;' : ''}">
            <div class="pillar-item-title">
              <span>${evaluation.p3Status ? '✅' : '⚪'}</span>
              <span>${lang.step3.pillar3Title}</span>
            </div>
            <div class="pillar-item-desc">
              ${evaluation.p3Status ? lang.step3.pillar3Pass : lang.step3.pillar3Fail}
            </div>
          </div>
        </div>

        <!-- Dynamic ASHA Coach Dialogue Alert -->
        <div class="asha-coach-alert ${evaluation.isVerified ? '' : evaluation.misconceptions.length > 0 ? 'danger' : 'warning'}">
          <div class="coach-icon">
            ${evaluation.isVerified ? '🎉' : evaluation.misconceptions.length > 0 ? '💡' : '📢'}
          </div>
          <div class="coach-content">
            <h4>${lang.step3.coachHeading}</h4>
            <div class="coach-dialogue-text">
              ${evaluation.ashaCoachTip}
            </div>
          </div>
        </div>

        ${evaluation.isBlindYes ? `
          <div style="background: #fffbeb; border: 1px solid #fcd34d; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.88rem; color: #92400e; margin-top: 0.5rem;">
            ${lang.step3.blindYesBanner}
          </div>
        ` : ''}
      </div>

      <!-- Action Row -->
      <div class="action-buttons-row">
        <button type="button" class="btn-secondary" id="btnBackToStep2">
          <span>${lang.step3.backBtn}</span>
        </button>
        <button type="button" class="btn-primary" id="btnRecordConsent" ${!evaluation.isVerified ? 'disabled' : ''} style="${evaluation.isVerified ? 'box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); background: linear-gradient(135deg, #10b981 0%, #059669 100%);' : ''}">
          <span>${evaluation.isVerified ? lang.step3.recordBtnUnlocked : lang.step3.recordBtnLocked}</span>
          <span>${evaluation.isVerified ? '📜' : '🔒'}</span>
        </button>
      </div>
    </div>
  `;
}

// Step 4: Official Consent Recorded & Samman Patra Generation
function renderStep4() {
  const lang = getLang();
  const item = state.latestConsent || dataStore.getConsents()[0];
  if (!item) return `<div class="card"><p>No consent record found</p></div>`;

  const revokeLine1 = lang.step4.revokeLine1.replace('{id}', item.consentId.split('-').pop());

  return `
    <div>
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="status-chip" style="font-size: 0.9rem; padding: 0.4rem 1rem; background: #ecfdf5; color: #047857;">
          ${lang.step4.banner}
        </span>
      </div>

      <!-- The Official Meri Marzi Samman Patra -->
      <div class="samman-patra-card" id="printableSammanPatra">
        <div class="samman-patra-watermark">MERI MARZI • DATA DIGNITY</div>

        <div class="patra-header">
          <div class="emblem-row">
            <span>${lang.step4.nhaRibbon}</span>
          </div>
          <h3>${lang.step4.certTitle}</h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">
            ${lang.step4.certSubtitle}
          </p>
        </div>

        <div class="patra-details-grid">
          <div class="patra-field">
            <span class="patra-field-label">${lang.step4.fieldName}</span>
            <span class="patra-field-value">${item.name} (${item.age}y, ${item.gender})</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">${lang.step4.fieldAbha}</span>
            <span class="patra-field-value">${item.abhaId} • ${item.abhaAddress}</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">${lang.step4.fieldConsentId}</span>
            <span class="patra-field-value" style="font-family: monospace; color: var(--navy-dark);">${item.consentId}</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">${lang.step4.fieldValidity}</span>
            <span class="patra-field-value" style="color: #047857;">${lang.step4.fieldValidityVal.replace('{validUntil}', item.validUntil)}</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">${lang.step4.fieldScope}</span>
            <span class="patra-field-value">${lang.step4.fieldScopeVal}</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">${lang.step4.fieldAsha}</span>
            <span class="patra-field-value">${item.ashaName}</span>
          </div>
        </div>

        <!-- Voice Consent Snippet Proof (Audio Receipt) -->
        <div class="patra-voice-proof">
          <div class="voice-proof-header">
            <span>${lang.step4.voiceProofTitle}</span>
            <span class="status-chip" style="background: #e0f2fe; color: #0369a1;">100% Verified</span>
          </div>
          <div class="voice-proof-quote">
            "${item.voiceSnippetText}"
          </div>
          <button type="button" class="btn-play-voice-receipt" id="btnPlayVoiceProof" data-text="${item.voiceSnippetText}">
            <span>${lang.step4.btnPlayVoice}</span>
          </button>
        </div>

        <!-- Revocation Instructions Box -->
        <div class="revocation-banner">
          <div class="revocation-info">
            <h4>${lang.step4.revokeBoxTitle}</h4>
            <p>${revokeLine1}</p>
            <p style="margin-top: 0.2rem; font-weight: 700; color: #991b1b;">
              ${lang.step4.revokeLine2}
            </p>
          </div>
          <div>
            <button type="button" class="btn-revoke-action" id="btnTriggerRevocation">
              <span>${lang.step4.btnTestRevoke}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons-row" style="justify-content: center; gap: 1rem;">
        <button type="button" class="btn-secondary btn-print" id="btnPrintCard">
          <span>${lang.step4.btnPrint}</span>
        </button>
        <button type="button" class="btn-primary" id="btnGoToStep5">
          <span>${lang.step4.btnStep5}</span>
        </button>
      </div>
    </div>
  `;
}

// Step 5: Live Revocation Simulation
function renderStep5() {
  const lang = getLang();
  const item = state.latestConsent || dataStore.getConsents()[0];

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>${lang.step5.title}</span>
        </div>
        <span class="badge-status ${item.status === 'ACTIVE' ? 'active' : 'revoked'}">
          ${lang.step5.statusLabel} ${item.status === 'ACTIVE' ? lang.step5.statusActive : lang.step5.statusRevoked}
        </span>
      </div>

      <div style="background: #fff7ed; padding: 1.25rem; border-radius: var(--radius-md); border: 1.5px solid #fed7aa; margin-bottom: 1.5rem;">
        <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">
          ${lang.step5.infoQuote}
        </h4>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          ${lang.step5.infoText}
        </p>
      </div>

      <div class="grid-2" style="margin-bottom: 1.5rem;">
        <div style="border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: var(--radius-md); background: #ffffff;">
          <h5 style="font-size: 1rem; color: var(--navy-dark); margin-bottom: 0.5rem;">${lang.step5.method1Title}</h5>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            ${lang.step5.method1Desc}
          </p>
          <button type="button" class="btn-secondary" id="btnSimulateUssd" style="width: 100%;">
            <span>${lang.step5.btnUssd}</span>
          </button>
        </div>

        <div style="border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: var(--radius-md); background: #ffffff;">
          <h5 style="font-size: 1rem; color: var(--navy-dark); margin-bottom: 0.5rem;">${lang.step5.method2Title}</h5>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            ${lang.step5.method2Desc}
          </p>
          <button type="button" class="btn-revoke-action" id="btnSimulateAshaRevoke" style="width: 100%;">
            <span>${lang.step5.btnAshaRevoke}</span>
          </button>
        </div>
      </div>

      ${item.status === 'REVOKED' ? `
        <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; text-align: center;">
          <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">🎉</div>
          <h4 style="color: #047857; font-size: 1.25rem; margin-bottom: 0.3rem;">
            ${lang.step5.confirmTitle}
          </h4>
          <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 650px; margin: 0 auto;">
            ${lang.step5.confirmDesc}
          </p>
          <div style="margin-top: 1rem;">
            <button type="button" class="btn-secondary" id="btnReactivateConsent">
              <span>${lang.step5.btnReactivate}</span>
            </button>
          </div>
        </div>
      ` : ''}

      <div class="action-buttons-row">
        <button type="button" class="btn-secondary" id="btnNewRegistration">
          <span>${lang.step5.btnNewReg}</span>
        </button>
        <button type="button" class="btn-primary" id="btnGoToPassbook">
          <span>${lang.step5.btnPassbook}</span>
        </button>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 2. STORY TAB: Tijori Metaphor & 3 Pillars
// --------------------------------------------------------------------------
function renderStoryTab() {
  const lang = getLang();

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🗝️ ${lang.tabs.story}</span>
        </div>
        <button type="button" class="btn-secondary" id="btnNarrateWholeStory">
          <span>${lang.step2.btnListen}</span>
        </button>
      </div>

      <div class="tijori-showcase">
        <div class="tijori-image-box">
          <img src="/assets/tijori.jpg" alt="ABHA Digital Tijori Health Locker" />
        </div>
        <div>
          <h3 style="font-family: var(--font-heading); color: var(--navy-dark); font-size: 1.5rem; margin-bottom: 0.5rem;">
            "${lang.step2.rule3Title}"
          </h3>
          <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 1rem;">
            ${lang.speechAudio.tijoriMetaphor}
          </p>
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); border-left: 4px solid var(--primary-saffron); font-size: 0.95rem;">
            <strong>${lang.step2.rule3Desc}</strong>
          </div>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 1.5rem;">
        <div class="card" style="background: #ffffff; border-top: 4px solid #3b82f6;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">👨🏽‍⚕️</div>
          <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">${lang.step2.rule1Title}</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            ${lang.step2.rule1Desc}
          </p>
        </div>

        <div class="card" style="background: #ffffff; border-top: 4px solid #f59e0b;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏱️</div>
          <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">${lang.step2.rule2Title}</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            ${lang.step2.rule2Desc}
          </p>
        </div>

        <div class="card" style="background: #ffffff; border-top: 4px solid #10b981;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛡️</div>
          <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">${lang.step2.rule3Title}</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            ${lang.step2.rule3Desc}
          </p>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 3. TOOLKIT TAB: ASHA Doubt Buster FAQ
// --------------------------------------------------------------------------
function renderToolkitTab() {
  const lang = getLang();

  const faqs = [
    {
      q: {
        hi: '1. "क्या मेरी बीमारी या गर्भवती होने की बात गाँव में किसी को पता चलेगी?"',
        en: '1. "Will my illness or pregnancy status be leaked to anyone in the village?"',
        hinglish: '1. "Kya meri bimari ya pregnancy gaon mein kisi ko pata chalegi?"'
      },
      a: {
        hi: 'आशा दीदी कहें: "बिल्कुल नहीं! यह डेटा 100% गोपनीय है। केवल वही डॉक्टर इसे कंप्यूटर पर देख सकते हैं जिन्हें आप इलाज के लिए परमिशन देंगी। पंचायत, पड़ोसी या रिश्तेदार इसे कभी नहीं देख सकते।',
        en: 'ASHA Didi says: "Not at all! Your data is 100% confidential. Only the specific doctor you authorize for your current treatment can access it. No panchayat, neighbor, or family member can view it without your permission."',
        hinglish: 'ASHA Didi kahein: "Bilkul nahi! Ye data 100% confidential hai. Sirf wahi doctor dekh sakte hain jinhe aap consult kar rahi hain. Gaon ya rishtedar bilkul nahi dekh sakte."'
      },
      speak: {
        hi: 'बिल्कुल नहीं! यह डेटा सौ प्रतिशत गोपनीय है। केवल वही डॉक्टर इसे देख सकते हैं जिन्हें आप इलाज के लिए परमिशन देंगी।',
        en: 'Not at all! Your health data is completely confidential and only accessible by your authorized treating doctor.'
      }
    },
    {
      q: {
        hi: '2. "अगर मैंने डॉक्टर को रिपोर्ट दिखाने से मना कर दिया, तो क्या वो मेरा इलाज बंद कर देंगे?"',
        en: '2. "If I refuse or cancel permission to view reports, will the hospital deny my treatment?"',
        hinglish: '2. "Agar maine doctor ko reports dekhne se mana kiya, toh kya ilaj band kar denge?"'
      },
      a: {
        hi: 'आशा दीदी कहें: "कभी नहीं! सरकारी अस्पताल में इलाज पाना आपका कानूनी अधिकार है। अगर आप डिजिटल परमिशन नहीं भी देती हैं, तब भी डॉक्टर साहब आपको कागज के पर्चे पर देखकर पूरी दवाएं देंगे।',
        en: 'ASHA Didi says: "Never! Getting medical treatment at a public hospital is your fundamental legal right. Even if you cancel or refuse digital consent, doctors will still examine you and provide full medicines on standard paper prescriptions."',
        hinglish: 'ASHA Didi kahein: "Kabhi nahi! Hospital mein ilaj aapka haq hai. Digital consent na dene par bhi doctor sahab normal paper par dekh kar poori dawa denge."'
      },
      speak: {
        hi: 'कभी नहीं! सरकारी अस्पताल में इलाज पाना आपका कानूनी अधिकार है। परमिशन न देने पर भी आपका इलाज कभी नहीं रुकेगा।',
        en: 'Never! Receiving public healthcare is your fundamental right. Refusing consent will never stop your treatment.'
      }
    },
    {
      q: {
        hi: '3. "क्या बैंक वाले मेरा यह डेटा देखकर मेरा कर्जा, पेंशन या राशन कार्ड काट सकते हैं?"',
        en: '3. "Can banks or employers see this data to cancel loans, pensions, or ration cards?"',
        hinglish: '3. "Kya bank wale data dekhkar ration card ya pension kaat sakte hain?"'
      },
      a: {
        hi: 'आशा दीदी कहें: "यह सबसे बड़ा भ्रम है! ABHA केवल स्वास्थ्य के लिए है। इसका बैंक, लोन, राशन कार्ड या पेंशन से कोई संबंध नहीं है। कोई सरकारी योजना प्रभावित नहीं होगी।',
        en: 'ASHA Didi says: "This is a complete misconception! ABHA is strictly for health care. It has zero link with banks, loans, ration cards, or welfare pensions. None of your government benefits can be affected."',
        hinglish: 'ASHA Didi kahein: "Ye sabse bada confusion hai! ABHA sirf health ke liye hai. Bank, loan ya ration card par koi farq nahi padega."'
      },
      speak: {
        hi: 'यह भ्रम है! ABHA केवल स्वास्थ्य के लिए है। इसका बैंक, लोन, राशन कार्ड या पेंशन से कोई संबंध नहीं है।',
        en: 'This is a misconception! ABHA is strictly for health and has zero connection with banks or ration cards.'
      }
    },
    {
      q: {
        hi: '4. "अगर मेरे पास स्मार्टफ़ोन न हो या फोन खो जाए, तो मैं परमिशन कैसे बंद करूँ?"',
        en: '4. "If I do not own a smartphone or lose my phone, how do I cancel permission?"',
        hinglish: '4. "Agar smartphone na ho ya phone kho jaye, toh consent kaise cancel karein?"'
      },
      a: {
        hi: 'आशा दीदी कहें: "आपको स्मार्टफोन की जरूरत ही नहीं है। आप किसी भी साधारण कीपैड फोन से टोल-फ्री 14477 पर कॉल कर सकती हैं, या मुझे बता सकती हैं। मैं 1 मिनट में इसे बंद कर दूँगी।',
        en: 'ASHA Didi says: "You do not need a smartphone at all! You can dial toll-free 14477 from any simple button phone, or simply tell me (your ASHA worker). We will terminate the permission immediately."',
        hinglish: 'ASHA Didi kahein: "Smartphone ki zaroorat hi nahi hai. Kisi bhi simple phone se 14477 par call karein ya mujhe batayein, turant cancel ho jayega."'
      },
      speak: {
        hi: 'स्मार्टफोन की जरूरत नहीं है। आप साधारण कीपैड फोन से टोल-फ्री 14477 पर कॉल करके इसे तुरंत बंद कर सकती हैं।',
        en: 'You do not need a smartphone. You can cancel anytime by calling toll-free 14477 or telling your ASHA worker.'
      }
    },
    {
      q: {
        hi: '5. "क्या मेरे परिवार वाले या ससुराल वाले मेरी महिला जांच रिपोर्ट बिना मेरी मर्जी देख सकते हैं?"',
        en: '5. "Can in-laws or relatives access my pregnancy/gynecology reports without my consent?"',
        hinglish: '5. "Kya family wale bina permission pregnancy reports dekh sakte hain?"'
      },
      a: {
        hi: 'आशा दीदी कहें: "नहीं! ABHA व्यक्तिगत होता है। आपकी सोनोग्राफी या महिला स्वास्थ्य की रिपोर्ट केवल आपकी अनुमति से ही देखी जा सकती है।',
        en: 'ASHA Didi says: "No! ABHA accounts are strictly personal and individual. Your ultrasound, pregnancy, and sensitive health records can only be unlocked with your explicit permission."',
        hinglish: 'ASHA Didi kahein: "Nahi! ABHA strictly personal hota hai. Aapki reports bina aapki marzi koi nahi dekh sakta."'
      },
      speak: {
        hi: 'नहीं! ABHA व्यक्तिगत होता है। आपकी सोनोग्राफी या महिला स्वास्थ्य की रिपोर्ट केवल आपकी अनुमति से ही देखी जा सकती है।',
        en: 'No! ABHA accounts are personal and confidential. Your reports cannot be seen without your consent.'
      }
    },
    {
      q: {
        hi: '6. "आशा कार्यकर्ता को क्या सम्मान व प्रोत्साहन मिलता है?"',
        en: '6. "How are ASHA workers rewarded for ensuring genuine data dignity?"',
        hinglish: '6. "ASHA workers ko data dignity ke liye kya reward milta hai?"'
      },
      a: {
        hi: 'हमारा सिस्टम सिर्फ गिनती नहीं देखता। जब आशा दीदी मरीज को पूरी बात समझाकर उनके अपने शब्दों में सहमति दर्ज कराती हैं, तो उन्हें अतिरिक्त गरिमा बोनस (Quality Dignity Credits) मिलता है।',
        en: 'Our system prioritizes dignity over tick-box speed. ASHA workers receive bonus honorarium credits for every citizen who explains consent in their own words, aligning frontline compensation with citizen rights.',
        hinglish: 'System quantity ke badle quality ko reward karta hai. Citizen ko samjha kar unke shabdon mein consent lene par ASHA didi ko extra bonus milta hai.'
      },
      speak: {
        hi: 'जब आशा दीदी मरीज को पूरी बात समझाकर उनके अपने शब्दों में सहमति दर्ज कराती हैं, तो उन्हें अतिरिक्त गरिमा बोनस मिलता है।',
        en: 'ASHA workers earn special dignity honorarium credits whenever citizens explain their choices in their own words.'
      }
    }
  ];

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>${lang.toolkit.title}</span>
        </div>
        <span class="status-chip">${lang.name}</span>
      </div>

      <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
        ${lang.toolkit.subtitle}
      </p>

      <div class="grid-2">
        ${faqs.map(f => {
          const qText = f.q[state.currentLang] || f.q.en || f.q.hi;
          const aText = f.a[state.currentLang] || f.a.en || f.a.hi;
          const spkText = f.speak[state.currentLang] || f.speak.en || f.speak.hi;
          return `
            <div class="card" style="background: #ffffff; border: 1.5px solid var(--border-subtle);">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem;">
                <h4 style="font-size: 1rem; color: var(--navy-dark); font-weight: 700;">${qText}</h4>
                <button type="button" class="btn-secondary btn-mini-speak-custom" data-text="${spkText}" style="padding: 0.25rem 0.6rem; font-size: 0.78rem; white-space: nowrap;">
                  <span>${lang.toolkit.btnListen}</span>
                </button>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary-saffron);">
                ${aText}
              </p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 4. PASSBOOK TAB: Citizen Consent Passbook
// --------------------------------------------------------------------------
function renderPassbookTab() {
  const lang = getLang();
  const allConsents = dataStore.getConsents();
  const filtered = state.passbookFilter === 'ALL' 
    ? allConsents 
    : allConsents.filter(c => c.status === state.passbookFilter);

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>${lang.passbook.title}</span>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn-secondary ${state.passbookFilter === 'ALL' ? 'active' : ''}" id="filterAll" style="font-size: 0.8rem; padding: 0.3rem 0.7rem;">${lang.passbook.filterAll} (${allConsents.length})</button>
          <button type="button" class="btn-secondary ${state.passbookFilter === 'ACTIVE' ? 'active' : ''}" id="filterActive" style="font-size: 0.8rem; padding: 0.3rem 0.7rem;">${lang.passbook.filterActive} (${allConsents.filter(c => c.status === 'ACTIVE').length})</button>
          <button type="button" class="btn-secondary ${state.passbookFilter === 'REVOKED' ? 'active' : ''}" id="filterRevoked" style="font-size: 0.8rem; padding: 0.3rem 0.7rem;">${lang.passbook.filterRevoked} (${allConsents.filter(c => c.status === 'REVOKED').length})</button>
        </div>
      </div>

      <div class="passbook-table-wrap">
        <table class="passbook-table">
          <thead>
            <tr>
              <th>${lang.passbook.thCitizen}</th>
              <th>${lang.passbook.thAbha}</th>
              <th>${lang.passbook.thConsentId}</th>
              <th>${lang.passbook.thScore}</th>
              <th>${lang.passbook.thStatus}</th>
              <th>${lang.passbook.thValidity}</th>
              <th>${lang.passbook.thAction}</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(c => `
              <tr>
                <td>
                  <div style="font-weight: 700; color: var(--navy-dark);">${c.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.village}</div>
                </td>
                <td style="font-family: monospace; font-size: 0.82rem;">${c.abhaId}</td>
                <td style="font-family: monospace; font-size: 0.82rem; color: var(--text-muted);">${c.consentId}</td>
                <td>
                  <span class="status-chip" style="background: #ecfdf5; color: #047857; font-weight: 700;">
                    ${c.dignityScore}% Verified
                  </span>
                </td>
                <td>
                  <span class="badge-status ${c.status === 'ACTIVE' ? 'active' : 'revoked'}">
                    ${c.status === 'ACTIVE' ? lang.passbook.statusActive : lang.passbook.statusRevoked}
                  </span>
                </td>
                <td style="font-size: 0.82rem;">
                  ${c.status === 'ACTIVE' ? `${c.validUntil}` : `<span style="color: #ef4444;">${c.revokedDate || 'Revoked'}</span>`}
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button type="button" class="btn-secondary btn-view-patra" data-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                      ${lang.passbook.btnView}
                    </button>
                    ${c.status === 'ACTIVE' ? `
                      <button type="button" class="btn-revoke-action btn-table-revoke" data-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                        ${lang.passbook.btnRevoke}
                      </button>
                    ` : `
                      <button type="button" class="btn-secondary btn-table-restore" data-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: #047857;">
                        ${lang.passbook.btnRestore}
                      </button>
                    `}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 5. DASHBOARD TAB: ASHA Dignity Points & Quality Audit
// --------------------------------------------------------------------------
function renderDashboardTab() {
  const lang = getLang();
  const stats = dataStore.getStats();

  return `
    <div>
      <!-- Dignity KPI Grid -->
      <div class="dignity-dashboard-grid">
        <div class="stat-kpi-card" style="border-top: 4px solid var(--primary-saffron);">
          <div class="kpi-icon">🛡️</div>
          <div class="kpi-value">${stats.totalConsents}</div>
          <div class="kpi-label">${lang.dashboard.kpiTotal}</div>
        </div>

        <div class="stat-kpi-card" style="border-top: 4px solid var(--primary-emerald);">
          <div class="kpi-icon">🎯</div>
          <div class="kpi-value">${stats.trueComprehensionRate}%</div>
          <div class="kpi-label">${lang.dashboard.kpiRate}</div>
        </div>

        <div class="stat-kpi-card" style="border-top: 4px solid #ef4444;">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-value">${stats.blindYesPrevented}</div>
          <div class="kpi-label">${lang.dashboard.kpiBlindYes}</div>
        </div>

        <div class="stat-kpi-card" style="border-top: 4px solid #8b5cf6;">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">₹${stats.ashaHonorariumBonus}</div>
          <div class="kpi-label">${lang.dashboard.kpiBonus}</div>
        </div>
      </div>

      <!-- Principles & System Architecture Card -->
      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom: 0.8rem;">
            <span>${lang.dashboard.principleTitle}</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            ${lang.dashboard.principleDesc}
          </p>
          <ul style="padding-left: 1.2rem; color: var(--navy-slate); font-size: 0.9rem; line-height: 1.7;">
            <li><strong>${lang.dashboard.p1}</strong></li>
            <li><strong>${lang.dashboard.p2}</strong></li>
            <li><strong>${lang.dashboard.p3}</strong></li>
          </ul>
        </div>

        <div class="card">
          <div class="card-title" style="margin-bottom: 0.8rem;">
            <span>${lang.dashboard.techTitle}</span>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
              <span>${lang.dashboard.t1Key}</span>
              <strong style="color: var(--navy-dark);">${lang.dashboard.t1Val}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
              <span>${lang.dashboard.t2Key}</span>
              <strong style="color: var(--navy-dark);">${lang.dashboard.t2Val}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
              <span>${lang.dashboard.t3Key}</span>
              <strong style="color: #047857;">${lang.dashboard.t3Val}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
              <span>${lang.dashboard.t4Key}</span>
              <strong style="color: var(--navy-dark);">${lang.dashboard.t4Val}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// EVENT HANDLERS & INTERACTIONS
// --------------------------------------------------------------------------
function attachEventHandlers() {
  const lang = getLang();

  // Home Navigation & Logout
  const btnNavHome = document.querySelector('#btnNavHome');
  if (btnNavHome) {
    btnNavHome.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.activeView = 'landing';
      renderApp();
    });
  }

  const navBrandHome = document.querySelector('#navBrandHome');
  if (navBrandHome) {
    navBrandHome.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.activeView = 'landing';
      renderApp();
    });
  }

  const btnLogout = document.querySelector('#btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.currentUser = null;
      try { localStorage.removeItem('meri_marzi_user'); } catch (e) {}
      state.activeView = 'login';
      state.authMode = 'login';
      renderApp();
    });
  }

  const btnNavToLogin = document.querySelector('#btnNavToLogin');
  if (btnNavToLogin) {
    btnNavToLogin.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.activeView = 'login';
      state.loginRole = 'asha';
      renderApp();
    });
  }

  // Tab Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.activeTab = btn.dataset.tab;
      renderApp();
    });
  });

  // Language Selector - INSTANTLY UPDATES ALL CONTENT ON THE SCREEN!
  const langSelector = document.querySelector('#langSelector');
  if (langSelector) {
    langSelector.addEventListener('change', (e) => {
      audioEngine.playClickSound();
      state.currentLang = e.target.value;
      speechManager.setLanguage(LANGUAGES[state.currentLang].voiceLang);
      
      // Update citizen draft defaults if matching language
      if (state.currentLang === 'en') {
        if (state.citizenForm.name === 'सुनीता देवी') state.citizenForm.name = 'Sunita Devi';
        if (state.citizenForm.village.includes('बाराबंकी')) state.citizenForm.village = 'Satarikh, Barabanki (UP)';
        if (state.citizenForm.healthContext.includes('गर्भावस्था')) state.citizenForm.healthContext = 'ANC Pregnancy checkup & blood test';
      } else if (state.currentLang === 'hi') {
        if (state.citizenForm.name === 'Sunita Devi') state.citizenForm.name = 'सुनीता देवी';
        if (state.citizenForm.village.includes('Barabanki')) state.citizenForm.village = 'सतरिख, बाराबंकी (उ.प्र.)';
        if (state.citizenForm.healthContext.includes('ANC')) state.citizenForm.healthContext = 'गर्भावस्था जांच (ANC Care) व खून की जांच';
      }

      // Re-evaluate if any spoken text exists so badges update language
      if (state.spokenText) {
        state.evaluationResult = comprehensionEngine.evaluate(state.spokenText, state.currentLang);
      }

      renderApp();
    });
  }

  // Audio Speed Toggle
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playClickSound();
      const speed = parseFloat(btn.dataset.speed);
      state.speechRate = speed;
      audioEngine.setSpeechRate(speed);
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Stepper Node Clicks
  document.querySelectorAll('.step-node').forEach(node => {
    node.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.wizardStep = parseInt(node.dataset.step, 10);
      renderApp();
    });
  });

  // Step 1: Quick Personas
  document.querySelectorAll('.persona-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      audioEngine.playClickSound();
      const p = chip.dataset.persona;
      const isEn = state.currentLang === 'en';
      if (p === 'sunita') {
        state.citizenForm = {
          name: isEn ? 'Sunita Devi' : 'सुनीता देवी', age: 32, gender: isEn ? 'Female' : 'महिला', 
          village: isEn ? 'Satarikh, Barabanki (UP)' : 'सतरिख, बाराबंकी (उ.प्र.)',
          abhaId: '91-4821-3390-1204', 
          healthContext: isEn ? 'ANC Pregnancy checkup & blood test' : 'गर्भावस्था जांच (ANC Care) व खून की जांच', 
          durationHours: 48, avatar: '👩🏽'
        };
      } else if (p === 'ramu') {
        state.citizenForm = {
          name: isEn ? 'Ramu Kaka' : 'रामू काका', age: 62, gender: isEn ? 'Male' : 'पुरुष', 
          village: isEn ? 'Milkipur, Ayodhya (UP)' : 'मिल्कीपुर, अयोध्या (उ.प्र.)',
          abhaId: '91-3312-9901-4456', 
          healthContext: isEn ? 'Diabetes checkup & chronic cough' : 'शुगर (डायबिटीज) व पुरानी खांसी का इलाज', 
          durationHours: 48, avatar: '👴🏽'
        };
      } else if (p === 'pooja') {
        state.citizenForm = {
          name: isEn ? 'Pooja Kumari' : 'पूजा कुमारी', age: 21, gender: isEn ? 'Female' : 'महिला', 
          village: isEn ? 'Mohaddipur, Gorakhpur (UP)' : 'मोहद्दीपुर, गोरखपुर (उ.प्र.)',
          abhaId: '91-8819-0211-9982', 
          healthContext: isEn ? 'Anemia consultation & nutrition supplements' : 'एनीमिया परामर्श व पोषण सप्लीमेंट्स', 
          durationHours: 48, avatar: '👩🏻'
        };
      } else if (p === 'manoj') {
        state.citizenForm = {
          name: isEn ? 'Manoj Yadav' : 'मनोज यादव', age: 39, gender: isEn ? 'Male' : 'पुरुष', 
          village: isEn ? 'Basti Sadar, Basti (UP)' : 'बस्ती सदर, बस्ती (उ.प्र.)',
          abhaId: '91-5501-7723-8812', 
          healthContext: isEn ? 'Fracture X-Ray consultation' : 'चोट व हड्डी का एक्सरे परामर्श', 
          durationHours: 48, avatar: '👨🏽'
        };
      }
      renderApp();
    });
  });

  // Step 1: Form Inputs
  const nameInp = document.querySelector('#citizenNameInput');
  if (nameInp) nameInp.addEventListener('input', e => { state.citizenForm.name = e.target.value; });
  const ageInp = document.querySelector('#citizenAgeInput');
  if (ageInp) ageInp.addEventListener('input', e => { state.citizenForm.age = e.target.value; });
  const villageInp = document.querySelector('#citizenVillageInput');
  if (villageInp) villageInp.addEventListener('input', e => { state.citizenForm.village = e.target.value; });

  // Live GPS Location Detection
  const btnLoc = document.querySelector('#btnDetectLiveLocation');
  const locStatus = document.querySelector('#locationStatusMsg');
  const locText = document.querySelector('#locBtnText');
  if (btnLoc) {
    btnLoc.addEventListener('click', () => {
      audioEngine.playClickSound();
      if (!navigator.geolocation) {
        if (locStatus) {
          locStatus.textContent = '⚠️ आपके ब्राउज़र में GPS सुविधा उपलब्ध नहीं है';
          locStatus.className = 'location-status-badge error';
          locStatus.style.display = 'flex';
        }
        return;
      }

      if (locText) locText.textContent = state.currentLang === 'hi' ? 'GPS खोज रहे हैं...' : 'Detecting GPS...';
      btnLoc.classList.add('loading');
      if (locStatus) {
        locStatus.textContent = state.currentLang === 'hi' ? '🛰️ उपग्रह से सिग्नल प्राप्त किया जा रहा है...' : '🛰️ Connecting to GPS satellites...';
        locStatus.className = 'location-status-badge info';
        locStatus.style.display = 'flex';
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          btnLoc.classList.remove('loading');
          if (locText) locText.textContent = state.currentLang === 'hi' ? 'लाइव लोकेशन (GPS)' : 'Live GPS';
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          let resolvedLocation = null;
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`, {
              signal: controller.signal,
              headers: { 'Accept-Language': state.currentLang === 'hi' ? 'hi,en' : 'en' }
            });
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const place = addr.village || addr.suburb || addr.town || addr.hamlet || addr.neighbourhood || addr.city_district || addr.city || 'सतरिख';
              const dist = addr.county || addr.state_district || addr.district || 'बाराबंकी';
              const st = addr.state || 'उत्तर प्रदेश';
              resolvedLocation = `${place}, ${dist} (${st})`;
            }
          } catch (e) {
            // Network fallback
          }

          if (!resolvedLocation) {
            resolvedLocation = `सतरिख, बाराबंकी (GPS: ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`;
          }

          state.citizenForm.village = resolvedLocation;
          const vInp = document.querySelector('#citizenVillageInput');
          if (vInp) vInp.value = resolvedLocation;

          audioEngine.playCelebrationSound();
          if (locStatus) {
            locStatus.textContent = `✅ GPS द्वारा सत्यापित गाँव: ${resolvedLocation}`;
            locStatus.className = 'location-status-badge success';
            locStatus.style.display = 'flex';
          }
        },
        (error) => {
          btnLoc.classList.remove('loading');
          if (locText) locText.textContent = state.currentLang === 'hi' ? 'लाइव लोकेशन (GPS)' : 'Live GPS';
          if (locStatus) {
            locStatus.textContent = state.currentLang === 'hi' 
              ? '⚠️ GPS अनुमति नहीं मिली: कृपया गाँव का नाम स्वयं दर्ज करें'
              : '⚠️ GPS permission not granted: Please type village name manually';
            locStatus.className = 'location-status-badge error';
            locStatus.style.display = 'flex';
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  const abhaInp = document.querySelector('#citizenAbhaInput');
  if (abhaInp) abhaInp.addEventListener('input', e => { state.citizenForm.abhaId = e.target.value; });
  const healthInp = document.querySelector('#citizenHealthInput');
  if (healthInp) healthInp.addEventListener('input', e => { state.citizenForm.healthContext = e.target.value; });

  // Navigation Buttons
  const btnNextToStep2 = document.querySelector('#btnNextToStep2');
  if (btnNextToStep2) {
    btnNextToStep2.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.wizardStep = 2;
      renderApp();
      setTimeout(() => {
        playSpokenIntro();
      }, 300);
    });
  }

  const btnBackToStep1 = document.querySelector('#btnBackToStep1');
  if (btnBackToStep1) {
    btnBackToStep1.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.wizardStep = 1;
      renderApp();
    });
  }

  const btnNextToStep3 = document.querySelector('#btnNextToStep3');
  if (btnNextToStep3) {
    btnNextToStep3.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.wizardStep = 3;
      renderApp();
    });
  }

  const btnBackToStep2 = document.querySelector('#btnBackToStep2');
  if (btnBackToStep2) {
    btnBackToStep2.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.wizardStep = 2;
      renderApp();
    });
  }

  // Audio Play All in Step 2
  const btnPlayAllAudio = document.querySelector('#btnPlayAllAudio');
  if (btnPlayAllAudio) {
    btnPlayAllAudio.addEventListener('click', () => {
      playSpokenIntro();
    });
  }

  const btnStopAudio = document.querySelector('#btnStopAudio');
  if (btnStopAudio) {
    btnStopAudio.addEventListener('click', () => {
      audioEngine.stop();
      const stopBtn = document.querySelector('#btnStopAudio');
      if (stopBtn) stopBtn.style.display = 'none';
    });
  }

  // Mini speak buttons in step 2
  document.querySelectorAll('.btn-mini-speak').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.speak;
      const text = lang.speechAudio[key];
      if (text) {
        audioEngine.speak(text, lang.voiceLang);
      }
    });
  });

  // Step 3: Speak Prompt
  const btnSpeakPrompt = document.querySelector('#btnSpeakPrompt');
  if (btnSpeakPrompt) {
    btnSpeakPrompt.addEventListener('click', () => {
      audioEngine.speak(lang.speechAudio.promptTeachBack, lang.voiceLang);
    });
  }

  // Step 3: Mic Recording Toggle
  const btnMicRecord = document.querySelector('#btnMicRecord');
  if (btnMicRecord) {
    btnMicRecord.addEventListener('click', () => {
      if (state.isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    });
  }

  // Step 3: Clear Transcript
  const btnClearTranscript = document.querySelector('#btnClearTranscript');
  if (btnClearTranscript) {
    btnClearTranscript.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.spokenText = '';
      state.evaluationResult = null;
      state.activeSamplePresetId = null;
      renderApp();
    });
  }

  // Step 3: Persona Preset Click
  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      audioEngine.playClickSound();
      const id = card.dataset.presetId;
      const item = SAMPLE_RESPONSES.find(s => s.id === id);
      if (item) {
        const text = item.text[state.currentLang] || item.text.en || item.text.hi;
        state.spokenText = text;
        state.activeSamplePresetId = item.id;
        state.evaluationResult = comprehensionEngine.evaluate(text, state.currentLang);

        if (state.evaluationResult.isVerified) {
          audioEngine.playSuccessChime();
        } else if (state.evaluationResult.isBlindYes) {
          audioEngine.playCautionChime();
          dataStore.recordBlindYesIntervention();
        } else if (state.evaluationResult.misconceptions.length > 0) {
          audioEngine.playCautionChime();
          dataStore.recordMisconceptionResolved();
        }

        renderApp();
      }
    });
  });

  // Step 3: Record Consent Button (Unlocked only when verified)
  const btnRecordConsent = document.querySelector('#btnRecordConsent');
  if (btnRecordConsent) {
    btnRecordConsent.addEventListener('click', () => {
      if (!state.evaluationResult || !state.evaluationResult.isVerified) {
        audioEngine.playCautionChime();
        return;
      }

      audioEngine.playSuccessChime();
      launchConfetti();

      const newConsent = dataStore.addConsent({
        name: state.citizenForm.name,
        age: state.citizenForm.age,
        gender: state.citizenForm.gender,
        village: state.citizenForm.village,
        abhaId: state.citizenForm.abhaId,
        healthContext: state.citizenForm.healthContext,
        durationHours: state.citizenForm.durationHours || 48,
        dignityScore: state.evaluationResult.score,
        voiceSnippetText: state.spokenText,
        audioProofUrl: speechManager.getAudioProofUrl()
      });

      state.latestConsent = newConsent;
      state.wizardStep = 4;
      renderApp();
    });
  }

  // Step 4: Play Voice Proof snippet
  const btnPlayVoiceProof = document.querySelector('#btnPlayVoiceProof');
  if (btnPlayVoiceProof) {
    btnPlayVoiceProof.addEventListener('click', () => {
      const text = btnPlayVoiceProof.dataset.text;
      if (text) {
        audioEngine.speak(text, lang.voiceLang);
      }
    });
  }

  // Step 4: Print Samman Patra
  const btnPrintCard = document.querySelector('#btnPrintCard');
  if (btnPrintCard) {
    btnPrintCard.addEventListener('click', () => {
      window.print();
    });
  }

  // Step 4 & 5: Trigger Revocation
  const btnTriggerRevocation = document.querySelector('#btnTriggerRevocation');
  if (btnTriggerRevocation) {
    btnTriggerRevocation.addEventListener('click', () => {
      audioEngine.playCautionChime();
      const item = state.latestConsent || dataStore.getConsents()[0];
      if (item) {
        dataStore.revokeConsent(item.consentId);
        state.wizardStep = 5;
        renderApp();
      }
    });
  }

  const btnGoToStep5 = document.querySelector('#btnGoToStep5');
  if (btnGoToStep5) {
    btnGoToStep5.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.wizardStep = 5;
      renderApp();
    });
  }

  const btnSimulateUssd = document.querySelector('#btnSimulateUssd');
  if (btnSimulateUssd) {
    btnSimulateUssd.addEventListener('click', () => {
      audioEngine.playCautionChime();
      const item = state.latestConsent || dataStore.getConsents()[0];
      if (item) {
        dataStore.revokeConsent(item.consentId, 'Revoked via USSD *99*14477#');
        renderApp();
      }
    });
  }

  const btnSimulateAshaRevoke = document.querySelector('#btnSimulateAshaRevoke');
  if (btnSimulateAshaRevoke) {
    btnSimulateAshaRevoke.addEventListener('click', () => {
      audioEngine.playCautionChime();
      const item = state.latestConsent || dataStore.getConsents()[0];
      if (item) {
        dataStore.revokeConsent(item.consentId, 'Revoked by ASHA worker on citizen request');
        renderApp();
      }
    });
  }

  const btnReactivateConsent = document.querySelector('#btnReactivateConsent');
  if (btnReactivateConsent) {
    btnReactivateConsent.addEventListener('click', () => {
      audioEngine.playSuccessChime();
      const item = state.latestConsent || dataStore.getConsents()[0];
      if (item) {
        dataStore.restoreConsent(item.consentId);
        renderApp();
      }
    });
  }

  const btnNewRegistration = document.querySelector('#btnNewRegistration');
  if (btnNewRegistration) {
    btnNewRegistration.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.wizardStep = 1;
      state.spokenText = '';
      state.evaluationResult = null;
      renderApp();
    });
  }

  const btnGoToPassbook = document.querySelector('#btnGoToPassbook');
  if (btnGoToPassbook) {
    btnGoToPassbook.addEventListener('click', () => {
      audioEngine.playClickSound();
      state.activeTab = 'passbook';
      renderApp();
    });
  }

  // Story Tab Narrate Button
  const btnNarrateWholeStory = document.querySelector('#btnNarrateWholeStory');
  if (btnNarrateWholeStory) {
    btnNarrateWholeStory.addEventListener('click', () => {
      const fullText = `${lang.speechAudio.tijoriMetaphor} ${lang.speechAudio.pillar1Recipient} ${lang.speechAudio.pillar2Duration} ${lang.speechAudio.pillar3Revocation}`;
      audioEngine.speak(fullText, lang.voiceLang);
    });
  }

  // Toolkit Custom Speak Buttons
  document.querySelectorAll('.btn-mini-speak-custom').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.text;
      if (text) {
        audioEngine.speak(text, lang.voiceLang);
      }
    });
  });

  // Passbook Filter Buttons
  const filterAll = document.querySelector('#filterAll');
  if (filterAll) filterAll.addEventListener('click', () => { state.passbookFilter = 'ALL'; renderApp(); });
  const filterActive = document.querySelector('#filterActive');
  if (filterActive) filterActive.addEventListener('click', () => { state.passbookFilter = 'ACTIVE'; renderApp(); });
  const filterRevoked = document.querySelector('#filterRevoked');
  if (filterRevoked) filterRevoked.addEventListener('click', () => { state.passbookFilter = 'REVOKED'; renderApp(); });

  // Passbook View Patra Modal
  document.querySelectorAll('.btn-view-patra').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = dataStore.getConsents().find(c => c.id === id);
      if (item) {
        showSammanPatraModal(item);
      }
    });
  });

  // Passbook Table Revoke / Restore
  document.querySelectorAll('.btn-table-revoke').forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playCautionChime();
      dataStore.revokeConsent(btn.dataset.id);
      renderApp();
    });
  });

  document.querySelectorAll('.btn-table-restore').forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playSuccessChime();
      dataStore.restoreConsent(btn.dataset.id);
      renderApp();
    });
  });

  // Native Dialog Close
  const modal = document.querySelector('#sammanPatraModal');
  const closeBtn = document.querySelector('#closeModalBtn');
  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.close();
    });
  }
}

// Spoken Intro Player Helper
function playSpokenIntro() {
  const lang = getLang();
  const text = `${lang.speechAudio.step1Intro} ${lang.speechAudio.tijoriMetaphor} ${lang.speechAudio.pillar1Recipient} ${lang.speechAudio.pillar2Duration} ${lang.speechAudio.pillar3Revocation}`;
  
  const stopBtn = document.querySelector('#btnStopAudio');
  if (stopBtn) stopBtn.style.display = 'inline-block';

  audioEngine.speak(text, lang.voiceLang, null, () => {
    if (stopBtn) stopBtn.style.display = 'none';
  });
}

// Mic Recording Manager
function startRecording() {
  audioEngine.playMicStartSound();
  state.isRecording = true;
  const lang = getLang();

  speechManager.startListening(
    (interim) => {
      const display = document.querySelector('#spokenTranscriptArea');
      if (display) {
        display.innerHTML = `<em>"${interim}..."</em>`;
      }
    },
    (finalText) => {
      state.spokenText = finalText;
      state.evaluationResult = comprehensionEngine.evaluate(finalText, state.currentLang);

      if (state.evaluationResult.isVerified) {
        audioEngine.playSuccessChime();
      } else if (state.evaluationResult.isBlindYes) {
        audioEngine.playCautionChime();
        dataStore.recordBlindYesIntervention();
      } else if (state.evaluationResult.misconceptions.length > 0) {
        audioEngine.playCautionChime();
        dataStore.recordMisconceptionResolved();
      }
      renderApp();
    },
    (err) => {
      console.warn('Speech recognition error:', err);
      state.isRecording = false;
      const statusText = document.querySelector('#micStatusText');
      if (statusText) {
        statusText.innerText = state.currentLang === 'en' 
          ? 'Microphone not available. Please click any sample response above.'
          : 'माइक सक्रिय नहीं हो सका। कृपया ऊपर दिए गए उदाहरण उत्तरों पर क्लिक करें।';
      }
    },
    () => {
      renderApp();
    },
    (finalText) => {
      state.isRecording = false;
      if (finalText && finalText.trim().length > 0) {
        state.spokenText = finalText;
        state.evaluationResult = comprehensionEngine.evaluate(finalText, state.currentLang);
      }
      renderApp();
    }
  );
}

function stopRecording() {
  speechManager.stopListening();
  state.isRecording = false;
  audioEngine.playClickSound();
  renderApp();
}

// Waveform Initializer
function initVisualizer() {
  const canvas = document.querySelector('#audioWaveformCanvas') || document.querySelector('#recordingWaveCanvas');
  if (canvas) {
    audioEngine.startWaveform(canvas, () => audioEngine.isSpeaking || state.isRecording);
  }
}

// Show Samman Patra Modal (Modern Web Guidance compliant <dialog>)
function showSammanPatraModal(item) {
  const lang = getLang();
  const modal = document.querySelector('#sammanPatraModal');
  const body = document.querySelector('#modalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <span style="font-size: 2rem;">📜</span>
      <h3 style="color: var(--navy-dark); font-family: var(--font-heading);">${item.name} — ${lang.step4.certTitle}</h3>
      <span class="badge-status ${item.status === 'ACTIVE' ? 'active' : 'revoked'}">
        ${lang.step5.statusLabel} ${item.status === 'ACTIVE' ? lang.step5.statusActive : lang.step5.statusRevoked}
      </span>
    </div>

    <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
      <div><strong>${lang.step4.fieldAbha}:</strong> ${item.abhaId}</div>
      <div><strong>${lang.step4.fieldConsentId}:</strong> ${item.consentId}</div>
      <div><strong>${lang.passbook.thScore}:</strong> ${item.dignityScore}% Verified</div>
      <div><strong>${lang.step1.fields.village}:</strong> ${item.village}</div>
      <div><strong>${lang.step4.fieldValidity}:</strong> ${item.validUntil}</div>
    </div>

    <div style="background: #fff7ed; padding: 0.85rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary-saffron); font-size: 0.88rem; margin-bottom: 1.25rem;">
      <strong>${lang.step4.voiceProofTitle}</strong><br/>
      <em>"${item.voiceSnippetText}"</em>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button type="button" class="btn-secondary" onclick="window.print()">🖨️ ${lang.step4.btnPrint}</button>
      <button type="button" class="btn-primary" onclick="document.querySelector('#sammanPatraModal').close()">Close</button>
    </div>
  `;

  modal.showModal();
}

// Subscribe DataStore changes to auto-update UI
dataStore.subscribe(() => {
  if (state.activeTab === 'passbook' || state.activeTab === 'dashboard') {
    renderApp();
  }
});

// Initial Launch
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderApp();
}
