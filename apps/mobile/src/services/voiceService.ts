import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SupportedLanguage } from '@mausam/shared-types';

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

class VoiceService {
  private activeWebRecognition: any = null;
  private isListening = false;
  private isSpeaking = false;

  /**
   * Checks if voice recognition is available on device/browser
   */
  async isAvailable(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        const res = await SpeechRecognition.available();
        return res.available;
      } catch (e) {
        return false;
      }
    }
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  /**
   * Starts listening for voice input
   */
  async startListening(
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    language: SupportedLanguage = 'en'
  ): Promise<void> {
    // If speaking, stop immediately before listening
    this.stopSpeaking();

    if (this.isListening) {
      this.stopListening();
    }

    const locale = LOCALE_MAP[language] || 'en-IN';
    this.isListening = true;

    // 1. Native Capacitor Speech Recognition
    if (Capacitor.isNativePlatform()) {
      try {
        const hasPerm = await SpeechRecognition.checkPermissions();
        if (hasPerm.speechRecognition !== 'granted') {
          await SpeechRecognition.requestPermissions();
        }

        SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) => {
          if (data.matches && data.matches.length > 0) {
            onResult(data.matches[0]);
          }
        });

        await SpeechRecognition.start({
          language: locale,
          maxResults: 2,
          prompt: 'Speak to Ask Mausam AI',
          partialResults: true,
          popup: false,
        });
        return;
      } catch (e: any) {
        console.warn('[VoiceService] Native speech recognition error, falling back to Web API:', e);
      }
    }

    // 2. Web Speech API Fallback
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      this.isListening = false;
      onError('Speech recognition is not supported on this browser/device.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      this.activeWebRecognition = recognition;
      recognition.lang = locale;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[VoiceService] Web recognition error:', event.error);
        this.isListening = false;
        onError(event.error === 'not-allowed' ? 'Microphone access was denied.' : 'Voice recognition error.');
      };

      recognition.onend = () => {
        this.isListening = false;
      };

      recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onError(err?.message || 'Could not start voice recognition.');
    }
  }

  /**
   * Stops listening
   */
  async stopListening(): Promise<void> {
    this.isListening = false;
    if (Capacitor.isNativePlatform()) {
      try {
        await SpeechRecognition.stop();
      } catch (e) {}
    }

    if (this.activeWebRecognition) {
      try {
        this.activeWebRecognition.stop();
      } catch (e) {}
      this.activeWebRecognition = null;
    }
  }

  /**
   * Find natural, smooth female voice for target locale
   */
  private getBestFemaleVoice(lang: SupportedLanguage): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const localePrefix = (LOCALE_MAP[lang] || 'en-IN').split('-')[0].toLowerCase();

    // High quality female voice names & indicators
    const femaleKeywords = [
      'female', 'zira', 'samantha', 'karen', 'victoria', 'moira', 'tessa', 
      'swara', 'heera', 'veena', 'ananya', 'priya', 'kalpana', 'google', 'natural'
    ];

    // 1. Matches language + female keyword
    const matchingLangVoices = voices.filter((v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(localePrefix)
    );

    const femaleMatch = matchingLangVoices.find((v) =>
      femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (femaleMatch) return femaleMatch;

    // 2. Any voice in same language
    if (matchingLangVoices.length > 0) return matchingLangVoices[0];

    // 3. Fallback to any female voice in system
    const globalFemale = voices.find((v) =>
      femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    return globalFemale || voices[0] || null;
  }

  /**
   * Reads text aloud using smooth female Text-To-Speech
   */
  async speak(
    text: string,
    language: SupportedLanguage = 'en',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): Promise<void> {
    // 1. Cancel any active speech first
    await this.stopSpeaking();

    // 2. Clean text: remove markdown symbols (**bold**, *italic*, headers, brackets, URLs)
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/_{1,2}/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[{}\\]/g, '')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const locale = LOCALE_MAP[language] || 'en-IN';
    this.isSpeaking = true;

    // 3. Native Capacitor Text-to-Speech
    if (Capacitor.isNativePlatform()) {
      try {
        onStart?.();
        await TextToSpeech.speak({
          text: cleanText,
          lang: locale,
          rate: 0.95,
          pitch: 1.15, // Crisp, natural feminine pitch
          volume: 1.0,
          category: 'ambient',
        });
        this.isSpeaking = false;
        onEnd?.();
        return;
      } catch (e) {
        console.warn('[VoiceService] Native TTS failed, falling back to Web API:', e);
      }
    }

    // 4. Web Speech Synthesis with smooth female voice selection
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = locale;
        utterance.rate = 0.96; // Calm, clear pacing
        utterance.pitch = 1.15; // Natural feminine pitch

        const selectedVoice = this.getBestFemaleVoice(language);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
          this.isSpeaking = true;
          onStart?.();
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          onEnd?.();
        };

        utterance.onerror = (e) => {
          this.isSpeaking = false;
          onError?.(e);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        this.isSpeaking = false;
        onError?.(err);
      }
    }
  }

  /**
   * Stops any ongoing TTS playback
   */
  async stopSpeaking(): Promise<void> {
    this.isSpeaking = false;
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
      } catch (e) {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  /**
   * Check if speech synthesis is currently active
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking || (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking);
  }
}

export const voiceService = new VoiceService();
