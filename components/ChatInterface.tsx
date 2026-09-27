import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, Cpu, Sparkles, Trash2, Database } from 'lucide-react';

interface ChatInterfaceProps {
  onClose: () => void;
  userParams?: any;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose, userParams }) => {
  // 1. Initialize state from LocalStorage (Simulating Database)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
        const savedHistory = localStorage.getItem('cosmic_chat_db');
        if (savedHistory) {
            return JSON.parse(savedHistory);
        }
    } catch (e) {
        console.error("Failed to load chat database", e);
    }
    return [
      { role: 'model', text: 'COSMIC AI Interface Initialized. Accessing Near-Earth Object database... \n\nGreetings, Explorer. I am ready to process your queries regarding asteroid trajectories, collision risks, and celestial composition. How may I assist you?' }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  // 2. Persist to LocalStorage whenever messages change
  useEffect(() => {
      localStorage.setItem('cosmic_chat_db', JSON.stringify(messages));
      scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const userMsg = input.trim();
    if (!userMsg || isLoading) return;

    const history = messages
      .filter((message) => !message.isStreaming && message.text.trim())
      .slice(-10)
      .map(({ role, text }) => ({ role, text }));

    setInput('');
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMsg },
      { role: 'model', text: '', isStreaming: true },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'COSMIC AI service is unavailable.');

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'model',
          text: data.text || 'Telemetry returned no readable response.',
          isStreaming: false,
        };
        return next;
      });
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => {
        const next = [...prev];
        if (next[next.length - 1]?.isStreaming) next.pop();
        return [
          ...next,
          {
            role: 'model',
            text: error instanceof Error
              ? `Neural Link error: ${error.message}`
              : 'Neural Link interrupted. Please retry the uplink.',
          },
        ];
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    const resetMessage: Message = {
      role: 'model',
      text: 'COSMIC AI Interface Reset. Local conversation memory cleared. Ready for new input.',
    };
    setMessages([resetMessage]);
    localStorage.removeItem('cosmic_chat_db');
  };

  // Simple Markdown Parser for Bold and Lists
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
        // List Item detection
        const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ');
        const cleanLine = isListItem ? line.trim().substring(2) : line;

        // Bold detection (**bold**)
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

        return (
            <div key={i} className={`min-h-[1.2em] ${isListItem ? 'pl-4 flex items-start' : 'mb-1'}`}>
                {isListItem && (
                    <span className="mr-2 text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 block" />
                )}
                <span className={isListItem ? 'flex-1' : ''}>
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-cyan-300 font-bold">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </span>
            </div>
        );
    });
  };

  return (
    <>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={onClose}
        />
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[600px] h-[80vh] bg-black/90 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] z-[90] flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                        <Bot className="text-cyan-400" size={20} />
                    </div>
                    <div>
                        <h3 className="font-mono font-bold text-cyan-50 tracking-wider">COSMIC AI CORE</h3>
                        <div className="flex items-center gap-2 text-[10px] text-cyan-400/60 uppercase">
                            <Database size={10} className="text-cyan-400" />
                            <span>History Synced</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleClearChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400/50 hover:text-cyan-400" title="Reset Chat Database">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400/50 hover:text-cyan-400">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                {messages.map((msg, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                            msg.role === 'user' 
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        }`}>
                            {msg.role === 'user' ? <Sparkles size={14} /> : <Cpu size={14} />}
                        </div>
                        
                        <div className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed font-mono ${
                            msg.role === 'user'
                                ? 'bg-purple-500/10 border border-purple-500/20 text-purple-100'
                                : 'bg-cyan-950/30 border border-cyan-500/20 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                        }`}>
                            {renderMessageText(msg.text)}
                            
                            {msg.isStreaming && msg.text.length === 0 && (
                                <div className="flex gap-1 mt-1">
                                    <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            )}
                            {msg.isStreaming && msg.text.length > 0 && (
                                <span className="inline-block w-2 h-4 ml-1 bg-cyan-400/50 animate-pulse align-middle" />
                            )}
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-cyan-500/20 bg-black/40 backdrop-blur-md">
                <div className="relative">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter query regarding celestial objects..."
                        className="w-full bg-cyan-950/20 border border-cyan-500/30 rounded-xl pl-4 pr-12 py-4 text-sm font-mono text-cyan-100 placeholder-cyan-700/50 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Cpu size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </form>
        </motion.div>
    </>
  );
};