import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Database,
  Code2,
  FileSpreadsheet,
  BarChart3,
  Bot,
  User,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

export const AIAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, setIsAiDrawerOpen, selectedDay, curriculum } = useApp();
  const currentDayData = curriculum.find(c => c.day === selectedDay) || curriculum[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: `Hello! I am your AI Learning Coach for the 12-Day Data Analytics Certified Workshop. We are currently reviewing Day ${currentDayData.day}: ${currentDayData.title}. How can I assist you with SQL queries, Python data cleaning, Excel formulas, or Power BI DAX today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isAiDrawerOpen) return null;

  const handleSendMessage = async (promptToSend?: string) => {
    const query = promptToSend || inputText;
    if (!query.trim() || loading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', text: query }];
    setMessages(newMsgs);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          context: `Current workshop day: Day ${currentDayData.day} (${currentDayData.title}). Domain: ${currentDayData.domain}. Learning Objective: ${currentDayData.learningObjective}.`
        })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages([...newMsgs, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages([
          ...newMsgs,
          {
            role: 'assistant',
            text: 'I apologize, but I could not reach the Gemini AI model right now. In Data Analytics, remember to break down complex queries into CTEs and verify column data types first!'
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: 'Network connection error. As an analytical tip: When calculating retention, always anchor customer sign-up date in a CTE first before grouping by month difference!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    `Explain the difference between WHERE and HAVING in SQL`,
    `How does CALCULATE() perform context transition in DAX?`,
    `Show me a Python Pandas script to impute missing revenue with median`,
    `What are the 3 golden rules of executive dashboard design?`
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col text-left">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Gemini AI Learning Coach</span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextual Tutor for Day {currentDayData.day}</p>
          </div>
        </div>

        <button
          onClick={() => setIsAiDrawerOpen(false)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cheating Guardrail Banner (Section 25) */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Cheating Guardrails: Explains syntax & concepts, gives hints, but will not write answers for active quiz exams.</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((m, idx) => {
          const isAI = m.role === 'assistant';
          return (
            <div key={idx} className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}>
              {isAI && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  isAI
                    ? 'bg-slate-800 border border-slate-700 text-slate-200'
                    : 'bg-indigo-600 text-white rounded-br-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
              {!isAI && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 text-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Synthesizing analytical explanation...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggested Prompt Pills */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Suggested Questions:</p>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-750 transition truncate max-w-full text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask about SQL, Python, DAX, formulas..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
