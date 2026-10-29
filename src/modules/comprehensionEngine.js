// Intelligent Comprehension Engine & Dignity Compass
// Evaluates citizen's own words against the 3 ABDM Data Dignity Pillars
// Detects "Blind Yes", Identifies Misconceptions, and Generates ASHA Dialogue Prompts

export const SAMPLE_RESPONSES = [
  {
    id: 'full_understanding',
    title: '✅ पूर्ण समझ (Full Informed Consent - 100%)',
    category: 'verified',
    speaker: 'सुनीता देवी (32 वर्ष, गर्भवती, बाराबंकी)',
    text: 'डॉक्टर साहब को सिर्फ मेरी इस बीमारी का पर्चा और जांच 2 दिन दिखेगी। और मेरी मर्ज़ी है, मैं जब चाहूँ फोन से मना या रद्द कर सकती हूँ, मेरा इलाज नहीं रुकेगा।'
  },
  {
    id: 'blind_yes',
    title: '⚠️ सिर्फ "हाँ" (The Blind Yes Trap - 20%)',
    category: 'blind_yes',
    speaker: 'रमेश कुमार (48 वर्ष, किसान, सुल्तानपुर)',
    text: 'हाँ ठीक है दीदी, जो सही लगे कर दीजिए, कार्ड बना दीजिए।'
  },
  {
    id: 'misconception_ration',
    title: '❌ भ्रम: राशन व पेंशन का डर (Fear of Benefit Denial - 35%)',
    category: 'misconception',
    speaker: 'रामू काका (62 वर्ष, बुजुर्ग, अयोध्या)',
    text: 'अगर मैंने डॉक्टर को देखने से मना कर दिया या बाद में बंद कराया, तो क्या सरकार मेरा राशन कार्ड काट देगी या पेंशन रोक लेगी?'
  },
  {
    id: 'misconception_bank',
    title: '❌ भ्रम: बैंक व कंपनी का डर (Fear of Third-Party Leak - 30%)',
    category: 'misconception',
    speaker: 'पूजा कुमारी (22 वर्ष, छात्रा, बस्ती)',
    text: 'क्या यह बीमारी का रिकॉर्ड बैंक वाले या बीमा कंपनी वाले भी देख लेंगे?'
  },
  {
    id: 'partial_scope_only',
    title: '🟡 आंशिक समझ: सिर्फ डॉक्टर का पता (Partial Scope - 55%)',
    category: 'partial',
    speaker: 'मनोज यादव (39 वर्ष, ऑटो चालक, गोरखपुर)',
    text: 'डॉक्टर साहब मेरा खून का रिपोर्ट और पर्चा अपने कंप्यूटर में देखेंगे।'
  }
];

