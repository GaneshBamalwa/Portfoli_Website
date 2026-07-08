import { forwardRef, memo } from 'react';

const MoreProjectsSection = forwardRef<HTMLElement>(function MoreProjectsSection(_, ref) {
  return (
    <section
      id="chapter-more-projects"
      ref={ref}
      className="relative w-full min-h-screen py-12 md:py-32 flex items-center justify-center bg-[#050505] border-t border-white/5 px-4"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="max-w-6xl mx-auto w-full md:px-16 lg:px-24">
        <div className="text-left mb-16">
          <span className="text-xs font-light uppercase tracking-[0.35em] text-accent mb-3 block">
            03 // MORE PROJECTS
          </span>
          <h2
            className="text-4xl md:text-6xl font-light tracking-tight text-white uppercase"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Further Explorations
          </h2>
          <p className="text-sm md:text-base text-white/40 mt-2 font-light">
            Additional projects, experiments, and hackathon prototypes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Project 1: Vyapaar Saarthi */}
          <div className="flex flex-col h-full p-8 rounded-xl border border-white/10 bg-card/20  text-left hover:bg-white/[0.03] transition-colors group relative overflow-hidden">
            {/* Subtle gradient background effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-2xl font-light uppercase tracking-wider text-white font-mono">
                Vyapaar Saarthi
              </h3>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/GaneshBamalwa/VyapaarSaarthi/tree/main/demo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-accent transition-colors"
                  title="View Demo"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </a>
                <a 
                  href="https://github.com/GaneshBamalwa/VyapaarSaarthi" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-white transition-colors"
                  title="View on GitHub"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                  </svg>
                </a>
              </div>
            </div>

            <p className="text-accent text-sm font-mono uppercase tracking-wider mb-2 relative z-10">
              FarAway Hackathon Zuup Submission
            </p>

            <p className="text-white/90 text-sm font-medium mb-6 relative z-10 leading-relaxed">
              The Next-Generation AI-Native Operating System for Indian MSMEs
            </p>

            <div className="space-y-4 mb-8 flex-grow relative z-10">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5">What it is</span>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  A mission-critical, modular AI agent platform that acts as the autonomous central nervous system for business operations.
                </p>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5">What it works on</span>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  Processes multilingual voice orders via Twilio/Telegram, analyzes complex GST documents using Gemini 2.5 Pro Vision, and mitigates supply chain risks through LangGraph orchestration.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
              {['Python', 'React', 'FastAPI', 'Gemini', 'LangGraph', 'Tailwind CSS'].map(tech => (
                <span key={tech} className="px-2.5 py-1 rounded border border-white/10 text-[10px] uppercase tracking-wider text-white/50 bg-black/40">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project 2: Sahayak AI */}
          <div className="flex flex-col h-full p-8 rounded-xl border border-white/10 bg-card/20  text-left hover:bg-white/[0.03] transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A961]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-2xl font-light uppercase tracking-wider text-white font-mono">
                Sahayak AI
              </h3>
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.youtube.com/watch?v=kyCDXDsLe70" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-[#FF0000] transition-colors"
                  title="Watch Demo on YouTube"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/GaneshBamalwa/financial-inclusion" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-white transition-colors"
                  title="View on GitHub"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/posts/siddhantshivam_hackindia-financialinclusion-ai-share-7471982496969019393-D7pz/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFDmGs0BfIv4tQ0U2apAiiy5iSio3-am6sI" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-[#0077b5] transition-colors"
                  title="View on LinkedIn"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <p className="text-[#C9A961] text-sm font-mono uppercase tracking-wider mb-2 relative z-10">
              HackIndia Hackathon Winner
            </p>

            <p className="text-white/90 text-sm font-medium mb-6 relative z-10 leading-relaxed">
              Enterprise Multi-Agent Financial Inclusion Assistant
            </p>

            <div className="space-y-4 mb-8 flex-grow relative z-10">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5">What it is</span>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  A production-grade multi-agent AI system designed specifically for rural Indian financial inclusion and assistance.
                </p>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5">What it works on</span>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  Orchestrates a robust LangGraph pipeline handling language detection, profile extraction, clarifying questions, web search, reasoning, and fraud safety with LLM-based filtering.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
              {['LangGraph', 'FastAPI', 'Google Gemini', 'Redis', 'React'].map(tech => (
                <span key={tech} className="px-2.5 py-1 rounded border border-white/10 text-[10px] uppercase tracking-wider text-white/50 bg-black/40">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project 3: Groundhog */}
          <div className="flex flex-col h-full p-8 rounded-xl border border-white/10 bg-card/20  text-left hover:bg-white/[0.03] transition-colors group relative overflow-hidden lg:col-span-2 xl:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-2xl font-light uppercase tracking-wider text-white font-mono">
                Groundhog
              </h3>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/Team-Moov/cognee-hackathon/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-white transition-colors"
                  title="View on GitHub"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                  </svg>
                </a>
              </div>
            </div>

            <p className="text-purple-400/80 text-sm font-mono uppercase tracking-wider mb-2 relative z-10">
              The Hangover Hackathon · WeMakeDevs
            </p>

            <p className="text-white/90 text-sm font-medium mb-6 relative z-10 leading-relaxed">
              The Memory-Graph Layer for Machine-Learning Experiments
            </p>

            <div className="space-y-4 mb-8 flex-grow relative z-10">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5">What it is</span>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  A memory-graph layer that turns a chaotic pile of ML runs into a persistent memory that reasons and understands the "why" behind experiments.
                </p>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5">What it works on</span>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  Prevents duplicate runs via a Pre-flight Guard, calculates deterministic hyperparameter sensitivity, and exposes experiment history directly to coding agents via a Model Context Protocol (MCP) server.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
              {['Cognee', 'Python', 'React', 'MCP', 'W&B', 'Kuzu'].map(tech => (
                <span key={tech} className="px-2.5 py-1 rounded border border-white/10 text-[10px] uppercase tracking-wider text-white/50 bg-black/40">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default memo(MoreProjectsSection);
