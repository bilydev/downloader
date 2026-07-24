import React from 'react';
import { X, Bug, Sparkles, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleWhatsAppReport = () => {
    onClose();
    const waUrl = 'https://wa.me/6287892412411?text=Halo%20Bily%20Developer,%20saya%20ingin%20melaporkan%20kendala/bug%20pada%20web%20Bily%20Downloader';
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#0d0d17] border-r border-purple-500/30 text-white p-6 shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col justify-between overflow-y-auto z-10 animate-slideIn">
        
        <div>
          {/* Header & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-purple-200 to-fuchsia-400 bg-clip-text text-transparent font-['Outfit']">
                  CONVERTER BY BILY
                </h2>
                <span className="text-[10px] font-mono text-purple-400">
                  OFFICIAL TOOLS v2.4
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-900/80 hover:bg-purple-900/50 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="mt-5 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs sm:text-sm text-purple-200/90 leading-relaxed space-y-2.5">
            <p className="font-medium text-white/95">
              mendownload youtube dan tiktok dengan cepat hd dan no watermark memudahkan anda untuk mendownload video terimakasih telah menggunakan website kami by bily programing
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300/80 pt-1 border-t border-purple-900/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cepat, Ringan & Tanpa Iklan Mengganggu</span>
            </div>
          </div>

          {/* Clean Action Buttons Section - Direct to WhatsApp 6287892412411 */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleWhatsAppReport}
              className="w-full group p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-purple-950/40 to-zinc-900/90 hover:from-purple-900/50 hover:to-zinc-900 border border-purple-500/30 hover:border-purple-400 text-left transition-all duration-200 flex items-center justify-between cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Bug className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-purple-200">
                  Report Bug
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Drawer Bottom Info */}
        <div className="pt-6 border-t border-purple-950/60 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-purple-300/80 mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
            <span>Created by Bily Programming</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">
            YouTube MP3/MP4 & TikTok HD Ultra Fast Engine
          </p>
        </div>

      </div>
    </div>
  );
};
