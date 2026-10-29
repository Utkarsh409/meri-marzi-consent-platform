// Intelligent Comprehension Engine & Dignity Compass
// Evaluates citizen's own words against the 3 ABDM Data Dignity Pillars
// Detects "Blind Yes", Identifies Misconceptions, and Generates ASHA Dialogue Prompts

export const SAMPLE_RESPONSES = [
  {
    id: 'full_understanding',
    title: {
      hi: '✅ पूर्ण समझ (Full Informed Consent - 100%)',
      en: '✅ Full Understanding (100% Informed Consent)',
      hinglish: '✅ Poori Samajh (100% Informed Consent)',
      bhojpuri: '✅ पूरा समझ (100% सहमति)',
      mr: '✅ पूर्ण समज (१००% संमती)',
      bn: '✅ সম্পূর্ণ বোধগম্যতা (১০০% সম্মতি)',
      ta: '✅ முழுமையான புரிதல் (100% ஒப்புதல்)',
      te: '✅ పూర్తి అవగాహన (100% సమ్మతి)'
    },
    category: 'verified',
    speaker: {
      hi: 'सुनीता देवी (32 वर्ष, गर्भवती, बाराबंकी)',
      en: 'Sunita Devi (32y, Pregnant Mother, Barabanki)',
      hinglish: 'Sunita Devi (32y, Pregnant, Barabanki)',
      bhojpuri: 'सुनीता देवी (32 बरिस, गर्भवती, बाराबंकी)',
      mr: 'सुनीता देवी (३२ वर्षे, गरोदर, बाराबंकी)',
      bn: 'সুনীতা দেবী (৩২ বছর, গর্ভবতী, বারাবাঁকি)',
      ta: 'சுனிதா தேவி (32 வயது, கர்ப்பிணி, பாராபங்கி)',
      te: 'సునీత దేవి (32 సం, గర్భిణి, బారాబంకి)'
    },
    text: {
      hi: 'डॉक्टर साहब को सिर्फ मेरी इस बीमारी का पर्चा और जांच 2 दिन दिखेगी। और मेरी मर्ज़ी है, मैं जब चाहूँ फोन से मना या रद्द कर सकती हूँ, मेरा इलाज नहीं रुकेगा।',
      en: 'The doctor will only see my prescription and tests for this illness for 2 days. It is my choice—I can cancel anytime by phone, and my treatment will not stop.',
      hinglish: 'Doctor sahab ko sirf meri is bimari ka parcha aur reports 2 din dikhegi. Aur meri marzi hai, main jab chahun phone se cancel kar sakti hun, mera ilaj nahi rukega.',
      bhojpuri: 'डाक्टर साहब के खाली 2 दिन रिपोर्ट दिखी। अउर हमार मर्ज़ी बा, हम कबो फोन से रोक सकत बानी, इलाज ना रुकी।',
      mr: 'डॉक्टरांना फक्त २ दिवस माझे अहवाल दिसतील. माझी मर्जी आहे, मी कधीही फोनवरून रद्द करू शकते, उपचार थांबणार नाही.',
      bn: 'ডাক্তারবাবু শুধু ২ দিন আমার রিপোর্ট দেখতে পাবেন। আমার ইচ্ছা হলে আমি যেকোনো সময় বাতিল করতে পারি, চিকিৎসা থামবে না।',
      ta: 'மருத்துவர் 2 நாட்களுக்கு மட்டுமே பார்ப்பார். என் விருப்பப்படி எப்போது வேண்டுமானாலும் ரத்து செய்யலாம், சிகிச்சை நிற்காது.',
      te: 'డాక్టర్‌కు 2 రోజులు మాత్రమే రిపోర్టులు కనిపిస్తాయి. నా ఇష్టం, నేను ఎప్పుడైనా ఫోన్ ద్వారా రద్దు చేయవచ్చు, వైద్యం ఆగదు.'
    }
  },
  {
    id: 'blind_yes',
    title: {
      hi: '⚠️ सिर्फ "हाँ" (The Blind Yes Trap - 20%)',
      en: '⚠️ Blind "Yes" (The Compliance Trap - 20%)',
      hinglish: '⚠️ Sirf "Haan" (The Blind Yes Trap - 20%)',
      bhojpuri: '⚠️ खाली "हाँ" (अंध सहमति - 20%)',
      mr: '⚠️ केवळ "हो" (केवळ होकार - २०%)',
      bn: '⚠️ শুধু "হ্যাঁ" (অসচেতন সম্মতি - ২০%)',
      ta: '⚠️ வெறும் "ஆம்" (குருட்டு ஒப்புதல் - 20%)',
      te: '⚠️ కేవలం "అవును" (అసంపూర్ణ సమ్మతి - 20%)'
    },
    category: 'blind_yes',
    speaker: {
      hi: 'रमेश कुमार (48 वर्ष, किसान, सुल्तानपुर)',
      en: 'Ramesh Kumar (48y, Farmer, Sultanpur)',
      hinglish: 'Ramesh Kumar (48y, Farmer, Sultanpur)',
      bhojpuri: 'रमेश कुमार (48 बरिस, किसान, सुल्तानपुर)',
      mr: 'रमेश कुमार (४८ वर्षे, शेतकरी, सुलतानपूर)',
      bn: 'রমেশ কুমার (৪৮ বছর, কৃষক, সুলতানপুর)',
      ta: 'ரமேஷ் குமார் (48 வயது, விவசாயி, சுல்தான்பூர்)',
      te: 'రమేష్ కుమార్ (48 సం, రైతు, సుల్తాన్‌పూర్)'
    },
    text: {
      hi: 'हाँ ठीक है दीदी, जो सही लगे कर दीजिए, कार्ड बना दीजिए।',
      en: 'Yes okay sister, whatever you feel right, just make the card.',
      hinglish: 'Haan theek hai didi, jo sahi lage kar dijiye, card bana dijiye.',
      bhojpuri: 'हाँ ठीक बा दीदी, कार्ड बना दीं।',
      mr: 'हो ठीक आहे ताई, तुम्हाला योग्य वाटेल ते करा, कार्ड बनवा.',
      bn: 'হ্যাঁ ঠিক আছে দিদি, যা ভালো বোঝেন করুন, কার্ড বানিয়ে দিন।',
      ta: 'ஆம் சரி அம்மா, அட்டை போட்டுவிடுங்கள்.',
      te: 'అవును సరే అక్కా, కార్డు తయారు చేయండి.'
    }
  },
  {
    id: 'misconception_ration',
    title: {
      hi: '❌ भ्रम: राशन व पेंशन का डर (Fear of Benefit Denial - 35%)',
      en: '❌ Misconception: Fear of Losing Ration/Pension (35%)',
      hinglish: '❌ Confusion: Ration/Pension Ka Darr (35%)',
      bhojpuri: '❌ भरम: राशन अउर पेंशन के डर (35%)',
      mr: '❌ गैरसमज: रेशन व पेन्शनची भीती (३५%)',
      bn: '❌ ভুল ধারণা: রেশন বা পেনশন বাতিলের ভয় (৩৫%)',
      ta: '❌ தவறான புரிதல்: ரேஷன் அல்லது ஓய்வூதியம் இழக்கும் பயம் (35%)',
      te: '❌ అపోహ: రేషన్ లేదా పింఛను ఆగిపోతుందనే భయం (35%)'
    },
    category: 'misconception',
    speaker: {
      hi: 'रामू काका (62 वर्ष, बुजुर्ग, अयोध्या)',
      en: 'Ramu Kaka (62y, Elder, Ayodhya)',
      hinglish: 'Ramu Kaka (62y, Elder, Ayodhya)',
      bhojpuri: 'रामू काका (62 बरिस, अयोध्या)',
      mr: 'रामू काका (६२ वर्षे, अयोध्या)',
      bn: 'রামু কাকা (৬২ বছর, অযোধ্যা)',
      ta: 'ராமு காக்கா (62 வயது, அயோத்தி)',
      te: 'రాము కాకా (62 సం, అయోధ్య)'
    },
    text: {
      hi: 'अगर मैंने डॉक्टर को देखने से मना कर दिया या बाद में बंद कराया, तो क्या सरकार मेरा राशन कार्ड काट देगी या पेंशन रोक लेगी?',
      en: 'If I refuse to let doctors see or cancel later, will the government cut my ration card or stop my pension?',
      hinglish: 'Agar maine doctor ko dekhne se mana kiya ya cancel karaya, toh kya ration card kat jayega ya pension ruk jayegi?',
      bhojpuri: 'का हमार राशन कार्ड कट जाई या पेंशन रुक जाई अगर हम रोक देब?',
      mr: 'मी नकार दिला किंवा रद्द केले तर सरकार माझे रेशन किंवा पेन्शन थांबवेल का?',
      bn: 'আমি যদি বাতিল করি তবে কি সরকার আমার রেশন বা পেনশন বন্ধ করে দেবে?',
      ta: 'நான் ரத்து செய்தால் அரசாங்கம் என் ரேஷன் கார்டை ரத்து செய்யுமா அல்லது ஓய்வூதியத்தை நிறுத்துமா?',
      te: 'నేను రద్దు చేస్తే ప్రభుత్వం నా రేషన్ కార్డు లేదా పింఛను ఆపేస్తుందా?'
    }
  },
  {
    id: 'misconception_bank',
    title: {
      hi: '❌ भ्रम: बैंक व कंपनी का डर (Fear of Third-Party Leak - 30%)',
      en: '❌ Misconception: Fear of Banks or Employers (30%)',
      hinglish: '❌ Confusion: Bank Ya Company Ka Darr (30%)',
      bhojpuri: '❌ भरम: बैंक अउर कंपनी के डर (30%)',
      mr: '❌ गैरसमज: बँक किंवा विमा कंपनीची भीती (३०%)',
      bn: '❌ ভুল ধারণা: ব্যাংক বা কোম্পানির ভয় (৩০%)',
      ta: '❌ தவறான புரிதல்: வங்கிகள் பார்க்கும் என்ற பயம் (30%)',
      te: '❌ అపోహ: బ్యాంకులు చూస్తాయనే భయం (30%)'
    },
    category: 'misconception',
    speaker: {
      hi: 'पूजा कुमारी (22 वर्ष, छात्रा, बस्ती)',
      en: 'Pooja Kumari (22y, Student, Basti)',
      hinglish: 'Pooja Kumari (22y, Student, Basti)',
      bhojpuri: 'पूजा कुमारी (22 बरिस, बस्ती)',
      mr: 'पूजा कुमारी (२२ वर्षे, विद्यार्थिनी)',
      bn: 'পূজা কুমারী (২২ বছর, ছাত্রী)',
      ta: 'பூஜா குமாரி (22 வயது, மாணவி)',
      te: 'పూజా కుమారి (22 సం, విద్యార్థిని)'
    },
    text: {
      hi: 'क्या यह बीमारी का रिकॉर्ड बैंक वाले या बीमा कंपनी वाले भी देख लेंगे?',
      en: 'Will bank officials, employers, or insurance companies also be able to see my illness records?',
      hinglish: 'Kya ye bimari ka record bank wale ya insurance company wale bhi dekh lenge?',
      bhojpuri: 'का ई बीमारी के रिपोर्ट बैंक या कंपनी भी देख ली?',
      mr: 'हा आजाराचा रेकॉर्ड बँक किंवा विमा कंपनी देखील पाहू शकेल का?',
      bn: 'এই রোগের তথ্য কি ব্যাংক বা বিমা কোম্পানি দেখতে পাবে?',
      ta: 'இந்த நோய் விவரங்களை வங்கிகளோ காப்பீட்டு நிறுவனங்களோ பார்க்க முடியுமா?',
      te: 'ఈ అనారోగ్య వివరాలను బ్యాంకులు లేదా బీమా కంపెనీలు చూడగలవా?'
    }
  }
];