export class ComprehensionEngine {
  constructor() {
    // Keywords dictionary for multiple dialects & languages
    this.lexicon = {
      blindYesWords: [
        'haan', 'ha', 'yes', 'theek hai', 'thik hai', 'ok', 'okay', 'theek ba',
        'haanji', 'bana do', 'bana dijiye', 'bana dyo', 'sahamat', 'agree', 'sahi hai',
        'हाँ', 'हां', 'ठीक है', 'ठीक बा', 'हाँजी', 'बना दीजिए', 'कर दो', 'हो', 'சரி', 'అవును', 'হ্যাঁ'
      ],
      pillar1: {
        // Scope & Recipient (Who & What)
        keywords: [
          'doctor', 'hospital', 'clinic', 'chikitsak', 'ilaaj', 'dawa', 'parcha', 'report',
          'blood', 'test', 'bimari', 'kisi aur ko nahi', 'bank nahi', 'company nahi',
          'डॉक्टर', 'डाक्टर', 'अस्पताल', 'अस्पताल', 'चिकित्सक', 'इलाज', 'दवा', 'पर्चा', 'रिपोर्ट',
          'जांच', 'खून', 'बीमारी', 'सिर्फ डॉक्टर', 'दवाई', 'दावा', 'வைத்தியர்', 'மருத்துவர்',
          'డాక్టర్', 'వైద్యుడు', 'ডাক্তার', 'হাসপাতাল'
        ],
        weight: 35
      },
      pillar2: {
        // Duration & Time Limit (When & How Long)
        keywords: [
          'din', 'ghante', 'samay', 'waqt', 'seemit', '2 din', '48 ghante', 'ilaaj tak',
          'limited', 'duration', 'hours', 'days', 'kuch din', 'jab tak', 'sirf consult',
          'दिन', 'घंटे', 'समय', 'वक़्त', 'सीमित', '2 दिन', '48 घंटे', 'इलाज तक',
          'कुछ दिन', 'जब तक', 'सिर्फ इलाज', 'தற்காலிக', 'நாட்கள்', 'రోజులు', 'గంటలు',
          'সীমিত', 'সময়', 'দিন'
        ],
        weight: 30
      },
      pillar3: {
        // Right to Revoke & No Treatment Denial ('Meri Marzi')
        keywords: [
          'meri marzi', 'marzi', 'radd', 'band', 'rok', 'wapas', 'mana', 'cancel', 'stop',
          'withdraw', 'revoke', 'phone se', 'missed call', 'asha didi', 'nahi rukega', 'haq',
          'roka nahi jayega', 'right', 'choice', 'chabhi wapas', 'roki', 'hata',
          'मेरी मर्ज़ी', 'मर्ज़ी', 'रद्द', 'बंद', 'रोक', 'वापस', 'मना', 'कैंसिल',
          'फोन से', 'मिस्ड कॉल', 'इलाज नहीं रुकेगा', 'नहीं रुकेगा', 'चाभी वापस',
          'हक', 'अधिकार', 'रத்து', 'ரద్దు', 'నా ఇష్టం', 'বাতিল', 'আমার ইচ্ছা'
        ],
        weight: 35
      },
      misconceptions: [
        {
          id: 'ration_pension',
          triggers: ['ration', 'pension', 'sarkari suvidha', 'card kat', 'राशन', 'पेंशन', 'कार्ड कट', 'राशन कार्ड', 'सरकारी सुविधा'],
          messageHi: 'नागरिक को डर है कि अनुमति न देने या रद्द करने पर राशन/पेंशन कट जाएगी।',
          clarificationHi: 'आशा दीदी कहें: "रामू काका, बेफिक्र रहिए! ABHA पूरी तरह आपकी मर्ज़ी है। अनुमति रोकें या न दें, आपका राशन, पेंशन और सरकारी इलाज बिल्कुल पहले जैसा ही चलता रहेगा। कोई एक पैसा भी नहीं कटेगा।"'
        },
        {
          id: 'bank_company',
          triggers: ['bank', 'loan', 'bima', 'insurance', 'paisa', 'खाता', 'बैंक', 'लोन', 'बीमा', 'कंपनी', 'पैसा'],
          messageHi: 'नागरिक को डर है कि बैंक, बीमा या बाहरी कंपनियां उनका स्वास्थ्य डेटा देख लेंगी।',
          clarificationHi: 'आशा दीदी कहें: "पूजा जी, यह डिजिटल तिजोरी केवल स्वास्थ्य इलाज के लिए है। किसी भी बैंक, पुलिस या कंपनी का इस तिजोरी से कोई लेना-देना नहीं है। कोई इसे छू भी नहीं सकता।"'
        },
        {
          id: 'permanent_lock',
          triggers: ['hamesha', 'zindagi bhar', 'permanent', 'hamesha ke liye', 'हमेशा', 'जिंदगी भर', 'सदा के लिए'],
          messageHi: 'नागरिक सोच रहे हैं कि यह अनुमति हमेशा के लिए लॉक हो गई है।',
          clarificationHi: 'आशा दीदी कहें: "यह हमेशा के लिए नहीं है! यह सिर्फ अभी के 2 दिन के लिए है और आप 1 बटन दबाकर इसे तुरंत समाप्त कर सकती हैं।"'
        }
      ]
    };
  }

