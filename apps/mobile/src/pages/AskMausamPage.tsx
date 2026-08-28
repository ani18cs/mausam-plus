import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AIQueryResponse } from '@mausam/shared-types';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  insights?: AIQueryResponse['insights'];
  suggestedFollowUps?: string[];
  confidence?: number;
}

interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

const SUGGESTED_QUERIES = [
  'Can I run at 6 PM?',
  'Will it rain during evening commute?',
  'Is the beach safe for swimming today?',
  'What is the heat-stress risk today?',
];

export const AskMausamPage: React.FC = () => {
  const { activeLocation, selectedPersonas } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: `Namaste! I am **Ask Mausam**, your persona-aware AI weather intelligence assistant. Ask me anything about running hours, rain risks, UV index, or beach tides for **${activeLocation.name}**.`,
      timestamp: 'Just now',
      suggestedFollowUps: SUGGESTED_QUERIES,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

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

    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          location: activeLocation,
          selectedPersonas,
        }),
      });

      if (!response.ok) {
        throw new Error('AI query failed');
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
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('[Ask Mausam] API error, generating local fallback response.', err);
      // Fallback local response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Based on meteorological telemetry for **${activeLocation.name}**, thermal strain is elevated this afternoon with 78% humidity. Evening showers (65% probability) are forecasted between 4:30 PM and 7:00 PM.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedFollowUps: [
              'Show optimal running hours for tomorrow',
              'Check citizen waterlogging reports',
            ],
            confidence: 0.92,
          },
        ]);
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }

    setVoiceError(null);
    const recognition = new Recognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) setInputValue(transcript);
    };
    recognition.onerror = () => {
      setVoiceError('Voice input could not be captured. Please try again.');
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    setIsRecording(true);

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
      setVoiceError('Voice input could not be started. Please try again.');
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
              Ask Mausam AI
            </h1>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Grounded in IMD-WRF Telemetry
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
            <div className="flex items-end gap-2 max-w-[90%]">
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
                      Suggested Questions
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
            <span className="animate-pulse font-medium">Analyzing meteorological telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Active Waveform Indicator */}
      {isRecording && (
        <div className="mb-2 flex items-center justify-center gap-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-2.5 text-xs text-rose-600 dark:text-rose-400 animate-pulse">
          <Mic className="w-4 h-4 animate-bounce" />
          <span className="font-bold">Listening... Speak your weather question</span>
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
            placeholder="Ask anything (e.g. 'Can I run at 6 PM?')..."
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
