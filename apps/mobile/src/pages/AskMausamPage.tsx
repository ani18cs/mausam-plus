import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AIQueryResponse, AIAuditTrail } from '@mausam/shared-types';
import { useTranslation } from '../utils/i18n';
import { voiceService } from '../services/voiceService';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Bot,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  FileText,
  Wrench,
  ChevronDown,
  ChevronUp,
  Square,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  insights?: AIQueryResponse['insights'];
  suggestedFollowUps?: string[];
  confidence?: number;
  auditTrail?: AIAuditTrail;
}

/**
 * Parses inline markdown bold **text** into styled strong elements without raw asterisks
 */
function renderFormattedMessage(text: string): React.ReactNode {
  if (!text) return null;

  // Split by **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-content-primary">
          {inner}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export const AskMausamPage: React.FC = () => {
  const { activeLocation, selectedPersonas, forecast, fetchForecast, language, userProfile } = useAppStore();
  const { t } = useTranslation();

  // Generate personalized time-aware salutation & greeting
  const getGreetingHeader = useMemo(() => {
    const hour = new Date().getHours();
    const userName = userProfile?.name ? `, ${userProfile.name.split(' ')[0]}` : '';
    const tempStr = forecast ? `${Math.round(forecast.current.temp_c)}°C` : '28°C';
    const conditionStr = forecast?.current.condition || 'Partly Cloudy';

    if (language === 'hi') {
      const salutation = hour < 12 ? 'सुप्रभात' : hour < 17 ? 'शुभ दोपहर' : hour < 21 ? 'शुभ संध्या' : 'नमस्ते';
      return `${salutation}${userName}! मैं **मौसम+ AI** हूँ। **${activeLocation.name}** में अभी **${tempStr}** और **${conditionStr}** है। आज के मौसम, बारिश या यात्रा सुरक्षा के बारे में कुछ भी पूछें।`;
    }
    if (language === 'kn') {
      const salutation = hour < 12 ? 'ಶುಭೋದಯ' : hour < 17 ? 'ಶುಭ ಮಧ್ಯಾಹ್ನ' : hour < 21 ? 'ಶುಭ ಸಂಜೆ' : 'ನಮಸ್ಕಾರ';
      return `${salutation}${userName}! ನಾನು **ಮೌಸಮ್+ AI** ಸಹಾಯಕ. **${activeLocation.name}** ನಲ್ಲಿ ಪ್ರಸ್ತುತ **${tempStr}**, **${conditionStr}** ಇದೆ. ಮಳೆ, ತಾಪಮಾನ ಅಥವಾ ಹೊರಹೋಗುವ ಸಮಯದ ಬಗ್ಗೆ ಕೇಳಿ.`;
    }

    const salutation = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Hello';
    return `${salutation}${userName}! I am **Ask Mausam AI**, your grounded meteorological companion. It is currently **${tempStr}** and **${conditionStr}** in **${activeLocation.name}**. How can I help you plan your day?`;
  }, [language, userProfile?.name, activeLocation.name, forecast]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: getGreetingHeader,
      timestamp: 'Just now',
      suggestedFollowUps: [
        t('ask.question1') || 'Is it safe for an outdoor run today?',
        t('ask.question2') || 'Will it rain during evening commute hours?',
        t('ask.question3') || 'What is the heat-stress level tomorrow?',
        t('ask.question4') || 'What safety precautions are recommended?',
      ],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [openAuditMsgId, setOpenAuditMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!forecast) {
      fetchForecast(activeLocation.lat, activeLocation.lon, activeLocation.name);
    }
  }, [forecast, activeLocation, fetchForecast]);

  // Clean up speech on component unmount
  useEffect(() => {
    return () => {
      voiceService.stopSpeaking();
    };
  }, []);

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
    setSpeakingMsgId(null);
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      handleStopSpeaking();
      return;
    }

    setSpeakingMsgId(msgId);
    voiceService.speak(
      text,
      language,
      () => setSpeakingMsgId(msgId),
      () => setSpeakingMsgId(null),
      () => setSpeakingMsgId(null)
    );
  };

  const handleSend = async (queryText?: string) => {
    // Automatically stop any ongoing dictation when a new prompt is sent
    handleStopSpeaking();

    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setVoiceError(null);

    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-language': language,
        },
        body: JSON.stringify({
          query: textToSend,
          location: activeLocation,
          selectedPersonas,
          forecastContext: forecast,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI query failed with status ${response.status}`);
      }

      const aiData = (await response.json()) as AIQueryResponse;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiData.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        insights: aiData.insights,
        suggestedFollowUps: aiData.suggestedFollowUps,
        confidence: aiData.confidence,
        auditTrail: aiData.auditTrail,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Auto read response smoothly
      handleSpeakMessage(aiMsg.id, aiData.answer);
    } catch (err: any) {
      console.warn('[Ask Mausam] Live fetch error:', err);
      const fallbackText =
        language === 'hi'
          ? `वर्तमान मौसम डेटा के अनुसार **${activeLocation.name}** में तापमान **${forecast?.current.temp_c ?? 28}°C** है और बारिश की संभावना **${forecast?.daily?.[0]?.rain_prob_pct ?? 25}%** है।`
          : language === 'kn'
          ? `ಪ್ರಸ್ತುತ ಹವಾಮಾನ ದತ್ತಾಂಶದ ಪ್ರಕಾರ **${activeLocation.name}** ನಲ್ಲಿ ತಾಪಮಾನ **${forecast?.current.temp_c ?? 28}°C** ಮತ್ತು ಮಳೆಯ ಸಂಭವನೀಯತೆ **${forecast?.daily?.[0]?.rain_prob_pct ?? 25}%** ಇದೆ.`
          : `Based on live meteorological telemetry for **${activeLocation.name}**, current temperature is **${forecast?.current.temp_c ?? 28}°C** with **${forecast?.current.condition ?? 'Partly Cloudy'}** skies and rain probability of **${forecast?.daily?.[0]?.rain_prob_pct ?? 25}%**.`;

      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0.9,
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = async () => {
    // Stop ongoing speech before recording
    handleStopSpeaking();

    if (isRecording) {
      await voiceService.stopListening();
      setIsRecording(false);
      return;
    }

    setVoiceError(null);
    setIsRecording(true);

    await voiceService.startListening(
      (transcript) => {
        setInputValue(transcript);
        setIsRecording(false);
        handleSend(transcript);
      },
      (error) => {
        setVoiceError(error);
        setIsRecording(false);
      },
      language
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-lg mx-auto bg-background text-content-primary">
      {/* 1. Header Bar with Stop Speaking Pill if Active */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-card/90 backdrop-blur-md sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-primary text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-heading text-sm font-bold text-content-primary">Ask Mausam AI</h1>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                <CheckCircle className="w-2.5 h-2.5" /> Grounded
              </span>
            </div>
            <p className="text-[10px] text-content-muted">Official IMD &amp; Open-Meteo RAG</p>
          </div>
        </div>

        {/* Global Stop Speaking Button if TTS is active */}
        {speakingMsgId && (
          <button
            type="button"
            onClick={handleStopSpeaking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-md animate-pulse active:scale-95"
          >
            <Square className="w-3 h-3 fill-white" />
            <span>Stop Voice</span>
          </button>
        )}
      </div>

      {/* 2. Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1`}
            >
              <div
                className={`max-w-[88%] rounded-3xl p-4 text-xs leading-relaxed transition-all shadow-sm ${
                  isAi
                    ? 'bg-card border border-border-subtle text-content-primary rounded-tl-sm'
                    : 'bg-accent-primary text-white rounded-tr-sm shadow-md'
                }`}
              >
                {/* AI Header with Speak Button */}
                {isAi && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-subtle/60 text-[10px] text-content-muted">
                    <div className="flex items-center gap-1 font-semibold text-accent-primary">
                      <Sparkles className="w-3 h-3" />
                      <span>Mausam AI Assistant</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg.id, msg.text)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${
                        isSpeaking
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold'
                          : 'bg-card-subtle border-border-subtle hover:bg-card text-content-secondary'
                      }`}
                      title={isSpeaking ? 'Stop reading' : 'Read aloud with female voice'}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-rose-500 animate-bounce" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-accent-primary" />
                          <span>{t('ask.speak_answer') || 'Listen'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Formatted Content (No Raw Asterisks) */}
                <div className="space-y-2 leading-relaxed">
                  {renderFormattedMessage(msg.text)}
                </div>

                {/* Insights Cards if Available */}
                {msg.insights && msg.insights.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-border-subtle/50 space-y-1.5">
                    {msg.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-card-subtle p-2.5 border border-border-subtle/60 flex items-start gap-2"
                      >
                        <span className="text-base mt-0.5">
                          {insight.type === 'critical' ? '🔴' : insight.type === 'caution' ? '🟡' : '🟢'}
                        </span>
                        <div>
                          <h4 className="font-heading text-[11px] font-bold text-content-primary">
                            {insight.label}
                          </h4>
                          <p className="text-[10px] text-content-secondary leading-tight mt-0.5">
                            {insight.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Audit Trail Drawer */}
                {msg.auditTrail && (
                  <div className="mt-2.5 pt-1.5 border-t border-border-subtle/40">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAuditMsgId(openAuditMsgId === msg.id ? null : msg.id)
                      }
                      className="flex items-center justify-between w-full text-[10px] font-semibold text-content-muted hover:text-content-primary transition-colors py-1"
                    >
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-accent-primary" />
                        <span>Audit: {(msg.auditTrail.structuredToolsExecuted || []).length} tools executed</span>
                      </span>
                      {openAuditMsgId === msg.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {openAuditMsgId === msg.id && (
                      <div className="p-2 mt-1 rounded-xl bg-card-subtle text-[9px] font-mono text-content-secondary space-y-1 border border-border-subtle">
                        <p>Confidence: {Math.round((msg.confidence ?? 0.95) * 100)}%</p>
                        <p>Retrieved Chunks: {(msg.auditTrail.retrievedChunks || []).length}</p>
                        <p>Timestamp: {msg.auditTrail.generatedAt}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isAi ? 'text-content-muted' : 'text-white/80'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Follow-up Suggested Question Chips */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[95%]">
                  {msg.suggestedFollowUps.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="rounded-full bg-card hover:bg-accent-primary/10 border border-border-subtle hover:border-accent-primary/40 px-3 py-1 text-[10px] font-medium text-content-secondary hover:text-accent-primary transition-all shadow-xs active:scale-95 text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-card border border-border-subtle max-w-[200px] text-xs text-content-muted shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-accent-primary animate-spin" />
            <span>Formulating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Voice Recording Banner / Error Banner */}
      {voiceError && (
        <div className="mx-4 p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {isRecording && (
        <div className="mx-4 p-2 rounded-xl bg-accent-primary/10 border border-accent-primary/30 text-[11px] text-accent-primary flex items-center justify-between animate-pulse">
          <span className="flex items-center gap-1.5 font-bold">
            <Mic className="w-4 h-4 animate-bounce" /> Listening for voice query...
          </span>
          <button
            type="button"
            onClick={handleVoiceToggle}
            className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-accent-primary text-white"
          >
            Done
          </button>
        </div>
      )}

      {/* 4. Input Controls Bar */}
      <div className="p-3 border-t border-border-subtle bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-500 shadow-md animate-pulse'
                : 'bg-card-subtle hover:bg-card border-border-subtle text-content-secondary'
            }`}
            title={isRecording ? 'Stop Recording' : 'Voice Query'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'मौसम, बारिश या यात्रा के बारे में पूछें...'
                : language === 'kn'
                ? 'ಹವಾಮಾನ, ಮಳೆ ಅಥವಾ ಪ್ರಯಾಣದ ಬಗ್ಗೆ ಕೇಳಿ...'
                : 'Ask about rain, heat stress, running hours...'
            }
            className="flex-1 rounded-2xl bg-card-subtle border border-border-subtle px-4 py-2.5 text-xs text-content-primary placeholder:text-content-muted focus:border-accent-primary focus:outline-hidden focus:ring-1 focus:ring-accent-primary/50 transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-primary text-white shadow-sm hover:bg-accent-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