  evaluate(text, lang = 'hi') {
    if (!text || text.trim().length === 0) {
      return {
        score: 0,
        isBlindYes: false,
        isVerified: false,
        misconceptions: [],
        p1Status: false,
        p2Status: false,
        p3Status: false,
        matchedKeywords: [],
        ashaCoachTip: 'नागरिक से कहें: "दीदी/भैया, बताइए डॉक्टर साहब क्या देखेंगे और क्या आप इसे कभी भी रोक सकते हैं?"',
        summaryBadge: 'खाली'
      };
    }

    const clean = text.toLowerCase().trim();
    const words = clean.split(/\s+/);

    // 1. Check for Blind Yes
    // If text is very short (under 7 words) and consists essentially of agreement terms
    let isBlindYes = false;
    if (words.length <= 6) {
      const matchCount = this.lexicon.blindYesWords.filter(w => clean.includes(w)).length;
      if (matchCount > 0 && !clean.includes('doctor') && !clean.includes('डॉक्टर') && !clean.includes('रद्द') && !clean.includes('दिन')) {
        isBlindYes = true;
      }
    }

    // 2. Check Pillars
    const p1Matches = this.lexicon.pillar1.keywords.filter(kw => clean.includes(kw));
    const p2Matches = this.lexicon.pillar2.keywords.filter(kw => clean.includes(kw));
    const p3Matches = this.lexicon.pillar3.keywords.filter(kw => clean.includes(kw));

    const p1Status = p1Matches.length > 0;
    const p2Status = p2Matches.length > 0;
    const p3Status = p3Matches.length > 0;

    // 3. Detect Misconceptions
    const detectedMisconceptions = [];
    for (const misc of this.lexicon.misconceptions) {
      const hit = misc.triggers.some(t => clean.includes(t));
      if (hit) {
        detectedMisconceptions.push(misc);
      }
    }

    // 4. Calculate Score
    let score = 0;
    if (isBlindYes) {
      score = 20; // Nominal score for saying yes, but insufficient for consent
    } else {
      if (p1Status) score += this.lexicon.pillar1.weight;
      if (p2Status) score += this.lexicon.pillar2.weight;
      if (p3Status) score += this.lexicon.pillar3.weight;

      // Bonus if citizen specifically affirms no treatment denial
      if (clean.includes('ilaaj nahi') || clean.includes('इलाज नहीं') || clean.includes('इलाज चालू') || clean.includes('हक')) {
        score = Math.min(100, score + 10);
      }
    }

    const isVerified = score >= 75 && p3Status; // Pillar 3 (Right to Revoke) is MANDATORY for true Meri Marzi dignity

    // 5. Generate Dynamic ASHA Coach Tip
    let ashaCoachTip = '';
    let summaryBadge = '';

    if (isBlindYes) {
      summaryBadge = '⚠️ सिर्फ "हाँ" (अस्वीकार्य)';
      ashaCoachTip = 'आशा दीदी कहें: "सिर्फ हाँ मत कहिए! मुझे अपनी भाषा में बताइए कि आप क्या समझीं—डॉक्टर साहब क्या देखेंगे, और क्या आप इसे बीच में बंद कर सकती हैं?"';
    } else if (detectedMisconceptions.length > 0) {
      summaryBadge = '❌ भ्रम पकड़ा गया';
      ashaCoachTip = detectedMisconceptions[0].clarificationHi;
    } else if (!p3Status && p1Status) {
      summaryBadge = '🟡 अधूरा: रद्द करने का हक छूट गया';
      ashaCoachTip = 'आशा दीदी कहें: "बहुत अच्छे! आपने डॉक्टर और रिपोर्ट का समझा दिया। अब बताइए कि अगर बाद में आपका मन बदल जाए, तो क्या आप इसे रोक सकती हैं?"';
    } else if (!p1Status && p3Status) {
      summaryBadge = '🟡 अधूरा: डॉक्टर/डेटा सीमा छूट गई';
      ashaCoachTip = 'आशा दीदी कहें: "यह बताइए कि इस तिजोरी के अंदर कौन से कागज डॉक्टर देखेंगे और कौन इसे बिल्कुल नहीं देख सकता?"';
    } else if (isVerified) {
      summaryBadge = '✅ पूर्ण गरिमापूर्ण समझ (100% Verified)';
      ashaCoachTip = 'शाबाश! नागरिक ने अपने शब्दों में तीनों अधिकार समझा दिए हैं। अब आप नीचे बटन दबाकर सम्मान पत्र जारी कर सकती हैं।';
    } else {
      summaryBadge = '🟡 आंशिक समझ';
      ashaCoachTip = 'आशा दीदी कहें: "कृप्या तीनों बातें बताइए: 1. कौन देखेगा? 2. कब तक? और 3. क्या आप कभी भी रद्द कर सकती हैं?"';
    }

    return {
      score,
      isBlindYes,
      isVerified,
      p1Status,
      p2Status,
      p3Status,
      p1Matches,
      p2Matches,
      p3Matches,
      misconceptions: detectedMisconceptions,
      ashaCoachTip,
      summaryBadge
    };
  }
}

export const comprehensionEngine = new ComprehensionEngine();