export class ComprehensionEngine {
  constructor() {
    this.lexicon = {
      blindYesWords: [
        'haan', 'ha', 'yes', 'theek hai', 'thik hai', 'ok', 'okay', 'theek ba',
        'haanji', 'bana do', 'bana dijiye', 'bana dyo', 'sahamat', 'agree', 'sahi hai',
        'हाँ', 'हां', 'ठीक है', 'ठीक बा', 'हाँजी', 'बना दीजिए', 'कर दो', 'हो', 'சரி', 'அవును', 'হ্যাঁ'
      ],
      pillar1: {
        keywords: [
          'doctor', 'hospital', 'clinic', 'chikitsak', 'ilaaj', 'dawa', 'parcha', 'report',
          'blood', 'test', 'bimari', 'kisi aur ko nahi', 'bank nahi', 'company nahi', 'prescription',
          'medical', 'health', 'treating', 'consult', 'illness',
          'डॉक्टर', 'डाक्टर', 'अस्पताल', 'चिकित्सक', 'इलाज', 'दवा', 'पर्चा', 'रिपोर्ट',
          'जांच', 'खून', 'बीमारी', 'सिर्फ डॉक्टर', 'दवाई', 'వైద్యుడు', 'மருத்துவர்', 'ডাক্তার'
        ],
        weight: 35
      },
      pillar2: {
        keywords: [
          'din', 'ghante', 'samay', 'waqt', 'seemit', '2 din', '48 ghante', 'ilaaj tak',
          'limited', 'duration', 'hours', 'days', 'kuch din', 'jab tak', '2 days', '48 hours',
          'temporary', 'consultation',
          'दिन', 'घंटे', 'समय', 'वक़्त', 'सीमित', '2 दिन', '48 घंटे', 'इलाज तक',
          'நாட்கள்', 'రోజులు', 'সময়', 'দিন'
        ],
        weight: 30
      },
      pillar3: {
        keywords: [
          'meri marzi', 'marzi', 'radd', 'band', 'rok', 'wapas', 'mana', 'cancel', 'stop',
          'withdraw', 'revoke', 'phone se', 'missed call', 'asha didi', 'nahi rukega', 'haq',
          'roka nahi jayega', 'right', 'choice', 'my choice', 'free', 'treatment will not stop',
          'not stop', 'anytime',
          'मेरी मर्ज़ी', 'मर्ज़ी', 'रद्द', 'बंद', 'रोक', 'वापस', 'मना', 'कैंसिल',
          'फोन से', 'मिस्ड कॉल', 'इलाज नहीं रुकेगा', 'नहीं रुकेगा', 'हक', 'ரத்து', 'రద్దు', 'বাতিল'
        ],
        weight: 35
      },
      misconceptions: [
        {
          id: 'ration_pension',
          triggers: ['ration', 'pension', 'sarkari suvidha', 'card kat', 'राशन', 'पेंशन', 'कार्ड कट', 'రేషన్', 'ரேஷன்'],
          tips: {
            hi: 'आशा दीदी कहें: "रामू काका, बेफिक्र रहिए! ABHA पूरी तरह आपकी मर्ज़ी है। अनुमति रोकें या न दें, आपका राशन, पेंशन और सरकारी इलाज बिल्कुल पहले जैसा ही चलता रहेगा। कोई एक पैसा भी नहीं कटेगा।"',
            en: 'ASHA Didi says: "Ramu Kaka, do not worry! ABHA is completely voluntary. Whether you share or cancel, your ration, pension, and government healthcare will continue uninterrupted!"',
            hinglish: 'ASHA Didi kahein: "Ramu Kaka, befikra rahiye! Permission cancel karne par bhi aapka ration, pension aur free ilaj bilkul pehle jaisa chalta rahega."',
            bhojpuri: 'आशा दीदी कहीं: "रामू काका, बेफिकिर रहीं! रोकला पर भी राशन, पेंशन आ इलाज कबो ना रुकी।"',
            mr: 'आशा ताई सांगा: "काका, काळजी करू नका! संमती रद्द केली तरी रेशन, पेन्शन व मोफत उपचार चालूच राहील."',
            bn: 'আশা দিদি বলুন: "কাকা, কোনো ভয় নেই! অনুমতি বাতিল করলেও আপনার রেশন, পেনশন ও সরকারি চিকিৎসা যথারীতি চলবে।"',
            ta: 'ஆஷா கூறுகிறார்: "கவலைப்படாதீர்கள்! நீங்கள் ரத்து செய்தாலும் உங்கள் ரேஷன், ஓய்வூதியம் மற்றும் இலவச சிகிச்சை தொடரும்."',
            te: 'ఆశా చెప్పండి: "భయపడవద్దు! మీరు రద్దు చేసినా మీ రేషన్, పింఛను మరియు ఉచిత వైద్యం ఆగవు."'
          }
        },
        {
          id: 'bank_company',
          triggers: ['bank', 'loan', 'bima', 'insurance', 'paisa', 'खाता', 'बैंक', 'लोन', 'வங்கிகள்', 'బ్యాంకులు'],
          tips: {
            hi: 'आशा दीदी कहें: "पूजा जी, यह डिजिटल तिजोरी केवल स्वास्थ्य इलाज के लिए है। किसी भी बैंक, पुलिस या कंपनी का इस तिजोरी से कोई लेना-देना नहीं है।"',
            en: 'ASHA Didi says: "Pooja, this Digital Safe is strictly for medical care. No bank, employer, police, or insurance company can ever access it."',
            hinglish: 'ASHA Didi kahein: "Pooja, ye safe sirf ilaj ke liye hai. Kisi bhi bank ya company ka isse koi lena-dena nahi hai."',
            bhojpuri: 'आशा दीदी कहीं: "पूजा जी, ई तिजोरी खाली सेहत खातिर बा। कवनो बैंक या कंपनी एकरा ना देख सकी।"',
            mr: 'आशा ताई सांगा: "पूजा, ही डिजिटल तिजोरी फक्त उपचारासाठी आहे. कोणतीही बँक किंवा कंपनी हे पाहू शकत नाही."',
            bn: 'আশা দিদি বলুন: "পূজা, এই ডিজিটাল সিন্দুক শুধু চিকিৎসার জন্য। কোনো ব্যাংক বা কোম্পানি এটি দেখতে পাবে না।"',
            ta: 'ஆஷா கூறுகிறார்: "பூஜா, இது மருத்துவ சிகிச்சைக்காக மட்டுமே. வங்கிகளோ பிற நிறுவனங்களோ பார்க்க முடியாது."',
            te: 'ఆశా చెప్పండి: "పూజా, ఈ డిజిటల్ లాకర్ కేవలం వైద్యం కోసం మాత్రమే. బ్యాంకులు లేదా కంపెనీలు చూడలేవు."'
          }
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
        ashaCoachTip: lang === 'en'
          ? 'ASHA asks: "Tell me: Who will see your reports, for how long, and can you cancel anytime?"'
          : 'नागरिक से कहें: "दीदी/भैया, बताइए डॉक्टर साहब क्या देखेंगे और क्या आप इसे कभी भी रोक सकते हैं?"',
        summaryBadge: lang === 'en' ? 'Empty' : 'खाली'
      };
    }

    const clean = text.toLowerCase().trim();
    const words = clean.split(/\s+/);

    // 1. Check for Blind Yes
    let isBlindYes = false;
    if (words.length <= 6) {
      const matchCount = this.lexicon.blindYesWords.filter(w => clean.includes(w)).length;
      if (matchCount > 0 && !clean.includes('doctor') && !clean.includes('डॉक्टर') && !clean.includes('रद्द') && !clean.includes('दिन') && !clean.includes('cancel')) {
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
      score = 20;
    } else {
      if (p1Status) score += this.lexicon.pillar1.weight;
      if (p2Status) score += this.lexicon.pillar2.weight;
      if (p3Status) score += this.lexicon.pillar3.weight;

      if (clean.includes('ilaaj nahi') || clean.includes('इलाज नहीं') || clean.includes('not stop') || clean.includes('never denied')) {
        score = Math.min(100, score + 10);
      }
    }

    const isVerified = score >= 75 && p3Status;

    // 5. Localized Badge & Coach Tip
    let ashaCoachTip = '';
    let summaryBadge = '';

    if (isBlindYes) {
      summaryBadge = lang === 'en' ? '⚠️ Blind "Yes" (Incomplete)' : '⚠️ सिर्फ "हाँ" (अस्वीकार्य)';
      ashaCoachTip = lang === 'en'
        ? 'ASHA Didi says: "Saying yes is not enough! Please explain in your own words what you understood: What will the doctor see, and can you cancel anytime?"'
        : 'आशा दीदी कहें: "सिर्फ हाँ मत कहिए! मुझे अपनी भाषा में बताइए कि आप क्या समझीं—डॉक्टर साहब क्या देखेंगे, और क्या आप इसे बीच में बंद कर सकती हैं?"';
    } else if (detectedMisconceptions.length > 0) {
      summaryBadge = lang === 'en' ? '❌ Misconception Detected' : '❌ भ्रम पकड़ा गया';
      const tipObj = detectedMisconceptions[0].tips;
      ashaCoachTip = tipObj[lang] || tipObj.hi;
    } else if (!p3Status && p1Status) {
      summaryBadge = lang === 'en' ? '🟡 Missing: Right to Revoke' : '🟡 अधूरा: रद्द करने का हक छूट गया';
      ashaCoachTip = lang === 'en'
        ? 'ASHA Didi says: "Great! You understood doctor access. Now tell me: If you change your mind tomorrow, can you stop this permission?"'
        : 'आशा दीदी कहें: "बहुत अच्छे! आपने डॉक्टर और रिपोर्ट का समझा दिया। अब बताइए कि अगर बाद में आपका मन बदल जाए, तो क्या आप इसे रोक सकती हैं?"';
    } else if (!p1Status && p3Status) {
      summaryBadge = lang === 'en' ? '🟡 Missing: Data & Doctor Scope' : '🟡 अधूरा: डॉक्टर/डेटा सीमा छूट गई';
      ashaCoachTip = lang === 'en'
        ? 'ASHA Didi says: "Tell me: Who exactly is allowed to open this safe and look at your medical papers?"'
        : 'आशा दीदी कहें: "यह बताइए कि इस तिजोरी के अंदर कौन से कागज डॉक्टर देखेंगे और कौन इसे बिल्कुल नहीं देख सकता?"';
    } else if (isVerified) {
      summaryBadge = lang === 'en' ? '✅ Full Informed Consent Verified' : '✅ पूर्ण गरिमापूर्ण समझ (100% Verified)';
      ashaCoachTip = lang === 'en'
        ? 'Excellent! The citizen has explained all 3 rights in their own words. You can now issue the Dignity Pass below.'
        : 'शाबाश! नागरिक ने अपने शब्दों में तीनों अधिकार समझा दिए हैं। अब आप नीचे बटन दबाकर सम्मान पत्र जारी कर सकती हैं।';
    } else {
      summaryBadge = lang === 'en' ? '🟡 Partial Understanding' : '🟡 आंशिक समझ';
      ashaCoachTip = lang === 'en'
        ? 'ASHA Didi asks: "Please explain all 3 points: 1. Who sees? 2. For how long? and 3. Can you cancel anytime?"'
        : 'आशा दीदी कहें: "कृप्या तीनों बातें बताइए: 1. कौन देखेगा? 2. कब तक? और 3. क्या आप कभी भी रद्द कर सकती हैं?"';
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
