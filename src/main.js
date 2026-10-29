// ==========================================================================
// Meri Marzi (मेरी मर्ज़ी) — Frontend Application
// Track: Sahayak & Samman Bharat | Theme: Frontline Workers & Data Dignity
// ==========================================================================

import './style.css';
import { LANGUAGES } from './modules/languages.js';
import { audioEngine } from './modules/audioEngine.js';
import { speechManager } from './modules/speechRecognition.js';
import { comprehensionEngine, SAMPLE_RESPONSES } from './modules/comprehensionEngine.js';
import { dataStore } from './modules/dataStore.js';

// Application State
const state = {
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

function t(keyPath) {
  const keys = keyPath.split('.');
  let obj = getLang();
  for (const k of keys) {
    if (!obj || obj[k] === undefined) return keyPath;
    obj = obj[k];
  }
  return obj;
}

// Main Render Function
function renderApp() {
  const lang = getLang();
  const app = document.querySelector('#app');
  if (!app) return;

  app.innerHTML = `
    <!-- Top Government ABDM Standard Ribbon -->
    <div class="govt-ribbon"></div>
    <header class="govt-header-badge">
      <div class="govt-badge-left">
        <span class="flag-emblem">🇮🇳</span>
        <span>आयुष्मान भारत डिजिटल मिशन (ABDM) — राष्ट्रीय स्वास्थ्य प्राधिकरण</span>
      </div>
      <div class="govt-badge-right">
        <span class="status-chip">
          <span class="pulse-dot"></span>
          <span>डेटा गरिमा वाक् सहायक (Voice Active)</span>
        </span>
        <span style="color: #64748b; font-size: 0.78rem;">धारा 6(1) DPDP Act 2023 अनुरूप</span>
      </div>
    </header>

    <div class="app-container">
      <!-- Main Nav -->
      <nav class="main-nav">
        <div class="brand-wrapper">
          <div class="brand-icon">🛡️</div>
          <div>
            <div class="brand-title">${lang.appName}</div>
            <div class="brand-subtitle">${lang.appSubtitle}</div>
          </div>
        </div>

        <div class="nav-actions">
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
            <span style="font-size: 0.75rem; font-weight: 700; padding: 0 0.4rem; color: #64748b;">गति:</span>
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
          <span class="tab-badge">चरण ${state.wizardStep}/5</span>
        </button>
        <button class="tab-btn ${state.activeTab === 'story' ? 'active' : ''}" data-tab="story">
          <span>🗝️</span> ${lang.tabs.story}
        </button>
        <button class="tab-btn ${state.activeTab === 'toolkit' ? 'active' : ''}" data-tab="toolkit">
          <span>🩺</span> ${lang.tabs.toolkit}
          <span class="tab-badge">6 शंकाएं</span>
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
        <h3 id="modalTitle" style="font-family: var(--font-heading); color: var(--navy-dark); font-size: 1.3rem;">📜 मेरी मर्ज़ी सम्मान पत्र</h3>
        <button class="dialog-close-btn" id="closeModalBtn" aria-label="Close dialog">&times;</button>
      </div>
      <div id="modalBody"></div>
    </dialog>
  `;

  attachEventHandlers();
  initVisualizer();
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
          <span>मेरी मर्ज़ी:</span>
          <span class="hero-highlight">डेटा सहमति मार्गदर्शक</span>
        </h1>
        <p>${lang.tagline}</p>

        <div class="hero-quick-stats">
          <div class="quick-stat-item">
            <span class="stat-num" style="color: var(--primary-emerald-dark);">${dataStore.getStats().trueComprehensionRate}%</span>
            <span class="stat-label">वास्तविक समझ दर</span>
          </div>
          <div class="quick-stat-item">
            <span class="stat-num" style="color: var(--primary-saffron-dark);">${dataStore.getStats().blindYesPrevented}</span>
            <span class="stat-label">सिर्फ 'हाँ' रोका गया</span>
          </div>
          <div class="quick-stat-item">
            <span class="stat-num" style="color: var(--navy-dark);">${dataStore.getStats().totalConsents}</span>
            <span class="stat-label">सहमति कार्ड जारी</span>
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
        <div class="step-title">नागरिक पहचान</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 2 ? 'active' : state.wizardStep > 2 ? 'completed' : ''}" data-step="2">
        <div class="step-circle">${state.wizardStep > 2 ? '✓' : '2'}</div>
        <div class="step-title">बोलकर समझाएं</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 3 ? 'active' : state.wizardStep > 3 ? 'completed' : ''}" data-step="3">
        <div class="step-circle">${state.wizardStep > 3 ? '✓' : '3'}</div>
        <div class="step-title">अपनी भाषा में समझ (KEY)</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 4 ? 'active' : state.wizardStep > 4 ? 'completed' : ''}" data-step="4">
        <div class="step-circle">${state.wizardStep > 4 ? '✓' : '4'}</div>
        <div class="step-title">सम्मान पत्र जारी</div>
      </div>
      <div class="step-divider"></div>
      <div class="step-node ${state.wizardStep === 5 ? 'active' : ''}" data-step="5">
        <div class="step-circle">5</div>
        <div class="step-title">रद्द करने का अभ्यास</div>
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
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>👤 चरण 1: नागरिक विवरण एवं संदर्भ</span>
        </div>
        <span class="status-chip">आशा कार्यकर्ता: शांति देवी (ASHA-BRB-108)</span>
      </div>

      <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem;">
        नीचे दिए गए ग्रामीण उदाहरणों में से किसी एक को चुनें या वास्तविक नागरिक की जानकारी भरें:
      </p>

      <!-- Quick Personas -->
      <div class="persona-picker">
        <button type="button" class="persona-chip ${state.citizenForm.name === 'सुनीता देवी' ? 'selected' : ''}" data-persona="sunita">
          <span>👩🏽</span> सुनीता देवी (गर्भवती, 32 वर्ष)
        </button>
        <button type="button" class="persona-chip ${state.citizenForm.name === 'रामू काका' ? 'selected' : ''}" data-persona="ramu">
          <span>👴🏽</span> रामू काका (बुजुर्ग किसान, 62 वर्ष)
        </button>
        <button type="button" class="persona-chip ${state.citizenForm.name === 'पूजा कुमारी' ? 'selected' : ''}" data-persona="pooja">
          <span>👩🏻</span> पूजा कुमारी (छात्रा, 21 वर्ष)
        </button>
        <button type="button" class="persona-chip ${state.citizenForm.name === 'मनोज यादव' ? 'selected' : ''}" data-persona="manoj">
          <span>👨🏽</span> मनोज यादव (ड्राइवर, 39 वर्ष)
        </button>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">नागरिक का नाम</label>
          <input type="text" id="citizenNameInput" class="form-input" value="${state.citizenForm.name}" />
        </div>
        <div class="form-group">
          <label class="form-label">उम्र एवं लिंग</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="number" id="citizenAgeInput" class="form-input" style="max-width: 100px;" value="${state.citizenForm.age}" />
            <select id="citizenGenderSelect" class="form-select">
              <option value="महिला" ${state.citizenForm.gender === 'महिला' ? 'selected' : ''}>महिला</option>
              <option value="पुरुष" ${state.citizenForm.gender === 'पुरुष' ? 'selected' : ''}>पुरुष</option>
              <option value="अन्य" ${state.citizenForm.gender === 'अन्य' ? 'selected' : ''}>अन्य</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">गाँव / मोहल्ला व जिला</label>
          <input type="text" id="citizenVillageInput" class="form-input" value="${state.citizenForm.village}" />
        </div>
        <div class="form-group">
          <label class="form-label">ABHA संख्या (14-अंक) / मोबाइल</label>
          <input type="text" id="citizenAbhaInput" class="form-input" value="${state.citizenForm.abhaId}" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">स्वास्थ्य संदर्भ (कारण)</label>
        <input type="text" id="citizenHealthInput" class="form-input" value="${state.citizenForm.healthContext}" placeholder="उदा. ANC जांच, बुखार, डायबिटीज..." />
      </div>

      <div class="action-buttons-row">
        <button type="button" class="btn-primary" id="btnNextToStep2">
          <span>आगे बढ़ें: बोलकर समझाएं</span> <span>➡️</span>
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
          <span>📢 चरण 2: बोलने वाला मार्गदर्शक — नागरिक को सुनाएं</span>
        </div>
        <span class="status-chip">भाषा: ${lang.name}</span>
      </div>

      <!-- Audio Guide Player Bar -->
      <div class="audio-guide-player">
        <div class="audio-guide-header">
          <div class="guide-speaker-info">
            <div class="speaker-avatar">🔊</div>
            <div class="speaker-meta">
              <h4>बोलने वाला सहायक (ASHA Spoken Companion)</h4>
              <span>नागरिक और आशा दीदी दोनों साथ में सुनें</span>
            </div>
          </div>

          <div class="audio-controls">
            <button type="button" class="btn-speak-play" id="btnPlayAllAudio">
              <span>▶️ बोलकर सुनाएं</span>
            </button>
            <button type="button" class="btn-speak-stop" id="btnStopAudio" style="display: ${audioEngine.isSpeaking ? 'inline-block' : 'none'};">
              <span>⏹️ रोकें</span>
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
              <h5>1. कौन और क्या देख सकता है?</h5>
              <p>सिर्फ आपका इलाज करने वाले डॉक्टर—कोई बैंक, पुलिस या बीमा कंपनी नहीं छू सकती।</p>
            </div>
            <button type="button" class="btn-secondary btn-mini-speak" data-speak="pillar1Recipient" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">🔊 सुनें</button>
          </div>

          <div class="story-point-card" data-audio-key="pillar2Duration">
            <div class="story-icon">⏳</div>
            <div class="story-text">
              <h5>2. कब तक देख सकेंगे?</h5>
              <p>सिर्फ सीमित समय (जैसे 48 घंटे या इलाज समाप्त होने तक)। फिर ताला स्वतः बंद।</p>
            </div>
            <button type="button" class="btn-secondary btn-mini-speak" data-speak="pillar2Duration" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">🔊 सुनें</button>
          </div>

          <div class="story-point-card" data-audio-key="pillar3Revocation" style="border: 1.5px solid #10b981; background: #ecfdf5;">
            <div class="story-icon">🗝️</div>
            <div class="story-text">
              <h5 style="color: #047857;">3. सबसे बड़ा अधिकार: 'मेरी मर्ज़ी'</h5>
              <p>चाभी आपके हाथ में है! 1 मिस्ड कॉल से कभी भी रद्द करें। रद्द करने पर भी आपका इलाज कभी नहीं रुकेगा!</p>
            </div>
            <button type="button" class="btn-secondary btn-mini-speak" data-speak="pillar3Revocation" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">🔊 सुनें</button>
          </div>
        </div>
      </div>

      <div class="action-buttons-row">
        <button type="button" class="btn-secondary" id="btnBackToStep1">
          <span>⬅️ वापस</span>
        </button>
        <button type="button" class="btn-primary" id="btnNextToStep3">
          <span>आगे बढ़ें: अपनी भाषा में समझाएं (KEY) ➡️</span>
        </button>
      </div>
    </div>
  `;
}

// Step 3: Explain In Your Own Words (Teach-Back) - THE CRITICAL KEY REQUIREMENT
function renderStep3() {
  const lang = getLang();
  const evaluation = state.evaluationResult || comprehensionEngine.evaluate(state.spokenText);

  return `
    <div class="teach-back-arena">
      <div class="teach-back-headline">
        <h2>🗣️ अपनी भाषा में समझाइए (Teach-Back Method)</h2>
        <p><strong>नियम:</strong> सहमति दर्ज करने से पहले, नागरिक को अपने शब्दों में समझाने को कहें। सिर्फ "हाँ" कहना सहमति नहीं है।</p>
      </div>

      <!-- Spoken Prompt Banner -->
      <div style="background: #fff7ed; border-left: 4px solid var(--primary-saffron); padding: 1rem 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-size: 0.8rem; font-weight: 700; color: #c2410c; text-transform: uppercase;">आशा दीदी नागरिक से यह पूछें:</span>
          <p style="font-size: 1.05rem; font-weight: 600; color: var(--navy-dark); margin-top: 0.2rem;">
            "${state.citizenForm.name} जी, कृप्या अपनी भाषा में बताइए कि आपने क्या समझा? डॉक्टर साहब क्या देखेंगे, कब तक देखेंगे, और क्या आप इसे बीच में रोक सकती हैं?"
          </p>
        </div>
        <button type="button" class="btn-secondary" id="btnSpeakPrompt" style="background: #ffffff;">
          <span>🔊 प्रश्न सुनाएं</span>
        </button>
      </div>

      <!-- Mic Interaction Center -->
      <div class="mic-control-center">
        <button type="button" class="big-mic-button ${state.isRecording ? 'recording' : ''}" id="btnMicRecord" title="बोलकर समझाएं (Click to speak)">
          <span>${state.isRecording ? '🛑' : '🎙️'}</span>
        </button>
        <div class="mic-instruction-text" id="micStatusText">
          ${state.isRecording ? 'लाल बटन दबाकर बोलना समाप्त करें... (सुन रहे हैं)' : 'माइक बटन दबाएं और नागरिक को बोलने दें'}
        </div>
        <canvas id="recordingWaveCanvas" class="waveform-canvas" width="400" height="30" style="max-width: 400px;"></canvas>
      </div>

      <!-- Quick Authentic Persona Response Presets (Crucial for Demo/Testing) -->
      <div>
        <div class="preset-section-title">
          <span>⚡ या त्वरित परीक्षण के लिए ग्रामीण उत्तर चुनें (Click any field sample):</span>
        </div>
        <div class="preset-responses-grid">
          ${SAMPLE_RESPONSES.map(resp => `
            <button type="button" class="preset-card ${state.activeSamplePresetId === resp.id ? 'selected' : ''}" data-preset-id="${resp.id}">
              <div class="preset-card-title">${resp.title}</div>
              <div class="preset-card-speaker">${resp.speaker}</div>
              <div class="preset-card-snippet">"${resp.text}"</div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Spoken Transcript Box -->
      <div class="live-transcript-box ${state.spokenText ? 'has-content' : ''}">
        <div class="transcript-header">
          <span>नागरिक द्वारा बोले गए शब्द (Citizen's Own Words):</span>
          <button type="button" class="btn-secondary" id="btnClearTranscript" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">साफ़ करें</button>
        </div>
        <div class="spoken-text-display" id="spokenTranscriptArea">
          ${state.spokenText ? `"${state.spokenText}"` : `<span class="spoken-text-placeholder">माइक चालू करें या ऊपर दिए गए उत्तर पर क्लिक करें...</span>`}
        </div>
      </div>

      <!-- Intelligent Dignity Compass Analysis -->
      <div class="compass-analysis-card">
        <div class="compass-header">
          <div>
            <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--navy-dark);">
              🧭 गरिमा कम्पास: समझ मूल्यांकन (Comprehension Score)
            </h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">तीनों स्तंभों की जांच (Scope, Duration, Revocation)</span>
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
              <span>1. डॉक्टर व डेटा सीमा</span>
            </div>
            <div class="pillar-item-desc">
              ${evaluation.p1Status ? 'पहचाना: सिर्फ इलाज करने वाले डॉक्टर देखेंगे' : 'नागरिक ने डॉक्टर या रिपोर्ट का उल्लेख नहीं किया'}
            </div>
          </div>

          <div class="pillar-item ${evaluation.p2Status ? 'verified' : 'unverified'}">
            <div class="pillar-item-title">
              <span>${evaluation.p2Status ? '✅' : '⚪'}</span>
              <span>2. समय सीमा (Duration)</span>
            </div>
            <div class="pillar-item-desc">
              ${evaluation.p2Status ? 'पहचाना: सीमित अवधि (जैसे 2 दिन या इलाज तक)' : 'नागरिक ने समय सीमा नहीं बताई'}
            </div>
          </div>

          <div class="pillar-item ${evaluation.p3Status ? 'verified' : 'unverified'}" style="${evaluation.p3Status ? 'border: 2px solid #10b981;' : ''}">
            <div class="pillar-item-title">
              <span>${evaluation.p3Status ? '✅' : '⚪'}</span>
              <span>3. 'मेरी मर्ज़ी' (रद्द करने का हक)</span>
            </div>
            <div class="pillar-item-desc">
              ${evaluation.p3Status ? 'पहचाना: कभी भी रोक सकते हैं, इलाज नहीं रुकेगा' : 'नागरिक ने रद्द करने के अधिकार पर बात नहीं की'}
            </div>
          </div>
        </div>

        <!-- Dynamic ASHA Coach Dialogue Alert -->
        <div class="asha-coach-alert ${evaluation.isVerified ? '' : evaluation.misconceptions.length > 0 ? 'danger' : 'warning'}">
          <div class="coach-icon">
            ${evaluation.isVerified ? '🎉' : evaluation.misconceptions.length > 0 ? '💡' : '📢'}
          </div>
          <div class="coach-content">
            <h4>आशा दीदी के लिए निर्देश (ASHA Guided Dialogue):</h4>
            <div class="coach-dialogue-text">
              ${evaluation.ashaCoachTip}
            </div>
          </div>
        </div>

        ${evaluation.isBlindYes ? `
          <div style="background: #fffbeb; border: 1px solid #fcd34d; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.88rem; color: #92400e; margin-top: 0.5rem;">
            <strong>⚠️ महत्वपूर्ण सिद्धांत:</strong> सिर्फ "हाँ" कहना सहमति नहीं है। जब नागरिक खुद बताएंगे कि वे क्या समझ रहे हैं, तभी उनका स्वास्थ्य डेटा गरिमा के साथ सुरक्षित रहेगा।
          </div>
        ` : ''}
      </div>

      <!-- Action Row -->
      <div class="action-buttons-row">
        <button type="button" class="btn-secondary" id="btnBackToStep2">
          <span>⬅️ वापस</span>
        </button>
        <button type="button" class="btn-primary" id="btnRecordConsent" ${!evaluation.isVerified ? 'disabled' : ''} style="${evaluation.isVerified ? 'box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); background: linear-gradient(135deg, #10b981 0%, #059669 100%);' : ''}">
          <span>${evaluation.isVerified ? '✅ गरिमापूर्ण सहमति दर्ज करें' : '⚠️ तीनों अधिकार समझने पर ही खुलेगा'}</span>
          <span>${evaluation.isVerified ? '📜' : '🔒'}</span>
        </button>
      </div>
    </div>
  `;
}

// Step 4: Official Consent Recorded & Samman Patra Generation
function renderStep4() {
  const item = state.latestConsent || dataStore.getConsents()[0];
  if (!item) return `<div class="card"><p>कोई सहमति नहीं मिली</p></div>`;

  return `
    <div>
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span class="status-chip" style="font-size: 0.9rem; padding: 0.4rem 1rem; background: #ecfdf5; color: #047857;">
          🎉 बधाई! नागरिक ने पूरी समझ के साथ सहमति दर्ज कराई है (+50 गरिमा अंक अर्जित)
        </span>
      </div>

      <!-- The Official Meri Marzi Samman Patra -->
      <div class="samman-patra-card" id="printableSammanPatra">
        <div class="samman-patra-watermark">MERI MARZI • DATA DIGNITY</div>

        <div class="patra-header">
          <div class="emblem-row">
            <span>🏛️ राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA / ABDM)</span>
            <span>•</span>
            <span>डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP)</span>
          </div>
          <h3>मेरी मर्ज़ी स्वास्थ्य-डेटा सम्मान पत्र</h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">
            ABHA Informed Health-Data Consent & Dignity Certificate
          </p>
        </div>

        <div class="patra-details-grid">
          <div class="patra-field">
            <span class="patra-field-label">नागरिक का नाम</span>
            <span class="patra-field-value">${item.name} (${item.age} वर्ष, ${item.gender})</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">ABHA संख्या व पता</span>
            <span class="patra-field-value">${item.abhaId} • ${item.abhaAddress}</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">सहमति आईडी (ABDM Artifact)</span>
            <span class="patra-field-value" style="font-family: monospace; color: var(--navy-dark);">${item.consentId}</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">वैधता अवधि</span>
            <span class="patra-field-value" style="color: #047857;">48 घंटे (${item.validUntil} तक)</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">डेटा दायरा व उद्देश्य</span>
            <span class="patra-field-value">केवल वर्तमान परामर्श व जांच रिपोर्ट (OPD / Lab)</span>
          </div>
          <div class="patra-field">
            <span class="patra-field-label">आशा कार्यकर्ता गवाह</span>
            <span class="patra-field-value">${item.ashaName}</span>
          </div>
        </div>

        <!-- Voice Consent Snippet Proof (Audio Receipt) -->
        <div class="patra-voice-proof">
          <div class="voice-proof-header">
            <span>🎙️ नागरिक की अपनी आवाज में समझ का प्रमाण (Audio Consent Receipt):</span>
            <span class="status-chip" style="background: #e0f2fe; color: #0369a1;">100% Verified</span>
          </div>
          <div class="voice-proof-quote">
            "${item.voiceSnippetText}"
          </div>
          <button type="button" class="btn-play-voice-receipt" id="btnPlayVoiceProof" data-text="${item.voiceSnippetText}">
            <span>▶️ नागरिक की आवाज में समझ सुनें</span>
          </button>
        </div>

        <!-- Revocation Instructions Box -->
        <div class="revocation-banner">
          <div class="revocation-info">
            <h4>🗝️ मेरी मर्ज़ी: अनुमति कभी भी वापस लेने के तरीके</h4>
            <p>1. टोल-फ्री <strong>14477</strong> पर कॉल करें • 2. SMS भेजें: <strong>ROK ${item.consentId.split('-').pop()}</strong> to 56767 • 3. आशा दीदी से कहें</p>
            <p style="margin-top: 0.2rem; font-weight: 700; color: #991b1b;">
              ⚠️ अनुमति रद्द करने पर भी सरकारी अस्पताल में आपका इलाज एवं दवाएं पहले जैसी ही चलती रहेंगी!
            </p>
          </div>
          <div>
            <button type="button" class="btn-revoke-action" id="btnTriggerRevocation">
              <span>🛑 अभी रद्द करके देखें (Test Revocation)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons-row" style="justify-content: center; gap: 1rem;">
        <button type="button" class="btn-secondary btn-print" id="btnPrintCard">
          <span>🖨️ सम्मान पत्र प्रिंट / PDF सेव करें</span>
        </button>
        <button type="button" class="btn-primary" id="btnGoToStep5">
          <span>चरण 5: रद्द करने का अभ्यास करें ➡️</span>
        </button>
      </div>
    </div>
  `;
}

// Step 5: Live Revocation Simulation
function renderStep5() {
  const item = state.latestConsent || dataStore.getConsents()[0];

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🛑 चरण 5: 'मेरी मर्ज़ी' रद्द करने का वास्तविक अभ्यास</span>
        </div>
        <span class="badge-status ${item.status === 'ACTIVE' ? 'active' : 'revoked'}">
          स्थिति: ${item.status === 'ACTIVE' ? 'सक्रिय (ACTIVE)' : 'सफलतापूर्वक रद्द (REVOKED)'}
        </span>
      </div>

      <div style="background: #fff7ed; padding: 1.25rem; border-radius: var(--radius-md); border: 1.5px solid #fed7aa; margin-bottom: 1.5rem;">
        <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">
          "नागरिक को यह विश्वास दिलाना जरूरी है कि वे सचमुच इस अनुमति को कभी भी रोक सकते हैं।"
        </h4>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          अक्सर मरीज डरते हैं कि अगर उन्होंने डॉक्टर से अपना डेटा वापस लिया, तो डॉक्टर नाराज हो जाएंगे या इलाज नहीं करेंगे।
          यहाँ नागरिक खुद अपने फोन से या आशा दीदी के माध्यम से अनुमति रद्द करके देख सकते हैं:
        </p>
      </div>

      <div class="grid-2" style="margin-bottom: 1.5rem;">
        <div style="border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: var(--radius-md); background: #ffffff;">
          <h5 style="font-size: 1rem; color: var(--navy-dark); margin-bottom: 0.5rem;">1. मिस्ड कॉल / USSD कोड</h5>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            बिना इंटरनेट वाले साधारण कीपैड फोन से <strong>*99*14477#</strong> डायल करें।
          </p>
          <button type="button" class="btn-secondary" id="btnSimulateUssd" style="width: 100%;">
            <span>📞 USSD डायल करें (*99*14477#)</span>
          </button>
        </div>

        <div style="border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: var(--radius-md); background: #ffffff;">
          <h5 style="font-size: 1rem; color: var(--navy-dark); margin-bottom: 0.5rem;">2. आशा दीदी 1-क्लिक रद्द प्रणाली</h5>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            नागरिक के अनुरोध पर आशा दीदी अपने ऐप से तुरंत एक्सेस समाप्त कर सकती हैं।
          </p>
          <button type="button" class="btn-revoke-action" id="btnSimulateAshaRevoke" style="width: 100%;">
            <span>🛑 सहमति तत्काल रद्द करें</span>
          </button>
        </div>
      </div>

      ${item.status === 'REVOKED' ? `
        <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; text-align: center;">
          <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">🎉</div>
          <h4 style="color: #047857; font-size: 1.25rem; margin-bottom: 0.3rem;">
            पुष्टि: डेटा एक्सेस तुरंत समाप्त हो गया है!
          </h4>
          <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 650px; margin: 0 auto;">
            डॉक्टर के कंप्यूटर से पर्चे और रिपोर्ट की अनुमति हट गई है। 
            <strong>अस्पताल में आपका इलाज और दवाएं पहले जैसी ही निःशुल्क जारी रहेंगी।</strong>
          </p>
          <div style="margin-top: 1rem;">
            <button type="button" class="btn-secondary" id="btnReactivateConsent">
              <span>🔄 फिर से अनुमति देकर देखें (Re-activate)</span>
            </button>
          </div>
        </div>
      ` : ''}

      <div class="action-buttons-row">
        <button type="button" class="btn-secondary" id="btnNewRegistration">
          <span>➕ नए नागरिक का पंजीकरण करें</span>
        </button>
        <button type="button" class="btn-primary" id="btnGoToPassbook">
          <span>📜 सभी नागरिकों की पासबुक देखें</span>
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
          <span>🗝️ डिजिटल तिजोरी की कहानी: स्वास्थ्य डेटा पर आपका अधिकार</span>
        </div>
        <button type="button" class="btn-secondary" id="btnNarrateWholeStory">
          <span>🔊 पूरी कहानी सुनें</span>
        </button>
      </div>

      <div class="tijori-showcase">
        <div class="tijori-image-box">
          <img src="/assets/tijori.jpg" alt="ABHA Digital Tijori Health Locker" />
        </div>
        <div>
          <h3 style="font-family: var(--font-heading); color: var(--navy-dark); font-size: 1.5rem; margin-bottom: 0.5rem;">
            "तिजोरी आपकी, चाभी आपके हाथ में"
          </h3>
          <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 1rem;">
            जैसे आप अपने गहने और जरूरी कागजात घर की तिजोरी में ताला लगाकर रखती हैं, ठीक वैसे ही आपका आयुष्मान भारत हेल्थ अकाउंट (ABHA) आपकी सेहत की तिजोरी है।
          </p>
          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); border-left: 4px solid var(--primary-saffron); font-size: 0.95rem;">
            <strong>मुख्य बात:</strong> कोई भी डॉक्टर, सरकार, या बैंक आपकी मर्जी के बिना यह तिजोरी नहीं खोल सकता। जब आप डॉक्टर को दिखाने जाती हैं, तो आप खुद उन्हें कुछ घंटों के लिए चाभी देती हैं।
          </div>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 1.5rem;">
        <div class="card" style="background: #ffffff; border-top: 4px solid #3b82f6;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">👨🏽‍⚕️</div>
          <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">स्तंभ 1: कौन देख सकता है?</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            केवल वही डॉक्टर या नर्स जिन्हें आप अभी इलाज के लिए दिखा रही हैं। कोई बैंक, बीमा एजेंट, या पड़ोसी इसे नहीं देख सकता।
          </p>
        </div>

        <div class="card" style="background: #ffffff; border-top: 4px solid #f59e0b;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏱️</div>
          <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">स्तंभ 2: कब तक देख सकते हैं?</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            यह अनुमति हमेशा सीमित समय (जैसे 24 या 48 घंटे) के लिए होती है। समय पूरा होते ही तिजोरी पर स्वतः ताला लग जाता है।
          </p>
        </div>

        <div class="card" style="background: #ffffff; border-top: 4px solid #10b981;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛡️</div>
          <h4 style="color: var(--navy-dark); font-size: 1.1rem; margin-bottom: 0.4rem;">स्तंभ 3: मेरी मर्ज़ी (रद्द करने का हक)</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            आप जब चाहें 1 मिस्ड कॉल से अनुमति रोक सकती हैं। अनुमति वापस लेने पर भी आपका सरकारी इलाज और दवाएं बिल्कुल नहीं रुकेंगी।
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
  const faqs = [
    {
      q: '1. "क्या मेरी बीमारी या गर्भवती होने की बात गाँव में किसी को पता चलेगी?"',
      a: 'आशा दीदी कहें: "बिल्कुल नहीं! यह डेटा 100% गोपनीय है। केवल वही डॉक्टर इसे कंप्यूटर पर देख सकते हैं जिन्हें आप इलाज के लिए परमिशन देंगी। पंचायत, पड़ोसी या रिश्तेदार इसे कभी नहीं देख सकते।',
      speak: 'बिल्कुल नहीं! यह डेटा सौ प्रतिशत गोपनीय है। केवल वही डॉक्टर इसे देख सकते हैं जिन्हें आप इलाज के लिए परमिशन देंगी।'
    },
    {
      q: '2. "अगर मैंने डॉक्टर को रिपोर्ट दिखाने से मना कर दिया, तो क्या वो मेरा इलाज बंद कर देंगे?"',
      a: 'आशा दीदी कहें: "कभी नहीं! सरकारी अस्पताल में इलाज पाना आपका कानूनी अधिकार है। अगर आप डिजिटल परमिशन नहीं भी देती हैं, तब भी डॉक्टर साहब आपको कागज के पर्चे पर देखकर पूरी दवाएं देंगे।',
      speak: 'कभी नहीं! सरकारी अस्पताल में इलाज पाना आपका कानूनी अधिकार है। परमिशन न देने पर भी आपका इलाज कभी नहीं रुकेगा।'
    },
    {
      q: '3. "क्या बैंक वाले मेरा यह डेटा देखकर मेरा कर्जा, पेंशन या राशन कार्ड काट सकते हैं?"',
      a: 'आशा दीदी कहें: "यह सबसे बड़ा भ्रम है! ABHA केवल स्वास्थ्य के लिए है। इसका बैंक, लोन, राशन कार्ड या पेंशन से कोई संबंध नहीं है। कोई सरकारी योजना प्रभावित नहीं होगी।',
      speak: 'यह भ्रम है! ABHA केवल स्वास्थ्य के लिए है। इसका बैंक, लोन, राशन कार्ड या पेंशन से कोई संबंध नहीं है।'
    },
    {
      q: '4. "अगर मेरे पास स्मार्टफ़ोन न हो या फोन खो जाए, तो मैं परमिशन कैसे बंद करूँ?"',
      a: 'आशा दीदी कहें: "आपको स्मार्टफोन की जरूरत ही नहीं है। आप किसी भी साधारण कीपैड फोन से टोल-फ्री 14477 पर कॉल कर सकती हैं, या मुझे बता सकती हैं। मैं 1 मिनट में इसे बंद कर दूँगी।',
      speak: 'स्मार्टफोन की जरूरत नहीं है। आप साधारण कीपैड फोन से टोल-फ्री 14477 पर कॉल करके इसे तुरंत बंद कर सकती हैं।'
    },
    {
      q: '5. "क्या मेरे परिवार वाले या ससुराल वाले मेरी महिला जांच रिपोर्ट बिना मेरी मर्जी देख सकते हैं?"',
      a: 'आशा दीदी कहें: "नहीं! ABHA व्यक्तिगत होता है। आपकी सोनोग्राफी या महिला स्वास्थ्य की रिपोर्ट केवल आपकी अनुमति से ही देखी जा सकती है।',
      speak: 'नहीं! ABHA व्यक्तिगत होता है। आपकी सोनोग्राफी या महिला स्वास्थ्य की रिपोर्ट केवल आपकी अनुमति से ही देखी जा सकती है।'
    },
    {
      q: '6. "आशा कार्यकर्ता को क्या सम्मान व प्रोत्साहन मिलता है?"',
      a: 'हमारा सिस्टम सिर्फ गिनती नहीं देखता। जब आशा दीदी मरीज को पूरी बात समझाकर उनके अपने शब्दों में सहमति दर्ज कराती हैं, तो उन्हें अतिरिक्त गरिमा बोनस (Quality Dignity Credits) मिलता है।',
      speak: 'जब आशा दीदी मरीज को पूरी बात समझाकर उनके अपने शब्दों में सहमति दर्ज कराती हैं, तो उन्हें अतिरिक्त गरिमा बोनस मिलता है।'
    }
  ];

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>🩺 आशा दीदी शंका निवारण टूलकिट (Field Doubt-Buster)</span>
        </div>
        <span class="status-chip">फील्ड में उपयोग हेतु</span>
      </div>

      <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
        ग्रामीण क्षेत्रों में नागरिक अक्सर डर या झिझक के कारण सवाल नहीं पूछ पाते। नीचे दिए गए कार्ड्स पर क्लिक करके आप उन्हें सीधे सही बात बोलकर सुना सकती हैं:
      </p>

      <div class="grid-2">
        ${faqs.map((f, i) => `
          <div class="card" style="background: #ffffff; border: 1.5px solid var(--border-subtle);">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem;">
              <h4 style="font-size: 1rem; color: var(--navy-dark); font-weight: 700;">${f.q}</h4>
              <button type="button" class="btn-secondary btn-mini-speak-custom" data-text="${f.speak}" style="padding: 0.25rem 0.6rem; font-size: 0.78rem; white-space: nowrap;">
                <span>🔊 सुनाएं</span>
              </button>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; background: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary-saffron);">
              ${f.a}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 4. PASSBOOK TAB: Citizen Consent Passbook
// --------------------------------------------------------------------------
function renderPassbookTab() {
  const allConsents = dataStore.getConsents();
  const filtered = state.passbookFilter === 'ALL' 
    ? allConsents 
    : allConsents.filter(c => c.status === state.passbookFilter);

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <span>📜 नागरिक स्वास्थ्य सहमति पासबुक (Citizen Consent Passbook)</span>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn-secondary ${state.passbookFilter === 'ALL' ? 'active' : ''}" id="filterAll" style="font-size: 0.8rem; padding: 0.3rem 0.7rem;">सभी (${allConsents.length})</button>
          <button type="button" class="btn-secondary ${state.passbookFilter === 'ACTIVE' ? 'active' : ''}" id="filterActive" style="font-size: 0.8rem; padding: 0.3rem 0.7rem;">सक्रिय (${allConsents.filter(c => c.status === 'ACTIVE').length})</button>
          <button type="button" class="btn-secondary ${state.passbookFilter === 'REVOKED' ? 'active' : ''}" id="filterRevoked" style="font-size: 0.8rem; padding: 0.3rem 0.7rem;">रद्द (${allConsents.filter(c => c.status === 'REVOKED').length})</button>
        </div>
      </div>

      <div class="passbook-table-wrap">
        <table class="passbook-table">
          <thead>
            <tr>
              <th>नागरिक</th>
              <th>ABHA आईडी</th>
              <th>सहमति आईडी</th>
              <th>समझ स्कोर</th>
              <th>स्थिति</th>
              <th>वैधता / निरस्तीकरण</th>
              <th>कार्यवाही</th>
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
                    ${c.status === 'ACTIVE' ? 'सक्रिय' : 'रद्द'}
                  </span>
                </td>
                <td style="font-size: 0.82rem;">
                  ${c.status === 'ACTIVE' ? `वैध: ${c.validUntil}` : `<span style="color: #ef4444;">रद्द: ${c.revokedDate || 'तत्काल'}</span>`}
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button type="button" class="btn-secondary btn-view-patra" data-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                      📄 सम्मान पत्र
                    </button>
                    ${c.status === 'ACTIVE' ? `
                      <button type="button" class="btn-revoke-action btn-table-revoke" data-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                        🛑 रद्द करें
                      </button>
                    ` : `
                      <button type="button" class="btn-secondary btn-table-restore" data-id="${c.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; color: #047857;">
                        🔄 पुनः सक्रिय
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
  const stats = dataStore.getStats();

  return `
    <div>
      <!-- Dignity KPI Grid -->
      <div class="dignity-dashboard-grid">
        <div class="stat-kpi-card" style="border-top: 4px solid var(--primary-saffron);">
          <div class="kpi-icon">🛡️</div>
          <div class="kpi-value">${stats.totalConsents}</div>
          <div class="kpi-label">कुल सत्यापित सहमति कार्ड</div>
        </div>

        <div class="stat-kpi-card" style="border-top: 4px solid var(--primary-emerald);">
          <div class="kpi-icon">🎯</div>
          <div class="kpi-value">${stats.trueComprehensionRate}%</div>
          <div class="kpi-label">वास्तविक समझ दर (Teach-Back)</div>
        </div>

        <div class="stat-kpi-card" style="border-top: 4px solid #ef4444;">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-value">${stats.blindYesPrevented}</div>
          <div class="kpi-label">सिर्फ "हाँ" कहने से रोका गया</div>
        </div>

        <div class="stat-kpi-card" style="border-top: 4px solid #8b5cf6;">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">₹${stats.ashaHonorariumBonus}</div>
          <div class="kpi-label">आशा गरिमा मानदेय प्रोत्साहन</div>
        </div>
      </div>

      <!-- Principles & System Architecture Card -->
      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom: 0.8rem;">
            <span>⚖️ मुख्य सिद्धांत: व्यवस्था को सशक्त बनाएं; लोगों की रक्षा करें</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            स्वास्थ्य डेटा सहमति को अक्सर एक कागजी खानापूर्ति (Tick-Box exercise) बना दिया जाता है। 
            <strong>"मेरी मर्ज़ी"</strong> इस व्यवस्था को बदलता है:
          </p>
          <ul style="padding-left: 1.2rem; color: var(--navy-slate); font-size: 0.9rem; line-height: 1.7;">
            <li><strong>आशा दीदी को गुणवत्ता का मानदेय:</strong> तेज गति में सिर्फ "हाँ" दर्ज करने के बजाय, मरीज को समझाकर उनके शब्दों में रिकॉर्ड कराने पर अधिक अंक।</li>
            <li><strong>डेटा गरिमा (Data Dignity):</strong> ग्रामीण नागरिकों को स्पष्ट पता होता है कि कौन देख रहा है और कैसे 1 मिस्ड कॉल से कभी भी रोका जा सकता है।</li>
            <li><strong>इलाज की निरंतरता:</strong> सहमति रद्द करने पर भी किसी का इलाज, राशन या पेंशन कभी नहीं रुक सकती।</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-title" style="margin-bottom: 0.8rem;">
            <span>📡 स्थानीय ऑफलाइन सिंक व तकनीक विवरण</span>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
              <span>स्थानिक डेटाबेस (Storage):</span>
              <strong style="color: var(--navy-dark);">IndexedDB / LocalStorage (100% Offline)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
              <span>वाक् पहचान (Speech Engine):</span>
              <strong style="color: var(--navy-dark);">Web Speech API + Indian Language Lexicon</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle);">
              <span>ABDM मानक अनुरूपता:</span>
              <strong style="color: #047857;">ABDM Consent Manager Artifact v0.5</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
              <span>डेटा सुरक्षा कानून:</span>
              <strong style="color: var(--navy-dark);">DPDP Act 2023 Sec 6 (Informed Consent)</strong>
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

  // Tab Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audioEngine.playClickSound();
      audioEngine.stop();
      state.activeTab = btn.dataset.tab;
      renderApp();
    });
  });

  // Language Selector
  const langSelector = document.querySelector('#langSelector');
  if (langSelector) {
    langSelector.addEventListener('change', (e) => {
      audioEngine.playClickSound();
      state.currentLang = e.target.value;
      speechManager.setLanguage(LANGUAGES[state.currentLang].voiceLang);
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
      if (p === 'sunita') {
        state.citizenForm = {
          name: 'सुनीता देवी', age: 32, gender: 'महिला', village: 'सतरिख, बाराबंकी (उ.प्र.)',
          abhaId: '91-4821-3390-1204', healthContext: 'गर्भावस्था जांच (ANC Care) व खून की जांच', durationHours: 48, avatar: '👩🏽'
        };
      } else if (p === 'ramu') {
        state.citizenForm = {
          name: 'रामू काका', age: 62, gender: 'पुरुष', village: 'मिल्कीपुर, अयोध्या (उ.प्र.)',
          abhaId: '91-3312-9901-4456', healthContext: 'शुगर (डायबिटीज) व पुरानी खांसी का इलाज', durationHours: 48, avatar: '👴🏽'
        };
      } else if (p === 'pooja') {
        state.citizenForm = {
          name: 'पूजा कुमारी', age: 21, gender: 'महिला', village: 'मोहद्दीपुर, गोरखपुर (उ.प्र.)',
          abhaId: '91-8819-0211-9982', healthContext: 'एनीमिया परामर्श व पोषण सप्लीमेंट्स', durationHours: 48, avatar: '👩🏻'
        };
      } else if (p === 'manoj') {
        state.citizenForm = {
          name: 'मनोज यादव', age: 39, gender: 'पुरुष', village: 'बस्ती सदर, बस्ती (उ.प्र.)',
          abhaId: '91-5501-7723-8812', healthContext: 'चोट व हड्डी का एक्सरे परामर्श', durationHours: 48, avatar: '👨🏽'
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
      // Auto-narrate intro in step 2
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
        state.spokenText = item.text;
        state.activeSamplePresetId = item.id;
        state.evaluationResult = comprehensionEngine.evaluate(item.text, state.currentLang);

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

      // Play chime and launch celebratory confetti!
      audioEngine.playSuccessChime();
      launchConfetti();

      // Save into Data Store
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
        audioEngine.speak(text, 'hi-IN');
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
        dataStore.revokeConsent(item.consentId, 'USSD *99*14477# द्वारा रद्द किया गया');
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
        dataStore.revokeConsent(item.consentId, 'आशा कार्यकर्ता द्वारा नागरिक के कहने पर रद्द किया गया');
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
    // Interim transcript
    (interim) => {
      const display = document.querySelector('#spokenTranscriptArea');
      if (display) {
        display.innerHTML = `<em>"${interim}..."</em>`;
      }
    },
    // Final transcript
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
    // Error
    (err) => {
      console.warn('Speech recognition error:', err);
      state.isRecording = false;
      const statusText = document.querySelector('#micStatusText');
      if (statusText) {
        statusText.innerText = 'माइक सक्रिय नहीं हो सका। कृपया ऊपर दिए गए उदाहरण उत्तरों पर क्लिक करें।';
      }
    },
    // Start
    () => {
      renderApp();
    },
    // End
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
  const modal = document.querySelector('#sammanPatraModal');
  const body = document.querySelector('#modalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <span style="font-size: 2rem;">📜</span>
      <h3 style="color: var(--navy-dark); font-family: var(--font-heading);">${item.name} का डेटा सम्मान पत्र</h3>
      <span class="badge-status ${item.status === 'ACTIVE' ? 'active' : 'revoked'}">
        स्थिति: ${item.status === 'ACTIVE' ? 'सक्रिय (ACTIVE)' : 'रद्द (REVOKED)'}
      </span>
    </div>

    <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
      <div><strong>ABHA आईडी:</strong> ${item.abhaId}</div>
      <div><strong>सहमति आईडी:</strong> ${item.consentId}</div>
      <div><strong>नागरिक समझ स्कोर:</strong> ${item.dignityScore}% Verified</div>
      <div><strong>गाँव:</strong> ${item.village}</div>
      <div><strong>वैधता:</strong> ${item.validUntil}</div>
    </div>

    <div style="background: #fff7ed; padding: 0.85rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary-saffron); font-size: 0.88rem; margin-bottom: 1.25rem;">
      <strong>नागरिक द्वारा समझाया गया:</strong><br/>
      <em>"${item.voiceSnippetText}"</em>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button type="button" class="btn-secondary" onclick="window.print()">🖨️ प्रिंट</button>
      <button type="button" class="btn-primary" onclick="document.querySelector('#sammanPatraModal').close()">बंद करें</button>
    </div>
  `;

  modal.showModal();
}

// Subscribe DataStore changes to auto-update UI
dataStore.subscribe(() => {
  // Can re-render if on passbook or dashboard
  if (state.activeTab === 'passbook' || state.activeTab === 'dashboard') {
    renderApp();
  }
});

// Initial Launch
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

// Also immediately render if DOM already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderApp();
}
