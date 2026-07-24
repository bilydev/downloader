import React from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';

export const FooterShimmer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-purple-900/30 bg-gradient-to-b from-[#07070b] via-[#0b0b14] to-[#050508] py-10 px-4 text-center select-none">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Animated Shimmering White Text */}
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <h4 className="text-base sm:text-xl font-extrabold tracking-wider font-['Outfit'] uppercase shimmer-text-white">
            Powered by Bily Developer
          </h4>
          <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
        </div>

        <p className="text-xs text-purple-300/70 max-w-md mx-auto leading-relaxed">
          YouTube MP3, MP4 & TikTok No Watermark Ultra Fast Downloader. Dibuat dengan performa tinggi, ringan untuk HP & Desktop.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-zinc-500 pt-2">
          <span className="flex items-center gap-1 text-purple-400/80">
            <Shield className="w-3.5 h-3.5" /> 100% Aman & Bebas Iklan Pop-up
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-pink-400/80">
            <Heart className="w-3.5 h-3.5 fill-pink-400/30" /> Bily Programming 2026
          </span>
        </div>

      </div>
    </footer>
  );
};
