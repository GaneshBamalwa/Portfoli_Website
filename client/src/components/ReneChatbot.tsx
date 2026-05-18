import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Sparkles, SendHorizontal } from 'lucide-react';

interface Message {
  role: 'user' | 'rene';
  content: string;
  timestamp: string;
}

import { useAtom } from 'jotai';
import { reneChatOpenAtom, activeChapterAtom } from '@/lib/atoms';
import { sendReneMessage } from '@/lib/reneApi';

export function ReneLauncher({ onClick, className, style }: { onClick: () => void; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-between gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-[#050505]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer text-white relative group ${className || ''}`}
      style={{
        boxShadow: '0 0 20px rgba(212,175,55,0.06), inset 0 0 10px rgba(255,255,255,0.03)',
        ...style
      }}
    >
      {/* Symmetric left container for perfect text centering */}
      <div className="w-6 h-6 flex items-center justify-center select-none">
        <div className="relative w-1.5 h-1.5 flex items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent/40 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
        </div>
      </div>

      <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-medium text-white/90 group-hover:text-accent transition-colors duration-300 text-center flex-1 leading-none flex items-center justify-center -mt-[1px]">
        Talk to Réne
      </span>
      
      {/* Right container */}
      <div className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-300 select-none">
        <MessageSquare className="w-3 h-3" />
      </div>
    </motion.button>
  );
}

export function ReneChatbot() {
  const [isOpen, setIsOpen] = useAtom(reneChatOpenAtom);
  const [activeChapter] = useAtom(activeChapterAtom);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Pre-programmed client-side cached high-fidelity answers to guarantee instant, recruiter-grade, robust offline operation.
  const PRE_PROGRAMMED_ANSWERS: Record<string, string> = {
    "Tell me about the ATLAS Agentic AI platform.": 
      "**ATLAS** is a production-grade Agentic AI Orchestration and sandbox execution platform.\n\n" +
      "Key engineering achievements include:\n" +
      "- **Isolated Executions**: Built secure, isolated Dockerized container sandboxes for running autonomous agent scripts.\n" +
      "- **DAG Planner**: Designed a dynamic Directed Acyclic Graph (DAG) executor to handle parallel sub-agent task dependency planning.\n" +
      "- **Tech Stack**: Engineered using **FastAPI**, **React 19**, **Tailwind CSS**, and **Pydantic v2** validation.\n" +
      "- **Real-time Monitoring**: Integrated WebSocket streams for live log feeds and execution metric tracking.\n\n" +
      "It demonstrates Ganesh's capability to architect high-reliability, event-driven agentic architectures.",

    "Tell me about the Samsung PRISM victory.":
      "Ganesh won the prestigious **Samsung PRISM Certificate of Excellence** (1st Place equivalent) for pioneering work on AI intelligence.\n\n" +
      "Highlights of the project include:\n" +
      "- **Advanced AI Models**: Researched and implemented computer vision and language reasoning models tailored for enterprise applications.\n" +
      "- **Performance Optimization**: Reduced inference latency by **35%** through model pruning, quantization, and optimized memory management.\n" +
      "- **Collaboration**: Collaborated directly with Samsung research engineers to transition laboratory models into viable production features.\n\n" +
      "This recognition highlights his strong foundation in research, academic excellence, and high-impact industrial machine learning.",

    "Explain the Nexora support platform technologies.":
      "**Nexora** is an enterprise-grade support ticketing and analytics hub engineered for scale.\n\n" +
      "Technical details of the implementation:\n" +
      "- **Hybrid Storage**: Configured a high-performance **PostgreSQL** relational schema for transactional integrity paired with **MongoDB** for unstructured event tracking.\n" +
      "- **Real-time Updates**: Hooked up Redis-backed **WebSocket** channels to synchronize active dashboard tickets and metrics instantly across active clients.\n" +
      "- **Frontend Experience**: Built with a dark glassmorphic design utilizing React, Framer Motion, and Tailwind CSS.\n\n" +
      "It highlights his proficiency in database design, real-time synchronization, and premium user-experience aesthetics.",

    "What programming languages and AI engineering skills does Ganesh excel in?":
      "Ganesh possesses a robust and highly specialized technical profile:\n\n" +
      "**Core Programming Languages**:\n" +
      "- **Python**: Highly proficient in asynchronous systems (asyncio, FastAPI, Pydantic, HTTPX).\n" +
      "- **TypeScript/JavaScript**: Full-stack expertise (React 19, Next.js, Node.js, Express).\n" +
      "- **Systems**: Proficient in **C++** and highly optimized **SQL** design.\n\n" +
      "**AI & Agentic Engineering**:\n" +
      "- LLM integration (OpenAI, Groq, Mistral, OpenRouter API gateways).\n" +
      "- Model Context Protocol (MCP) servers, tool use abstractions, and vectorized semantic searches.\n\n" +
      "**DevOps & Infrastructure**:\n" +
      "- Docker containerization, Redis caching, Linux shell scripting, and CI/CD pipelines.",

    "What role is Ganesh looking for and when does he graduate?":
      "Ganesh is actively seeking roles as a **Software Engineer (SWE)**, **AI Systems Engineer**, or **Full-Stack Systems Architect**.\n\n" +
      "Key highlights:\n" +
      "- **Academic Readiness**: Graduating soon with excellent academic standing.\n" +
      "- **Availability**: Ready to join high-performing engineering teams immediately and contribute production-grade code from day one.\n" +
      "- **Ideal Fit**: Perfect for teams seeking an engineer with a deep passion for AI, systems architecture, and pixel-perfect premium UI design."
  };

  // Suggested quick-reply options to engage recruiters instantly (PRISM and ATLAS isolated)
  const SUGGESTED_QUERIES = [
    { label: 'ATLAS Platform', text: 'Tell me about the ATLAS Agentic AI platform.' },
    { label: 'Samsung PRISM', text: 'Tell me about the Samsung PRISM victory.' },
    { label: 'Nexora Portal', text: 'Explain the Nexora support platform technologies.' },
    { label: 'Technical Stack', text: 'What programming languages and AI engineering skills does Ganesh excel in?' },
    { label: 'Career Goals', text: 'What role is Ganesh looking for and when does he graduate?' }
  ];

  // Initialize with welcome introduction on mount
  useEffect(() => {
    const introMessage: Message = {
      role: 'rene',
      content: "Hello! I am **Réne**, Ganesh Bamalwa's conversational AI portfolio assistant.\n\nI can answer questions regarding his engineering projects, technical stack, Samsung PRISM achievement, and core computer science competencies. How can I help you evaluate his work today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([introMessage]);
  }, []);

  const saveChatHistory = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
  };

  // Keep scroll focused at bottom of dialogue list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Prevent parent/body background scrolling when the chat overlay modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
    };
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    saveChatHistory(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await sendReneMessage(trimmed);
      const reneMsg: Message = {
        role: 'rene',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      saveChatHistory([...newHistory, reneMsg]);
    } catch (error) {
      console.error('Failed to receive response from René AI:', error);
      const errMsg: Message = {
        role: 'rene',
        content: "Réne is temporarily unavailable right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatHistory([...newHistory, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe custom Markdown formatter supporting bold (**bold**), list indentation, and paragraphs
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmedLine = line.trim();
      if (!trimmedLine) return <div key={idx} className="h-2" />;

      // Bullet check
      const isBullet = line.startsWith('- ') || line.startsWith('* ');
      if (isBullet) {
        trimmedLine = trimmedLine.replace(/^[\s]*[-*]\s+/, '');
      }

      // Parse bold segments
      const regex = /(\*\*.*?\*\*)/g;
      const parts = trimmedLine.split(regex);
      const parsedElements = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="text-accent font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={idx} className="ml-5 list-disc text-[13px] md:text-sm text-white/90 leading-relaxed my-1">
            {parsedElements}
          </li>
        );
      }

      return (
        <p key={idx} className="text-[13px] md:text-sm text-white/90 leading-relaxed my-1.5">
          {parsedElements}
        </p>
      );
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputMessage);
    }
  };

  const clearChatContext = () => {
    try {
      sessionStorage.removeItem('rene_chat_history');
      const introMessage: Message = {
        role: 'rene',
        content: "Hello! I am **Réne**, Ganesh Bamalwa's conversational AI portfolio assistant.\n\nI can answer questions regarding his engineering projects, technical stack, Samsung PRISM achievement, and core computer science competencies. How can I help you evaluate his work today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([introMessage]);
    } catch (e) {}
  };

  return (
    <>
      {/* ── Premium Floating Status Badge (Launcher) ──────────────── */}
      {!isOpen && activeChapter > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-[9900]"
        >
          <ReneLauncher onClick={() => setIsOpen(true)} />
        </motion.div>
      )}

      {/* ── Interactive Chat Viewport Modal Overlay ───────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 select-text overflow-hidden">
            {/* Backdrop Blur Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#020202]/85 backdrop-blur-xl"
            />

            {/* Chat Modal Interface */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full h-full md:h-[80vh] md:max-w-3xl bg-[#090909]/90 border-0 md:border border-white/[0.07] md:rounded-2xl flex flex-col overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
              style={{
                boxShadow: '0 0 50px rgba(212,175,55,0.02), inset 0 0 25px rgba(255,255,255,0.01)',
              }}
            >
              {/* Header section */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4 bg-[#0c0c0c]/80 backdrop-blur-md z-10 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base uppercase tracking-[0.2em] font-semibold text-white flex items-center gap-2 leading-none">
                      Réne
                      <span className="inline-flex w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    </h2>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/35 font-mono">
                      AI Portfolio Coordinator
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={clearChatContext}
                    className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/30 hover:text-accent transition-colors duration-300 pointer-events-auto cursor-pointer"
                    title="Clear conversation history"
                  >
                    Reset Chat
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all pointer-events-auto cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat dialogue stream */}
              <div 
                className="flex-1 overflow-y-auto px-6 py-6 space-y-6 rene-scrollbar select-text"
                style={{ overscrollBehavior: 'contain' }}
              >
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 border select-text ${
                          isUser
                            ? 'bg-[#151515]/80 border-white/[0.08] text-white rounded-tr-none'
                            : 'bg-[#0f0f0f]/90 border-white/[0.04] text-white rounded-tl-none'
                        }`}
                        style={{
                          boxShadow: isUser 
                            ? '0 4px 20px rgba(0,0,0,0.2)'
                            : '0 4px 20px rgba(0,0,0,0.3), inset 0 0 10px rgba(255,255,255,0.01)',
                        }}
                      >
                        {/* Message content parsed for markdown */}
                        <div className="select-text space-y-1">
                          {renderFormattedText(msg.content)}
                        </div>

                        {/* Message Timestamp */}
                        <div className="flex items-center justify-end mt-2 select-none">
                          <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-white/20">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Loading typing dot indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start items-center gap-3 w-full"
                  >
                    <div className="bg-[#0f0f0f]/90 border border-white/[0.04] rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-3 shadow-lg">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
                        Réne is drafting response
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom control quick replies */}
              {messages.length === 1 && (
                <div className="px-6 pb-2 select-none z-10">
                  <div className="text-[9px] uppercase tracking-[0.25em] text-white/25 mb-2 font-mono">
                    Suggested Inquiries
                  </div>
                  <div className="flex flex-wrap gap-2 pointer-events-auto">
                    {SUGGESTED_QUERIES.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q.text)}
                        className="text-[10px] md:text-xs px-3 py-1.5 rounded-full border border-white/[0.04] bg-[#0c0c0c] hover:bg-[#151515] hover:border-accent/40 hover:text-accent transition-all duration-300 cursor-pointer"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input controller */}
              <div className="border-t border-white/[0.06] p-4 bg-[#080808]/90 backdrop-blur-md flex items-center gap-3 pointer-events-auto z-10">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Réne about his technical work..."
                  disabled={isLoading}
                  className="flex-1 bg-[#0d0d0d] border border-white/[0.06] focus:border-accent/45 focus:outline-none rounded-xl px-5 py-3.5 text-xs md:text-sm text-white placeholder-white/25 transition-all duration-300 font-sans tracking-[0.03em]"
                />
                <button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={isLoading || !inputMessage.trim()}
                  className="w-11 h-11 rounded-xl bg-accent border border-accent/20 flex items-center justify-center text-black hover:bg-white hover:border-white/30 disabled:opacity-20 disabled:hover:bg-accent disabled:hover:text-black transition-all cursor-pointer shadow-lg"
                >
                  <SendHorizontal className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ReneChatbot;
