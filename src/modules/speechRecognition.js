// Speech Recognition & Voice Audio Recorder
// Supports live Web Speech Recognition, MediaRecorder voice proof audio snippet, and offline simulated testing

class SpeechManager {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;
    this.transcript = '';
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioBlob = null;
    this.audioUrl = null;
    this.stream = null;

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'hi-IN';
    }
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  setLanguage(langCode = 'hi-IN') {
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  async startListening(onInterim, onFinal, onError, onStart, onEnd) {
    if (this.isListening) {
      this.stopListening();
    }

    this.transcript = '';
    this.audioChunks = [];
    this.audioBlob = null;
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }

    // Try starting MediaRecorder in parallel to capture actual audio snippet proof
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.audioChunks.push(e.data);
        };
        this.mediaRecorder.onstop = () => {
          if (this.audioChunks.length > 0) {
            this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            this.audioUrl = URL.createObjectURL(this.audioBlob);
          }
        };
        this.mediaRecorder.start();
      }
    } catch (err) {
      console.warn('Microphone stream access not granted for recording proof:', err);
    }

    if (!this.recognition) {
      if (onError) onError('Speech Recognition is not natively supported by this browser. Please use the Voice Presets or type below.');
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (interim && onInterim) {
        onInterim(interim);
      }
      if (final) {
        this.transcript = (this.transcript + ' ' + final).trim();
        if (onFinal) onFinal(this.transcript);
      }
    };

    this.recognition.onerror = (e) => {
      this.isListening = false;
      if (onError) onError(e.error || 'Speech recognition error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.cleanupMedia();
      if (onEnd) onEnd(this.transcript, this.audioUrl);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      if (onError) onError(e.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.cleanupMedia();
    this.isListening = false;
  }

  cleanupMedia() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.debug('Media recorder stop err', e);
      }
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Get current recorded audio URL (or fallback generated tone audio)
  getAudioProofUrl() {
    return this.audioUrl;
  }
}

export const speechManager = new SpeechManager();
