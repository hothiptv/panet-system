/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Settings, X, Moon, Sun, Save } from 'lucide-react';
import { getPanetResponse } from './services/geminiService';
import { Message, Role } from './types';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: Role.MODEL,
      text: 'Chào bạn! Mình là Panet. Hôm nay mình có thể giúp gì cho bạn?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('Tên của bạn là Panet. Bạn là một trợ lý AI thông minh, thân thiện và hữu ích. Hãy trả lời ngắn gọn, súc tích bằng tiếng Việt.');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize theme from system or preference
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const history = messages.map((msg) => ({
      role: msg.role === Role.USER ? 'user' as const : 'model' as const,
      parts: [{ text: msg.text }],
    }));

    const responseText = await getPanetResponse(userMessage.text, history, systemPrompt);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: Role.MODEL,
      text: responseText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className={`relative flex flex-col h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-zinc-950 text-white' : 'bg-white text-gray-800'}`}>
      {/* Google "Thinking" Border Effect */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] animate-gradient-x" />
            <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-[#34A853] via-[#4285F4] via-[#EA4335] to-[#FBBC05] animate-gradient-y" />
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FBBC05] via-[#34A853] via-[#4285F4] to-[#EA4335] animate-gradient-x" />
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#EA4335] via-[#FBBC05] via-[#34A853] to-[#4285F4] animate-gradient-y" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 border-[6px] border-transparent rounded-lg mix-blend-overlay opacity-30 shadow-[0_0_40px_rgba(66,133,244,0.5)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optimized Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: isTyping ? [0, 40, -40, 0] : [0, 20, -20, 0],
            y: isTyping ? [0, -40, 40, 0] : [0, -20, 20, 0],
          }}
          transition={{ duration: isTyping ? 6 : 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-[80px] will-change-transform"
        />
        <motion.div
          animate={{
            x: isTyping ? [0, -50, 50, 0] : [0, -25, 25, 0],
            y: isTyping ? [0, 50, -50, 0] : [0, 25, -25, 0],
          }}
          transition={{ duration: isTyping ? 8 : 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#34A853]/10 rounded-full blur-[80px] will-change-transform"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FBBC05]/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className={`flex items-center justify-between px-6 py-4 backdrop-blur-md border-b shadow-sm z-10 transition-colors ${darkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#4285F4]" />
            <div className="w-3 h-3 rounded-full bg-[#EA4335]" />
            <div className="w-3 h-3 rounded-full bg-[#FBBC05]" />
            <div className="w-3 h-3 rounded-full bg-[#34A853]" />
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853] bg-clip-text text-transparent">Panet</h1>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <Settings size={24} />
        </button>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-md rounded-3xl shadow-2xl p-6 ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-gray-800'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="text-[#4285F4]" size={20} />
                  Cài đặt
                </h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon size={20} className="text-[#4285F4]" /> : <Sun size={20} className="text-[#FBBC05]" />}
                    <span className="font-medium">Chế độ tối</span>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-[#4285F4]' : 'bg-gray-300'}`}
                  >
                    <motion.div 
                      animate={{ x: darkMode ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                {/* System Prompt Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                    System Instruction (Cấu hình AI)
                  </label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={4}
                    className={`w-full p-4 rounded-2xl border transition-all focus:ring-2 focus:ring-[#4285F4] outline-none text-sm leading-relaxed ${
                      darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                    placeholder="Ví dụ: Bạn là một chuyên gia nấu ăn..."
                  />
                  <p className="text-[10px] text-gray-400 italic px-1">
                    Thiết lập cách Panet hành xử và trả lời.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 py-4 bg-[#4285F4] text-white rounded-2xl font-bold shadow-lg shadow-[#4285F4]/30 hover:bg-[#3367D6] transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Lưu cài đặt
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide z-1 relative"
        id="chat-viewport"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              id={`msg-${message.id}`}
              key={message.id}
              initial={{ 
                opacity: 0, 
                y: message.role === Role.USER ? 200 : 30, 
                scale: 0.3,
                x: message.role === Role.USER ? 50 : -20,
                filter: message.role === Role.MODEL ? 'blur(10px)' : 'blur(0px)'
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                x: 0,
                filter: 'blur(0px)'
              }}
              transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 25,
                mass: 1
              }}
              className={`flex will-change-transform ${message.role === Role.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${message.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                    message.role === Role.USER ? 'bg-[#4285F4] text-white' : (darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-white border border-gray-100 text-gray-600')
                  }`}
                >
                  {message.role === Role.USER ? <User size={20} /> : <Bot size={20} />}
                </motion.div>

                {/* Bubble */}
                <div className={`relative px-5 py-4 rounded-3xl shadow-lg text-sm md:text-base leading-relaxed break-words border transition-colors will-change-transform ${
                  message.role === Role.USER 
                    ? 'bg-[#4285F4] text-white rounded-tr-sm border-white/10 shadow-[#4285F4]/20' 
                    : (darkMode ? 'bg-zinc-900 backdrop-blur-sm text-zinc-200 rounded-tl-sm border-zinc-800 shadow-black/20' : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-tl-sm border-gray-100 shadow-gray-200/50')
                }`}>
                  {message.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start items-center gap-3 text-gray-500 font-medium text-sm pl-2"
          >
            <div className={`flex gap-1.5 p-3 rounded-2xl shadow-sm border transition-colors ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white/50 backdrop-blur-sm border-gray-100'}`}>
              <motion.div 
                animate={{ y: [0, -4, 0] }} 
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-2 h-2 rounded-full bg-[#4285F4]" 
              />
              <motion.div 
                animate={{ y: [0, -4, 0] }} 
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                className="w-2 h-2 rounded-full bg-[#EA4335]" 
              />
              <motion.div 
                animate={{ y: [0, -4, 0] }} 
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                className="w-2 h-2 rounded-full bg-[#FBBC05]" 
              />
            </div>
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={darkMode ? 'text-zinc-400' : 'text-gray-500'}
            >
              Panet đang trả lời...
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className={`p-6 border-t backdrop-blur-md relative z-10 transition-colors ${darkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-gray-100'}`}>
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative flex items-center gap-2"
        >
          <div className="w-full relative">
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={isTyping ? "Đang chờ Panet..." : "Hỏi Panet bất cứ điều gì..."}
              className={`w-full pl-6 pr-16 py-5 rounded-full shadow-inner focus:outline-none focus:border-[#4285F4] transition-all text-lg opacity-100 border ${
                darkMode ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 active:bg-zinc-800' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              } disabled:opacity-50`}
            />
            <button
              id="send-button"
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all flex items-center justify-center ${
                !input.trim() || isTyping 
                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#4285F4] text-white hover:bg-[#3367D6] shadow-lg shadow-[#4285F4]/30 hover:scale-105 active:scale-95'
              }`}
            >
              {isTyping ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center gap-4 mt-4 opacity-50">
          <div className={`h-px flex-1 max-w-[60px] ${darkMode ? 'bg-zinc-800' : 'bg-gray-300'}`} />
          <p className={`text-[10px] uppercase tracking-widest font-semibold ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
            Panet AI
          </p>
          <div className={`h-px flex-1 max-w-[60px] ${darkMode ? 'bg-zinc-800' : 'bg-gray-300'}`} />
        </div>
      </div>
    </div>
  );
}

