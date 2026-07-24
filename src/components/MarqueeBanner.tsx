import React from 'react';
import { Code2, Cpu, Zap, Terminal } from 'lucide-react';

export const MarqueeBanner: React.FC = () => {
  const textContent = 'bily developer programing web code html';

  return (
    <div className="w-full bg-gradient-to-r from-purple-950/60 via-[#100c1e] to-purple-950/60 border-b border-purple-500/20 py-2 overflow-hidden relative shadow-inner">
      {/* Subtle background glow effect */}
      <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#07070b] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#07070b] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee-scroll whitespace-nowrap items-center select-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 mx-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300 text-xs font-mono font-medium shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <Code2 className="w-3.5 h-3.5 text-fuchsia-400" />
              {textContent}
            </span>
            <span className="text-purple-400/50 text-xs">✦</span>
            <span className="text-xs font-mono font-semibold tracking-wider text-purple-200/90 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              FAST CONVERT HD
            </span>
            <span className="text-purple-400/50 text-xs">✦</span>
            <span className="text-xs font-mono text-purple-300/80 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              NO WATERMARK
            </span>
            <span className="text-purple-400/50 text-xs">✦</span>
            <span className="text-xs font-mono text-fuchsia-300 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              BY BILY DEV
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
