# 🛡️ मेरी मर्ज़ी (Meri Marzi) — Understand Health-Data Permission
> **Track:** Sahayak & Samman Bharat  
> **Theme:** Frontline Workers and Data Dignity (ABDM / Ayushman Bharat)  
> **Problem Statement (PS 2.4):** When people sign up for an ABHA (Ayushman Bharat Health Account), they may not understand who can use their health data or how to cancel permission later. Saying “yes” does not prove they understand. Help them explain the choice in their own words before recording permission.  
> **Core Principle:** *Strengthen the system; protect the people in it.*

---

## 🌟 Overview & Innovation

In traditional digital consent workflows, citizens often nod or utter a passive *"Haan / Yes"* without understanding what happens to their medical records or fearing that refusal will cancel their government rations, pensions, or healthcare. 

**मेरी मर्ज़ी (Meri Marzi)** is a spoken audio-visual consent companion designed specifically for **ASHA frontline community health workers** during ABHA signup. It introduces the **Teach-Back Method ("अपनी भाषा में समझाएं")**:
- **Before saving consent, the person must explain in their own words what they are agreeing to.**
- The application's on-device **Dignity Compass Engine** evaluates whether the citizen truly grasps the **3 Critical Pillars of Health Data Dignity**:
  1. **डेटा व डॉक्टर सीमा (Data Scope & Recipient):** Only authorized doctors treating them can view specific records (no banks, employers, or third parties).
  2. **समय सीमा (Duration & Purpose):** Access is strictly time-bound (e.g. 24–48 hours) and expires automatically.
  3. **मेरी मर्ज़ी व रद्द करने का अधिकार (Right to Revoke):** Citizens hold the digital master key. They can revoke consent anytime via missed call, SMS, or ASHA app **without any interruption to their healthcare or government benefits**.

---

## 🚀 Key Features

### 1. 📢 Multilingual Spoken Guide (बोलने वाला सहायक)
- Speaks aloud in **8 Indian languages and dialects**: Hindi (हिंदी), Hinglish (हिंग्लिश), English, Bhojpuri (भोजपुरी), Marathi (मराठी), Bengali (বাংলা), Tamil (தமிழ்), and Telugu (తెలుగు).
- Adjustable voice speeds (0.8x for elderly, 1.0x normal, 1.2x).
- Dynamic real-time HTML5 canvas audio waveform visualizer.
- 100% offline-ready with zero external audio dependencies (Web Speech Synthesis + Web Audio API synthesizer).

### 2. 🗝️ The "डिजिटल तिजोरी" (Health Locker) Metaphor
- Breaks down complex ABDM consent architectures into culturally intuitive village analogies:
  - **Tijori (Safe):** Citizen's ABHA account with lab reports and prescriptions.
  - **The Key (चाभी):** Held solely by the citizen.
  - **Doctor Consultation:** Loaning the key for 48 hours.
  - **Revocation:** Taking the key back without any loss of government entitlements.

### 3. 🎙️ Teach-Back Verification ("अपनी भाषा में समझाएं")
- Live speech-to-text input with microphone recording.
- **Blind "Yes" Trap Detection:** Flags passive compliance (*"हाँ ठीक है, बना दो"*) as incomplete (score: 20%) and keeps the consent save button locked.
- **Misconception Detection:** Catches fears such as *"Will this cancel my ration card?"* or *"Will banks see my loan records?"* and provides immediate ASHA dialogue prompts.
- **Live 3-Pillar Verification:** Unlocks the golden consent registration button only when the citizen explains all 3 privacy pillars in their own words.
- Includes authentic rural voice presets for testing and demonstration (Sunita Devi, Ramu Kaka, Pooja Kumari, Manoj Yadav).

### 4. 📜 "मेरी मर्ज़ी स्वास्थ्य-डेटा सम्मान पत्र" (Citizen Dignity Pass)
- ABDM-compliant Consent Artifact (`ABDM-CONSENT-YYYY-XXXX`).
- Embedded **Voice Proof Snippet:** Clickable audio player to replay the citizen's own explanation.
- Tamper-evident cryptographic hash simulation.
- Printable/downloadable format for ASHA workers to hand to citizens.

### 5. 🛑 1-Click Revocation Simulator
- Interactive simulator allowing citizens and ASHA workers to test revoking consent right in the field:
  - Dial USSD: `*99*14477#`
  - SMS: `ROK <ConsentID> to 56767`
  - ASHA 1-Click Revocation.
- Reassuring confirmation: **"पुष्टि: डेटा एक्सेस तुरंत समाप्त हो गया है! अस्पताल में आपका इलाज एवं दवाएं पहले जैसी ही निःशुल्क जारी रहेंगी।"**

### 6. 🩺 ASHA Doubt-Buster Toolkit
- 6 interactive audio flashcards addressing village anxieties (privacy of pregnancy/gynecology records, fear of doctors refusing treatment, phone loss, family privacy).

### 7. 📊 ASHA Dignity & Quality Audit Dashboard
- Shifts incentives from coercive speed to verified understanding:
  - **Quality Dignity Credits (+50 pts)** awarded for teach-back completion.
  - Tracks **Blind "Yes" Consents Prevented** and **True Comprehension Rate (97.6%)**.
  - Honorarium bonus calculation for frontline workers.

---

## 🛠️ Technology Stack & Compliance

- **Framework:** Vanilla JavaScript with Vite (ESNext)
- **Styling:** Vanilla CSS with custom design system, glassmorphism, fluid typography (`Outfit`, `Noto Sans Devanagari`, `Inter`), high-contrast accessible tap targets (≥48px), and print stylesheets.
- **Web APIs:**
  - `SpeechSynthesis` & `SpeechRecognition`
  - `Web Audio API` (OscillatorSynthesizers for chimes and auditory feedback)
  - HTML5 Canvas dynamic audio waveform rendering
  - Modern Web `<dialog>` with backdrop filter
  - `localStorage` / `IndexedDB` offline store
- **Standards:** ABDM Consent Manager v0.5 & Digital Personal Data Protection (DPDP) Act 2023 Sec 6(1).

---

## 🏃 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173/
```

### Production Build
```bash
npm run build
```

---

## 👥 Persona Walkthrough Scenarios

| Persona | Context | Teach-Back Response | System Evaluation |
|---|---|---|---|
| **Sunita Devi** (32y, Pregnant, Barabanki) | ANC checkup | *"डॉक्टर साहब को सिर्फ मेरी बीमारी का पर्चा 2 दिन दिखेगा। मेरी मर्जी से कभी भी रोक सकती हूँ, इलाज नहीं रुकेगा।"* | **✅ 100% Verified** (All 3 pillars passed, consent certificate unlocked) |
| **Ramesh Kumar** (48y, Farmer, Sultanpur) | General checkup | *"हाँ ठीक है दीदी, कार्ड बना दीजिए।"* | **⚠️ 20% Blind Yes Warning** (Consent locked, ASHA prompted to ask for own words) |
| **Ramu Kaka** (62y, Elder, Ayodhya) | Diabetes test | *"क्या मेरा राशन कार्ड कट जाएगा अगर मैंने मना किया?"* | **❌ 35% Misconception Flag** (ASHA prompt provided to reassure zero effect on benefits) |

---

*Project created for Hackathon Problem Statement 2.4 — Meri Marzi (Track: Sahayak & Samman Bharat).*
