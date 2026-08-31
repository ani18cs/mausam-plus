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
   * Reads text aloud using Text-To-Speech (Native TTS or Web SpeechSynthesis)
   */
  async speak(text: string, language: SupportedLanguage = 'en'): Promise<void> {
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*_#`[\]()]/g, '').replace(/https?:\/\/\S+/g, '');
    const locale = LOCALE_MAP[language] || 'en-IN';

    // 1. Native TTS
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.speak({
          text: cleanText,
          lang: locale,
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient',
        });
        return;
      } catch (e) {
        console.warn('[VoiceService] Native TTS failed, falling back to Web API:', e);
      }
    }

    // 2. Web Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop ongoing speech
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = locale;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Stops any ongoing TTS playback
   */
  async stopSpeaking(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
      } catch (e) {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
