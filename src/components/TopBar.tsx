import React from 'react';
import { Menu, Sparkles, Wifi } from 'lucide-react';

interface TopBarProps {
  onOpenDrawer: () => void;
  serverPing?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenDrawer, serverPing = 24 }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#07070ec7] backdrop-blur-xl border-b border-purple-500/20 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.15)] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Left: Hamburger menu + bily downloader title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <button
            onClick={onOpenDrawer}
            aria-label="Buka Menu Hamburger"
            className="p-2 sm:p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 hover:text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.2)]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_10px_rgba(192,132,252,0.6)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent font-['Outfit'] lowercase select-none">
                bily downloader
              </span>
              <span className="text-[9px] text-purple-400/80 uppercase font-mono tracking-widest hidden sm:inline-block">
                FAST HD CONVERTER
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status Online */}
        <div className="flex items-center gap-2 bg-[#121124] border border-purple-500/30 px-2.5 sm:px-3 py-1 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#22c55e]"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wide">
            Online
          </span>
          <span className="hidden md:inline-block text-[10px] font-mono text-purple-300/60 border-l border-purple-800/40 pl-2">
            <Wifi className="w-3 h-3 inline mr-1 text-emerald-400" />
            {serverPing}ms
          </span>
        </div>

      </div>
    </header>
  );
};
