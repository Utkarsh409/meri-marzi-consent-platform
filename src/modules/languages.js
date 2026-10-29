// Vernacular Language Definitions and Audio Scripts for Meri Marzi
// Track: Sahayak & Samman Bharat — Frontline Workers and Data Dignity

export const LANGUAGES = {
  hi: {
    code: 'hi',
    name: 'हिंदी (Hindi)',
    voiceLang: 'hi-IN',
    appName: 'मेरी मर्ज़ी',
    appSubtitle: 'आयुष्मान भारत स्वास्थ्य डेटा सहमति व गरिमा साथी',
    tagline: 'सिर्फ "हाँ" कहना सहमति नहीं — जब नागरिक खुद अपनी भाषा में समझाएं, तभी बने बात!',
    badge: 'राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA / ABDM) मानक अनुरूप',
    tabs: {
      wizard: 'सहमति मार्गदर्शक',
      story: 'तिजोरी व 3 नियम',
      toolkit: 'आशा दीदी टूलकिट',
      passbook: 'सहमति पासबुक',
      dashboard: 'गरिमा डैशबोर्ड'
    },
    speechAudio: {
      step1Intro: 'नमस्ते! मैं आपकी आशा दीदी के साथ आई हूँ। आज हम आपका आयुष्मान भारत हेल्थ अकाउंट (ABHA) बना रहे हैं। आइए समझते हैं कि आपका स्वास्थ्य डेटा कैसे सुरक्षित रहेगा।',
      tijoriMetaphor: 'ABHA को आप अपने स्वास्थ्य की एक डिजिटल तिजोरी समझिए। इसमें आपकी पुरानी पर्चियां, खून की जांच और रिपोर्ट सुरक्षित रहेंगी। इस तिजोरी की चाभी सिर्फ और सिर्फ आपके हाथ में है।',
      pillar1Recipient: 'पहला नियम: आपका डेटा केवल वही डॉक्टर या अस्पताल देख सकते हैं जिन्हें आप अभी इलाज के लिए दिखाना चाहती हैं। कोई भी बैंक, बीमा कंपनी, पुलिस या पड़ोसी इसे आपकी अनुमति के बिना कभी नहीं देख सकता।',
      pillar2Duration: 'दूसरा नियम: डॉक्टर को देखने की अनुमति हमेशा सीमित समय (जैसे 2 दिन या इलाज के दौरान) के लिए ही होती है। उसके बाद उनका एक्सेस अपने आप बंद हो जाता है।',
      pillar3Revocation: 'तीसरा और सबसे जरूरी नियम - मेरी मर्ज़ी! आप जब चाहें, अपने फोन से 1 मिस्ड कॉल या आशा दीदी से कहकर यह अनुमति तुरंत रद्द कर सकती हैं। अनुमति बंद करने पर भी आपका सरकारी इलाज और दवाएं कभी नहीं रोकी जाएंगी। यह आपका कानूनी हक है!',
      promptTeachBack: 'अब कृप्या आप अपनी भाषा में मुझे समझाइए कि आपने क्या समझा? डॉक्टर साहब क्या देख सकेंगे, कब तक देख सकेंगे, और क्या आप जब चाहें इसे बंद कर सकती हैं?'
    },
    pillars: {
      p1: { title: '1. कौन देख सकता है?', desc: 'सिर्फ इलाज करने वाले डॉक्टर, बैंक या कंपनी नहीं' },
      p2: { title: '2. कब तक?', desc: 'सीमित समय (जैसे 24-48 घंटे या परामर्श तक)' },
      p3: { title: '3. मेरी मर्ज़ी (रद्द करने का हक)', desc: 'कभी भी रोकें, इलाज पर कोई असर नहीं पड़ेगा' }
    },
    warnings: {
      blindYes: '⚠️ चेतावनी: नागरिक ने केवल "हाँ" कहा है। यह वास्तविक सहमति नहीं है! कृपया उन्हें अपनी भाषा में समझाने को कहें।',
      misconception: '❌ शंका या भ्रम पकड़ा गया: नागरिक के मन में डर या गलतफहमी है। नीचे दिए गए आशा संवाद से तुरंत स्पष्ट करें।',
      verified: '✅ पूर्ण गरिमापूर्ण सहमति: नागरिक ने तीनों महत्वपूर्ण अधिकारों को अपनी भाषा में समझा दिया है!'
    }
  },
  hinglish: {
    code: 'hinglish',
    name: 'Hinglish (हिंग्लिश)',
    voiceLang: 'hi-IN',
    appName: 'Meri Marzi',
    appSubtitle: 'ABHA Health Data Consent & Dignity Companion',
    tagline: 'Sirf "Haan" bolna consent nahi hai — Citizen apne shabdon mein samjhayein tabhi consent record hoga!',
    badge: 'ABDM & DPDP Act Data Dignity Standards',
    tabs: {
      wizard: 'Consent Guide',
      story: 'Tijori Story',
      toolkit: 'ASHA Toolkit',
      passbook: 'Consent Passbook',
      dashboard: 'Dignity Dashboard'
    },
    speechAudio: {
      step1Intro: 'Namaste! Aaj hum aapka ABHA Health Account create kar rahe hain. Chaliye dekhte hain ki aapka health data kaise 100% safe aur confidential rahega.',
      tijoriMetaphor: 'ABHA account aapke health records ki ek Digital Tijori hai. Isme aapki purani prescriptions aur lab reports rehti hain. Is tijori ki chaabi sirf aapke haath mein hai!',
      pillar1Recipient: 'Rule 1: Sirf wahi doctor aapka data dekh sakte hain jinhe aap consult kar rahe hain. Koi bank, employer ya insurance agent isko nahi dekh sakta.',
      pillar2Duration: 'Rule 2: Ye permission limited time ke liye hoti hai, jaise 2 days. Time pura hote hi access automatically close ho jayega.',
      pillar3Revocation: 'Rule 3 - Meri Marzi: Aap jab chahein 1 missed call dekar permission cancel kar sakte hain. Consent cancel karne par bhi aapka treatment bilkul nahi rukega!',
      promptTeachBack: 'Ab please aap apne shabdon mein bataiye ki aapne kya samjha? Doctor kya dekhenge, kab tak dekhenge, aur kya aap ise beech mein cancel kar sakte hain?'
    },
    pillars: {
      p1: { title: '1. Kaun dekh sakta hai?', desc: 'Sirf treating doctor, no bank or third-party' },
      p2: { title: '2. Kab tak?', desc: 'Limited duration (e.g. 24-48 hours only)' },
      p3: { title: '3. Meri Marzi (Right to Revoke)', desc: 'Cancel anytime, healthcare never stops' }
    },
    warnings: {
      blindYes: '⚠️ Warning: Citizen only said "Yes". This is not informed consent! Ask them to explain in their own words.',
      misconception: '❌ Misconception detected! Citizen has a fear or confusion. Use the ASHA guide below to clarify.',
      verified: '✅ Dignified Informed Consent Verified: Citizen explained all 3 pillars in their own words!'
    }
  },
  en: {
    code: 'en',
    name: 'English',
    voiceLang: 'en-IN',
    appName: 'Meri Marzi',
    appSubtitle: 'ABHA Health Data Consent & Dignity Companion',
    tagline: 'Saying "yes" does not prove understanding. Help citizens explain in their own words before recording permission.',
    badge: 'National Health Authority (ABDM) Data Dignity Standards',
    tabs: {
      wizard: 'Consent Wizard',
      story: 'Tijori Metaphor',
      toolkit: 'ASHA Toolkit',
      passbook: 'Consent Passbook',
      dashboard: 'Dignity Dashboard'
    },
    speechAudio: {
      step1Intro: 'Hello! Your ASHA health worker is here to guide you in creating your ABHA Health Account. Let us understand how your health records remain secure.',
      tijoriMetaphor: 'Think of ABHA as your personal Digital Safe or Tijori. It keeps your past prescriptions and diagnostic test reports secure. The key to this safe is held only by you!',
      pillar1Recipient: 'Pillar 1: Only the specific doctor treating you can view your shared records. No bank, employer, insurance salesperson, or neighbor can ever see it.',
      pillar2Duration: 'Pillar 2: Permission is strictly time-limited, such as for 2 days during your visit. Once expired, access closes automatically.',
      pillar3Revocation: 'Pillar 3: The Right to Revoke — Meri Marzi! You can cancel or pause permission anytime with a simple missed call or through your ASHA worker. Cancelling permission will NEVER stop your government healthcare or medicines!',
      promptTeachBack: 'Now, please explain in your own words what you understood. Who can see your records, for how long, and can you cancel this permission at any time?'
    },
    pillars: {
      p1: { title: '1. Who can view?', desc: 'Only authorized doctor/hospital treating you' },
      p2: { title: '2. For how long?', desc: 'Time-bound (e.g. 24-48 hours during visit)' },
      p3: { title: '3. Right to Revoke', desc: 'Cancel anytime, medical care never stopped' }
    },
    warnings: {
      blindYes: '⚠️ Warning: Citizen merely said "Yes" or nodded. A blind "Yes" is not informed consent! Encourage them to explain.',
      misconception: '❌ Misconception Detected: Citizen has doubts or anxiety. Use the ASHA dialogue prompt to clarify immediately.',
      verified: '✅ Dignified Consent Confirmed: Citizen clearly articulated all 3 privacy pillars in their own words!'
    }
  },
  bhojpuri: {
    code: 'bhojpuri',
    name: 'भोजपुरी (Bhojpuri)',
    voiceLang: 'hi-IN',
    appName: 'मेरी मर्ज़ी',
    appSubtitle: 'आयुष्मान भारत सेहत खाता सहमति साथी',
    tagline: 'खाली "हाँ" कहल सहमति ना ह — जब रउआ अपने मुँह से समझाएब, तबे बात बनी!',
    badge: 'राष्ट्रीय स्वास्थ्य मिशन मानक',
    tabs: {
      wizard: 'सहमति गाइड',
      story: 'तिजोरी के कहानी',
      toolkit: 'आशा दीदी सहायता',
      passbook: 'सहमति पासबुक',
      dashboard: 'गरिमा डैशबोर्ड'
    },
    speechAudio: {
      step1Intro: 'प्रणाम! आज रउआ के आभा हेल्थ खाता बनत बा। चलीं समझल जाव कि रउआ के दवाई-पर्चा केतना सुरक्षित रही।',
      tijoriMetaphor: 'आभा खाता के आपन डिजिटल तिजोरी समझीं। एह तिजोरी में रउआ सब पुरान पर्चा अउर जांच रिपोर्ट बंद रही। एह तिजोरी के चाभी खाली रउवे हाथ में बा।',
      pillar1Recipient: 'पहिला नियम: रउआ के रिपोर्ट खाली उहे डाक्टर देखिहें जे रउआ के इलाज करत बाड़न। कवनो बैंक या कंपनी ना देख सकी।',
      pillar2Duration: 'दूसरका नियम: ई छूट खाली 2 दिन भा इलाज भर रही। ओकरा बाद अपने आप बंद हो जाई।',
      pillar3Revocation: 'तीसरका नियम - हमार मर्ज़ी! रउआ जब चाहीं एक मिस्ड काल मार के ई रोक सकत बानी। रोकला पर भी सरकारी इलाज कबो ना रुकी!',
      promptTeachBack: 'अब रउआ अपने बोली में समझाईं कि का समझनी? डाक्टर का देखिहें, कब तक देखिहें, अउर का रउआ जब चाहीं एकरा के रोक सकत बानी?'
    },
    pillars: {
      p1: { title: '1. के देख सकी?', desc: 'खाली इलाज करे वाला डाक्टर साहब' },
      p2: { title: '2. कब ले?', desc: 'सीमित दिन (24-48 घंटा इलाज भर)' },
      p3: { title: '3. हमार मर्ज़ी (रोके के हक)', desc: 'कबो रोकीं, इलाज कबो ना रुकी' }
    },
    warnings: {
      blindYes: '⚠️ चेतौनी: खाली "हाँ" कहल बा। अपने बोली में समझावे के कहीँ।',
      misconception: '❌ भरम धराइल: मन में कवनो डर बा। नीचे दिहल बात से समझाईं।',
      verified: '✅ बढ़िया समझ: रउआ सभे बात अपने बोली में समझा देनी!'
    }
  },
  mr: {
    code: 'mr',
    name: 'मराठी (Marathi)',
    voiceLang: 'mr-IN',
    appName: 'माझी मर्जी',
    appSubtitle: 'आयुष्मान भारत आरोग्य माहिती संमती व सन्मान साथी',
    tagline: 'फक्त "हो" म्हणणे म्हणजे संमती नाही — नागरिकांनी स्वतःच्या शब्दात समजावून सांगितले पाहिजे!',
    badge: 'राष्ट्रीय डिजिटल आरोग्य अभियान (ABDM) मानांकन',
    tabs: {
      wizard: 'संमती मार्गदर्शक',
      story: 'तिजोरी व ३ नियम',
      toolkit: 'आशा दीदी टूलकिट',
      passbook: 'संमती पासबुक',
      dashboard: 'सन्मान डॅशबोर्ड'
    },
    speechAudio: {
      step1Intro: 'नमस्कार! आज आपण तुमचे आभा आरोग्य खाते तयार करत आहोत. तुमचे वैद्यकीय रेकॉर्ड कसे सुरक्षित राहतील ते समजून घेऊया.',
      tijoriMetaphor: 'आभा खात्याला तुमच्या आरोग्याची एक डिजिटल तिजोरी समजा. यामध्ये तुमचे जुने रिपोर्ट आणि औषध पत्र सुरक्षित राहतात. या तिजोरीची चावी फक्त आणि फक्त तुमच्या हातात असते.',
      pillar1Recipient: 'नियम १: तुमचे रेकॉर्ड फक्त तेच डॉक्टर पाहू शकतात जे सध्या तुमच्यावर उपचार करत आहेत. कोणतीही बँक किंवा कंपनी हे पाहू शकत नाही.',
      pillar2Duration: 'नियम २: डॉक्टरांना ही संमती फक्त ठराविक वेळेसाठी (उदा. २ दिवस किंवा उपचारादरम्यान) दिली जाते.',
      pillar3Revocation: 'नियम ३: माझी मर्जी! तुम्ही जेव्हा वाटेल तेव्हा १ मिस्ड कॉल देऊन ही संमती रद्द करू शकता. संमती रद्द केली तरी तुमचा मोफत उपचार कधीही थांबवला जाणार नाही!',
      promptTeachBack: 'आता कृपया तुम्ही तुमच्या स्वतःच्या शब्दात सांगा की तुम्हाला काय समजले? डॉक्टर काय पाहतील, किती काळ पाहतील आणि तुम्ही हे कधीही थांबवू शकता का?'
    },
    pillars: {
      p1: { title: '१. कोण पाहू शकते?', desc: 'फक्त तपासणारे डॉक्टर, इतर कोणीही नाही' },
      p2: { title: '२. किती काळासाठी?', desc: 'मर्यादित वेळ (उदा. २४-४८ तास)' },
      p3: { title: '३. माझी मर्जी (रद्द करण्याचा हक्क)', desc: 'केव्हाही रद्द करा, उपचारावर काहीही परिणाम नाही' }
    },
    warnings: {
      blindYes: '⚠️ इशारा: नागरिकाने फक्त "हो" म्हटले. कृपया स्वतःच्या शब्दात समजावण्यास सांगा.',
      misconception: '❌ गैरसमज आढळला: नागरिकाच्या मनात शंका आहे. आशा दीदी मार्गदर्शनानुसार स्पष्ट करा.',
      verified: '✅ खरी संमती सिद्ध: नागरिकांनी तिन्ही मुद्द्यांचे अचूक स्पष्टीकरण दिले!'
    }
  },
  bn: {
    code: 'bn',
    name: 'বাংলা (Bengali)',
    voiceLang: 'bn-IN',
    appName: 'আমার মর্জি',
    appSubtitle: 'আয়ুষ্মান ভারত স্বাস্থ্য তথ্য সম্মতি ও সম্মান সাথী',
    tagline: 'শুধু "হ্যাঁ" বলা সম্মতি নয় — নাগরিক নিজের ভাষায় বুঝিয়ে বললেই তবেই সম্মতি বৈধ!',
    badge: 'জাতীয় ডিজিটাল স্বাস্থ্য মিশন মান্য',
    tabs: {
      wizard: 'সম্মতি গাইড',
      story: 'ডিজিটাল সিন্দুক',
      toolkit: 'আশা দিদি টুলকিট',
      passbook: 'সম্মতি পাসবুক',
      dashboard: 'সম্মান ড্যাশবোর্ড'
    },
    speechAudio: {
      step1Intro: 'নমস্কার! আশা দিদি আজ আপনার আভা হেলথ অ্যাকাউন্ট তৈরি করতে সাহায্য করছেন। আসুন জেনে নিই কীভাবে আপনার স্বাস্থ্য তথ্য সুরক্ষিত থাকবে।',
      tijoriMetaphor: 'আভা অ্যাকাউন্টকে আপনার স্বাস্থ্যের একটি ডিজিটাল সিন্দুক মনে করুন। এখানে আপনার পুরনো প্রেসক্রিপশন ও টেস্ট রিপোর্ট সুরক্ষিত থাকে। এর চাবি শুধুই আপনার হাতে!',
      pillar1Recipient: 'নিয়ম ১: শুধুমাত্র যে ডাক্তার আপনার চিকিৎসা করছেন তিনিই আপনার রিপোর্ট দেখতে পাবেন। কোনো ব্যাংক বা সংস্থা এটি দেখতে পারবে না।',
      pillar2Duration: 'নিয়ম ২: এই অনুমতি নির্দিষ্ট সময়ের জন্য (যেমন ২ দিন বা চিকিৎসার সময়)। তারপর এটি নিজে থেকেই বন্ধ হয়ে যাবে।',
      pillar3Revocation: 'নিয়ম ৩: আমার মর্জি! আপনি যেকোনো সময় ১টি মিসড কল দিয়ে অনুমতি বাতিল করতে পারেন। বাতিল করলেও আপনার সরকারি চিকিৎসা কখনোই বন্ধ হবে না!',
      promptTeachBack: 'এবার অনুগ্রহ করে নিজের ভাষায় বুঝিয়ে বলুন আপনি কী বুঝলেন? ডাক্তার কী দেখবেন, কতদিন দেখবেন, এবং আপনি কি চাইলেই এটি বাতিল করতে পারবেন?'
    },
    pillars: {
      p1: { title: '১. কে দেখতে পাবেন?', desc: 'শুধুমাত্র চিকিৎসা করা ডাক্তারবাবু' },
      p2: { title: '২. কত দিনের জন্য?', desc: 'সীমিত সময় (যেমন ২৪-৪৮ ঘণ্টা)' },
      p3: { title: '৩. আমার মর্জি (বাতিল অধিকার)', desc: 'যেকোনো সময় বন্ধ করুন, চিকিৎসা থামবে না' }
    },
    warnings: {
      blindYes: '⚠️ সতর্কতা: নাগরিক শুধুই "হ্যাঁ" বলেছেন। নিজের ভাষায় বলতে উৎসাহিত করুন।',
      misconception: '❌ ভুল ধারণা শনাক্ত: নাগরিকের মনে দ্বিধা রয়েছে। অবিলম্বে স্পষ্ট করুন।',
      verified: '✅ মর্যাদাশীল সচেতন সম্মতি প্রমাণিত: ৩টি প্রধান শর্তই নাগরিক নিজের ভাষায় ব্যাখ্যা করেছেন!'
    }
  },
  ta: {
    code: 'ta',
    name: 'தமிழ் (Tamil)',
    voiceLang: 'ta-IN',
    appName: 'என் விருப்பம் (Meri Marzi)',
    appSubtitle: 'ஆயுஷ்மான் பாரத் சுகாதார தரவு ஒப்புதல் வழிகாட்டி',
    tagline: 'வெறும் "ஆம்" சொல்வது ஒப்புதலாகாது — குடிமக்கள் தங்கள் சொந்த வார்த்தைகளில் விளக்க வேண்டும்!',
    badge: 'ABDM தேசிய சுகாதார ஆணைய தரநிலை',
    tabs: {
      wizard: 'ஒப்புதல் வழிகாட்டி',
      story: 'பாதுகாப்பு பெட்டகம்',
      toolkit: 'ஆஷா கருவித்தொகுப்பு',
      passbook: 'ஒப்புதல் பாஸ்புக்',
      dashboard: 'கண்ணிய டாஷ்போர்டு'
    },
    speechAudio: {
      step1Intro: 'வணக்கம்! இன்று நாம் உங்கள் ஆபா (ABHA) கணக்கை உருவாக்குகிறோம். உங்கள் மருத்துவத் தரவுகள் எவ்வாறு பாதுகாக்கப்படுகின்றன என்பதைப் பார்ப்போம்.',
      tijoriMetaphor: 'ஆபா கணக்கை உங்கள் சொந்த டிஜிட்டல் பாதுகாப்பு பெட்டகமாக (Tijori) கருதுங்கள். இதன் சாவி உங்களிடம் மட்டுமே உள்ளது!',
      pillar1Recipient: 'விதி 1: உங்களுக்கு சிகிச்சை அளிக்கும் மருத்துவர் மட்டுமே இந்த ஆவணங்களைப் பார்க்க முடியும். வங்கிகளோ பிற நிறுவனங்களோ பார்க்க முடியாது.',
      pillar2Duration: 'விதி 2: இந்த அனுமதி குறிப்பிட்ட காலத்திற்கு மட்டுமே (எ.கா. 2 நாட்கள்). அதன் பிறகு தானாக முடிந்துவிடும்.',
      pillar3Revocation: 'விதி 3: என் விருப்பம்! நீங்கள் எப்போது வேண்டுமானாலும் ஒரு மிஸ்டு கால் மூலம் இந்த அனுமதியை ரத்து செய்யலாம். ரத்து செய்தாலும் உங்கள் சிகிச்சை நிறுத்தப்படாது!',
      promptTeachBack: 'இப்போது உங்கள் சொந்த வார்த்தைகளில் நீங்கள் புரிந்துகொண்டதை விளக்குங்கள். மருத்துவர் என்ன பார்ப்பார், எவ்வளவு காலம், எப்போது வேண்டுமானாலும் ரத்து செய்ய முடியுமா?'
    },
    pillars: {
      p1: { title: '1. யார் பார்க்கலாம்?', desc: 'சிகிச்சை அளிக்கும் மருத்துவர் மட்டுமே' },
      p2: { title: '2. எவ்வளவு காலம்?', desc: 'வரையறுக்கப்பட்ட நேரம் (24-48 மணி நேரம்)' },
      p3: { title: '3. ரத்து செய்யும் உரிமை', desc: 'எப்போது வேண்டுமானாலும் ரத்து செய்யலாம், சிகிச்சை நிற்காது' }
    },
    warnings: {
      blindYes: '⚠️ எச்சரிக்கை: வெறும் "ஆம்" என்று மட்டும் கூறியுள்ளார். சொந்த வார்த்தைகளில் விளக்கச் சொல்லுங்கள்.',
      misconception: '❌ தவறான புரிதல்: பயனருக்கு பயம் அல்லது சந்தேகம் உள்ளது. தெளிவுபடுத்துங்கள்.',
      verified: '✅ முழுமையான புரிதல் உறுதி செய்யப்பட்டது!'
    }
  },
  te: {
    code: 'te',
    name: 'తెలుగు (Telugu)',
    voiceLang: 'te-IN',
    appName: 'నా ఇష్టం (Meri Marzi)',
    appSubtitle: 'ఆయుష్మాన్ భారత్ హెల్త్ డేటా అనుమతి మార్గదర్శి',
    tagline: 'కేవలం "అవును" అనడం సమ్మతి కాదు — పౌరులు తమ స్వంత మాటల్లో వివరించినప్పుడే నిజమైన అనుమతి!',
    badge: 'జాతీయ డిజిటల్ ఆరోగ్య మిషన్ (ABDM) ప్రమాణాలు',
    tabs: {
      wizard: 'సమ్మతి గైడ్',
      story: 'డిజిటల్ లాకర్',
      toolkit: 'ఆశా టూల్‌కిట్',
      passbook: 'సమ్మతి పాస్‌బుక్',
      dashboard: 'గౌరవ డ్యాష్‌బోర్డ్'
    },
    speechAudio: {
      step1Intro: 'నమస్కారం! ఈరోజు మనం మీ ఆభా (ABHA) ఖాతాను ప్రారంభిస్తున్నాము. మీ ఆరోగ్య వివరాలు ఎలా సురక్షితంగా ఉంటాయో తెలుసుకుందాం.',
      tijoriMetaphor: 'ఆభా ఖాతాను మీ ఆరోగ్య సమాచార డిజిటల్ లాకర్‌గా భావించండి. ఈ లాకర్ తాళంచెవి కేవలం మీ చేతిలోనే ఉంటుంది!',
      pillar1Recipient: 'నియమం 1: మీకు చికిత్స చేసే డాక్టర్ మాత్రమే మీ రికార్డులను చూడగలరు. బ్యాంకులు లేదా ఇతర కంపెనీలకు ప్రవేశం ఉండదు.',
      pillar2Duration: 'నియమం 2: ఈ అనుమతి పరిమిత సమయం (ఉదాహరణకు 2 రోజులు) మాత్రమే చెల్లుబాటు అవుతుంది.',
      pillar3Revocation: 'నియమం 3: నా ఇష్టం! మీరు ఎప్పుడైనా 1 మిస్డ్ కాల్ ద్వారా ఈ అనుమతిని రద్దు చేయవచ్చు. రద్దు చేసినా మీ ప్రభుత్వ ఉచిత వైద్యం ఆగదు!',
      promptTeachBack: 'ఇప్పుడు దయచేసి మీ స్వంత మాటల్లో మీరు ఏమి అర్థం చేసుకున్నారో చెప్పండి. డాక్టర్ ఏమి చూస్తారు, ఎంత కాలం, ఎప్పుడైనా రద్దు చేసుకోవచ్చా?'
    },
    pillars: {
      p1: { title: '1. ఎవరు చూడగలరు?', desc: 'చికిత్స చేసే డాక్టర్ మాత్రమే' },
      p2: { title: '2. ఎంత కాలం?', desc: 'పరిమిత సమయం (24-48 గంటలు)' },
      p3: { title: '3. రద్దు చేసుకునే హక్కు', desc: 'ఎప్పుడైనా రద్దు చేయవచ్చు, వైద్యం ఆగదు' }
    },
    warnings: {
      blindYes: '⚠️ హెచ్చరిక: పౌరుడు కేవలం "అవును" అన్నారు. స్వంత మాటల్లో వివరించమని చెప్పండి.',
      misconception: '❌ అపోహ గుర్తించబడింది: పౌరుడికి ఏదైనా భయం ఉంటే నివృత్తి చేయండి.',
      verified: '✅ పూర్తి అవగాహనతో కూడిన సమ్మతి ధృవీకరించబడింది!'
    }
  }
};
