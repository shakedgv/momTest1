
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { STORIES_DATA } from './constants';
import { Story, UserInsight } from './types';

const Icon = ({ name, className }: { name?: string; className?: string }) => {
  const icons: Record<string, React.ReactElement> = {
    MessageCircle: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
    Users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />,
    ShieldAlert: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />,
    Layers: <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.27a1 1 0 0 0 0 1.83l8.57 4.09a2 2 0 0 0 1.66 0l8.57-4.09a1 1 0 0 0 0-1.83Z" />,
    Target: <circle cx="12" cy="12" r="10" />,
    Lightbulb: <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />,
    Gavel: <path d="m14 13-5 5 2 2 5-5-2-2Z" />,
    Eye: <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />,
    Handshake: <path d="M11 18l-2-1-1 1-1-1-1 1" />,
    ClipboardCheck: <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {icons[name || 'MessageCircle'] || <circle cx="12" cy="12" r="10" />}
      {name === 'Users' && <circle cx="9" cy="7" r="4" />}
      {name === 'ShieldAlert' && <line x1="12" y1="8" x2="12" y2="12" />}
      {name === 'ShieldAlert' && <line x1="12" y1="16" x2="12.01" y2="16" />}
      {name === 'Target' && <circle cx="12" cy="12" r="6" />}
      {name === 'Target' && <circle cx="12" cy="12" r="2" />}
      {name === 'Lightbulb' && <path d="M9 18h6" />}
      {name === 'Lightbulb' && <path d="M10 22h4" />}
      {name === 'Gavel' && <path d="m2 21 3-3" />}
      {name === 'Gavel' && <path d="m15 4 6 6" />}
      {name === 'Eye' && <circle cx="12" cy="12" r="3" />}
      {name === 'Handshake' && <path d="m11 14 2 2 2-2" />}
      {name === 'Handshake' && <path d="m7 11 5 5 5-5" />}
      {name === 'ClipboardCheck' && <path d="m9 14 2 2 4-4" />}
      {name === 'ClipboardCheck' && <path d="M8 2v4h8V2" />}
    </svg>
  );
};

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInsights, setUserInsights] = useState<UserInsight[]>([]);
  const [newInsight, setNewInsight] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const currentStory = STORIES_DATA[currentIndex];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < STORIES_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleScreenTouch = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.interactive-element') || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
      return;
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const screenWidth = window.innerWidth;
    
    // RTL Navigation: Left -> Next, Right -> Prev
    if (clientX < screenWidth / 2) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const addInsight = () => {
    if (!newInsight.trim()) return;
    const insight: UserInsight = {
      id: Math.random().toString(36).substr(2, 9),
      text: newInsight,
      timestamp: Date.now()
    };
    setUserInsights([insight, ...userInsights]);
    setNewInsight('');
  };

  return (
    <div className="relative w-full h-full max-w-md bg-zinc-950 flex flex-col overflow-hidden transition-all duration-700 font-assistant antialiased md:rounded-[40px] md:h-[90vh] md:shadow-2xl" style={{ height: '100dvh' }}>
      
      {/* Background Layer */}
      <div className={`absolute inset-0 transition-all duration-700 ${currentStory.gradientClass}`}></div>
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

      {/* Progress Bars */}
      <div className="absolute left-0 right-0 z-[100] flex gap-1 px-4" style={{ top: 'calc(var(--safe-top) + 12px)' }}>
        {STORIES_DATA.map((_, index) => (
          <div key={index} className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_10px_white]"
              style={{ width: index <= currentIndex ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      <div 
        className="flex-1 flex flex-col relative z-10"
        onClick={handleScreenTouch}
      >
        {/* Header Section */}
        <div className="pb-1 px-8 flex flex-col items-center flex-shrink-0" style={{ paddingTop: 'calc(var(--safe-top) + 28px)' }}>
           <div className="header-icon w-10 h-10 glass-card rounded-xl flex items-center justify-center mb-2 shadow-lg border-white/30 animate-float">
              <Icon name={currentStory.icon} className="text-white w-5 h-5" />
           </div>
           <h1 className="story-title text-xl font-black text-white leading-tight drop-shadow-lg font-heebo text-center">
             {currentStory.title}
           </h1>
           <div className="w-6 h-[1.5px] bg-white/40 rounded-full mt-1.5"></div>
        </div>

        {/* Scrollable Content Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 no-scrollbar space-y-3 pt-4"
          style={{ paddingBottom: 'calc(var(--safe-bottom) + 110px)' }}
        >
          {currentStory.content.map((paragraph, i) => (
            <div 
              key={`${currentIndex}-${i}`} 
              className="animate-slide-up opacity-0"
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
            >
              <p className="content-paragraph text-base font-bold text-white leading-[1.45] bg-black/25 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-sm">
                {paragraph}
              </p>
            </div>
          ))}

          {currentStory.type === 'interactive' && (
            <div 
              className="interactive-element mt-4 p-5 glass-card rounded-[24px] border-white/20 space-y-3 animate-slide-up opacity-0"
              style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1">
                 <Icon name="MessageCircle" className="w-4 h-4 text-white/80" />
                 <span className="text-white/80 font-black text-[10px] uppercase tracking-widest">תובנה אישית</span>
              </div>
              
              <textarea
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="שתפו תובנה מעניינת..."
                className="w-full bg-white/10 border border-white/10 text-white placeholder-white/40 rounded-xl p-3 focus:ring-2 focus:ring-white/20 transition-all resize-none h-20 text-sm outline-none font-medium"
              />
              
              <button
                onClick={addInsight}
                disabled={!newInsight.trim()}
                className="w-full py-2.5 bg-white text-black font-black text-sm rounded-xl hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-30 shadow-md"
              >
                פרסם תובנה
              </button>
              
              {userInsights.length > 0 && (
                <div className="space-y-2 mt-4 max-h-32 overflow-y-auto no-scrollbar">
                  {userInsights.map(insight => (
                    <div key={insight.id} className="text-xs text-white/90 p-3 bg-white/5 rounded-xl border border-white/5 italic">
                      "{insight.text}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation visual hints (very subtle) */}
      <div className="absolute left-4 z-50 pointer-events-none opacity-20" style={{ bottom: 'calc(var(--safe-bottom) + 16px)' }}>
         <span className="text-white text-[10px] font-bold tracking-widest uppercase">הבא ←</span>
      </div>
      <div className="absolute right-4 z-50 pointer-events-none opacity-20" style={{ bottom: 'calc(var(--safe-bottom) + 16px)' }}>
         <span className="text-white text-[10px] font-bold tracking-widest uppercase">→ הקודם</span>
      </div>

      {/* Page counter - positioned safely above home indicator */}
      <div className="absolute left-0 right-0 flex justify-center items-center z-40 pointer-events-none" style={{ bottom: 'calc(var(--safe-bottom) + 12px)' }}>
         <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-black text-white/60 tracking-tighter">
              {currentIndex + 1} / {STORIES_DATA.length}
            </span>
         </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        body {
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            overflow: hidden;
            background: #000;
        }

        .overflow-y-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        p {
            word-wrap: break-word;
        }

        /* Prevent potential system gesture conflict */
        * {
            touch-action: pan-y;
        }
      `}</style>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
