/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';

interface AiChatProps {
  imageId: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
}

export default function AiChat({ imageId, messages, onSendMessage, isSending }: AiChatProps) {
  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll chat logs to the bottom on new message additions
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/45 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header telemetry hud */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <h2 className="font-display font-bold text-sm tracking-wide text-slate-100 uppercase flex items-center gap-1.5">
            AI deductive profiling partner
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </h2>
        </div>
        <span className="font-mono text-[9px] bg-emerald-950/20 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-900/40 uppercase tracking-widest font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          SANDBOX SECURE COMS
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[360px] min-h-[220px]">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isModel ? 'mr-auto items-start' : 'ml-auto items-end'}`}
            >
              {/* Sender signature info */}
              <div className="font-mono text-[9px] text-slate-500 mb-1 px-1">
                {isModel ? 'ANALYSIS CLIENT' : 'INTELLIGENCE OPERATIVE'} •{' '}
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>

              {/* Speech bubble */}
              <div
                className={`p-3 rounded-2xl text-[12px] leading-relaxed font-sans ${
                  isModel
                    ? 'bg-slate-950/80 text-slate-200 border border-slate-800/50 rounded-tl-sm'
                    : 'bg-emerald-600 border border-emerald-500 text-white rounded-tr-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 mr-auto text-xs text-emerald-400 font-mono mt-1 pl-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting orbital and architectural database index...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray Form */}
      <form onSubmit={handleSubmit} className="p-3.5 border-t border-slate-800/50 bg-slate-950/20 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          placeholder="Type visual questions (e.g. 'What vegetation types are there?')..."
          id="chat-input"
          className="flex-1 bg-slate-950/90 border border-slate-850 text-xs px-3.5 py-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          id="btn-chat-send"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-950/20 disabled:opacity-50 disabled:hover:bg-emerald-600"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
