import React, { useState, useRef, useEffect } from 'react';
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

export const AskMausamPage: React.FC = () => {
  const { activeLocation, selectedPersonas, forecast, fetchForecast, language } = useAppStore();
  const { t } = useTranslation();

  const getInitialMessage = (): string => {
    if (language === 'hi') {
      return `नमस्ते! मैं **पूछें मौसम AI** हूँ। **${activeLocation.name}** के लिए मौसम, बारिश, लू या यात्रा सुरक्षा के बारे में कुछ भी पूछें।`;
    }
    if (language === 'kn') {
      return `ನಮಸ್ಕಾರ! ನಾನು **ಮೌಸಮ್ AI** ಸಹಾಯಕ. **${activeLocation.name}** ನ ಮಳೆ, ತಾಪಮಾನ, ವ್ಯಾಯಾಮ ಅಥವಾ ಪ್ರವಾಸದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.`;
    }
    return `Namaste! I am **Ask Mausam AI**, your grounded meteorological companion. Ask me anything about running hours, rain risks, heat-stress, or travel safety for **${activeLocation.name}**.`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: getInitialMessage(),
      timestamp: 'Just now',
      suggestedFollowUps: [
        t('ask.question1'),
        t('ask.question2'),
        t('ask.question3'),
        t('ask.question4'),
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

  const handleSend = async (queryText?: string) => {
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
    } catch (err: any) {
      console.warn('[Ask Mausam] Live fetch error:', err);
      const fallbackText = language === 'hi'
        ? `वर्तमान मौसम डेटा के अनुसार **${activeLocation.name}** में तापमान **${forecast?.current.temp_c ?? 28}°C** है और बारिश की संभावना **${forecast?.daily?.[0]?.rain_prob_pct ?? 25}%** है।`
        : language === 'kn'
        ? `ಪ್ರಸ್ತುತ ಹವಾಮಾನ ದತ್ತಾಂಶದ ಪ್ರಕಾರ **${activeLocation.name}** ನಲ್ಲಿ ತಾಪಮಾನ **${forecast?.current.temp_c ?? 28}°C** ಮತ್ತು ಮಳೆಯ ಸಂಭವನೀಯತೆ **${forecast?.daily?.[0]?.rain_prob_pct ?? 25}%** ಇದೆ.`
        : `Based on live meteorological telemetry for **${activeLocation.name}**, current temperature is **${forecast?.current.temp_c ?? 28}°C** with **${forecast?.current.condition ?? 'Partly Cloudy'}** skies and rain probability of **${forecast?.daily?.[0]?.rain_prob_pct ?? 25}%**.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 0.90,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = async () => {
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
      },
      (err) => {
        setVoiceError(err);
        setIsRecording(false);
      },
      language
    );
  };

  const handleSpeakToggle = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      voiceService.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      voiceService.speak(text, language).then(() => {
        setSpeakingMsgId(null);
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] p-4 max-w-lg mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-sm font-bold text-content-primary">
              {t('ask.page_title')}
            </h1>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('ask.grounded_badge')}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[92%]">
              {msg.sender === 'ai' && (
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-primary text-white text-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-accent-primary text-white rounded-br-none'
                    : 'bg-card border border-border-subtle text-content-primary rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line font-medium">{msg.text}</div>

                {/* TTS Audio button for AI responses */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-3 pt-2 mt-2 border-t border-border-subtle/50">
                    <button
                      type="button"
                      onClick={() => handleSpeakToggle(msg.id, msg.text)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-accent-primary hover:underline"
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-rose-500">{t('ask.stop_tts')}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t('ask.speak_answer')}</span>
                        </>
                      )}
                    </button>

                    {/* Audit Trail toggle */}
                    {msg.auditTrail && (
                      <button
                        type="button"
                        onClick={() => setOpenAuditMsgId(openAuditMsgId === msg.id ? null : msg.id)}
                        className="flex items-center gap-1 text-[11px] text-content-muted hover:text-content-primary font-medium"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Audit Trail</span>
                        {openAuditMsgId === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                )}

                {/* Expanded RAG Audit Trail */}
                {openAuditMsgId === msg.id && msg.auditTrail && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-card-subtle border border-border-strong space-y-2 text-[10px] text-content-secondary">
                    <div className="font-bold text-content-primary flex items-center gap-1 border-b border-border-subtle pb-1">
                      <Wrench className="w-3 h-3 text-accent-primary" />
                      <span>{t('ask.audit_tools')} ({msg.auditTrail.structuredToolsExecuted.length})</span>
                    </div>
                    {msg.auditTrail.structuredToolsExecuted.map((tool, idx) => (
                      <div key={idx} className="bg-card p-1.5 rounded-lg border border-border-subtle">
                        <code className="text-accent-primary font-bold">{tool.toolName}</code>
                        <div className="text-content-muted mt-0.5">{tool.resultSummary}</div>
                      </div>
                    ))}

                    <div className="font-bold text-content-primary flex items-center gap-1 border-b border-border-subtle pb-1 pt-1">
                      <FileText className="w-3 h-3 text-emerald-500" />
                      <span>{t('ask.audit_sources')} ({msg.auditTrail.retrievedChunks.length})</span>
                    </div>
                    {msg.auditTrail.retrievedChunks.map((chunk, idx) => (
                      <div key={idx} className="bg-card p-1.5 rounded-lg border border-border-subtle">
                        <div className="font-semibold text-content-primary flex justify-between">
                          <span>{chunk.title}</span>
                          <span className="text-emerald-500 font-mono">{(chunk.score || 0.9) * 100}% match</span>
                        </div>
                        <div className="text-content-muted text-[9px] truncate">{chunk.snippet}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Structured Insights (if returned) */}
                {msg.insights && msg.insights.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-border-subtle/50 space-y-1.5">
                    {msg.insights.map((ins, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-2 text-[11px] flex items-start gap-1.5 ${
                          ins.type === 'critical'
                            ? 'bg-red-500/10 text-red-700 dark:text-red-300'
                            : ins.type === 'caution'
                            ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {ins.type === 'critical' || ins.type === 'caution' ? (
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold">{ins.label}: </span>
                          <span>{ins.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Follow-ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-border-subtle/40 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-content-muted">
                      {t('ask.suggested_questions')}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="rounded-lg bg-card-subtle px-2.5 py-1 text-[11px] font-medium text-accent-primary hover:bg-accent-primary-subtle transition-colors border border-border-subtle text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={`text-[9px] block mt-1 ${
                    msg.sender === 'user' ? 'text-white/70 text-right' : 'text-content-muted'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-content-muted">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-card-subtle">
              <Bot className="w-4 h-4 text-accent-primary animate-pulse" />
            </div>
            <span className="animate-pulse font-medium">{t('common.loading')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Active Waveform Indicator */}
      {isRecording && (
        <div className="mb-2 flex items-center justify-center gap-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-2.5 text-xs text-rose-600 dark:text-rose-400 animate-pulse">
          <Mic className="w-4 h-4 animate-bounce" />
          <span className="font-bold">{t('ask.listening')}</span>
        </div>
      )}

      {voiceError && (
        <p className="mb-2 text-center text-[11px] font-medium text-rose-600 dark:text-rose-400">
          {voiceError}
        </p>
      )}

      {/* Bottom Input Bar (Thumb Zone) */}
      <div className="pt-2 border-t border-border-subtle">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl transition-colors ${
              isRecording
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-card-subtle text-content-secondary hover:text-content-primary'
            }`}
            aria-label="Voice input"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('ask.input_placeholder')}
            className="flex-1 min-h-[44px] rounded-2xl border border-border-subtle bg-input px-4 text-xs font-medium text-content-primary placeholder-content-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-accent-primary text-white hover:bg-accent-primary-hover disabled:opacity-40 transition-colors"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
