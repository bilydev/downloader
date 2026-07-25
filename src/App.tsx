import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { MarqueeBanner } from './components/MarqueeBanner';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ResultCard } from './components/ResultCard';
import { FooterShimmer } from './components/FooterShimmer';
import { DownloadMode, YouTubeResult, TikTokResult, PinterestResult, SpotifyResult } from './types/downloader';
import {
  fetchYouTubeDownload,
  fetchTikTokDownload,
  fetchPinterestDownload,
  fetchSpotifyDownload,
  isValidYouTubeUrl,
  isValidTikTokUrl,
  isValidPinterestUrl,
  isValidSpotifyUrl,
  API_ERROR_MESSAGE,
} from './services/apiService';
import {
  Link2,
  Zap,
  Music,
  Sparkles,
  ClipboardPaste,
  Trash2,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Disc3,
} from 'lucide-react';

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Downloader Form States (4 Modes: YouTube, Pinterest, Spotify di kiri TikTok, dan TikTok)
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState<DownloadMode>('youtube');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Result States
  const [ytResult, setYtResult] = useState<YouTubeResult | undefined>();
  const [tiktokResult, setTiktokResult] = useState<TikTokResult | undefined>();
  const [pinterestResult, setPinterestResult] = useState<PinterestResult | undefined>();
  const [spotifyResult, setSpotifyResult] = useState<SpotifyResult | undefined>();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        setErrorMsg('');
      }
    } catch {
      // fallback
    }
  };

  const handleConvert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanUrl = urlInput.trim();

    if (!cleanUrl) {
      setErrorMsg('Silakan masukkan link URL yang valid terlebih dahulu!');
      return;
    }

    // Strict URL Validation based on mode
    if (mode === 'youtube') {
      if (!isValidYouTubeUrl(cleanUrl)) {
        setErrorMsg('URL tidak valid! Mode YouTube memerlukan link YouTube (contoh: https://www.youtube.com/watch?v=...)');
        setYtResult(undefined);
        return;
      }
    } else if (mode === 'pinterest') {
      if (!isValidPinterestUrl(cleanUrl)) {
        setErrorMsg('URL tidak valid! Mode Pinterest memerlukan link Pinterest (contoh: https://pin.it/... atau https://www.pinterest.com/...)');
        setPinterestResult(undefined);
        return;
      }
    } else if (mode === 'spotify') {
      if (!isValidSpotifyUrl(cleanUrl)) {
        setErrorMsg('URL tidak valid! Mode Spotify memerlukan link Spotify (contoh: https://open.spotify.com/track/...)');
        setSpotifyResult(undefined);
        return;
      }
    } else if (mode === 'tiktok') {
      if (!isValidTikTokUrl(cleanUrl)) {
        setErrorMsg('URL tidak valid! Mode TikTok memerlukan link TikTok (contoh: https://vt.tiktok.com/...)');
        setTiktokResult(undefined);
        return;
      }
    }

    setIsLoading(true);
    setErrorMsg('');
    setYtResult(undefined);
    setTiktokResult(undefined);
    setPinterestResult(undefined);
    setSpotifyResult(undefined);

    try {
      if (mode === 'youtube') {
        const resp = await fetchYouTubeDownload(cleanUrl);
        if (resp && resp.status && resp.result) {
          setYtResult(resp.result);
        } else {
          setErrorMsg(API_ERROR_MESSAGE);
        }
      } else if (mode === 'pinterest') {
        const resp = await fetchPinterestDownload(cleanUrl);
        if (resp && resp.status && resp.result) {
          setPinterestResult(resp.result);
        } else {
          setErrorMsg(API_ERROR_MESSAGE);
        }
      } else if (mode === 'spotify') {
        const resp = await fetchSpotifyDownload(cleanUrl);
        if (resp && resp.status && resp.result) {
          setSpotifyResult(resp.result);
        } else {
          setErrorMsg(API_ERROR_MESSAGE);
        }
      } else if (mode === 'tiktok') {
        const resp = await fetchTikTokDownload(cleanUrl);
        if (resp && resp.status && resp.result) {
          setTiktokResult(resp.result);
        } else {
          setErrorMsg(API_ERROR_MESSAGE);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : API_ERROR_MESSAGE;
      setErrorMsg(msg || API_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-[#f3f4f6] flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      
      {/* 1. TOPBAR KECIL DENGAN POSISI TETAP DI ATAS */}
      <TopBar onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* 2. TEKS BERGERAK DI BAWAH TOPBAR */}
      <MarqueeBanner />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        
        {/* HERO TITLE & DESKRIPSI UTAMA */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>ULTRA FAST DOWNLOADER ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-['Outfit'] uppercase">
            <span className="bg-gradient-to-r from-white via-purple-100 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              BILY DOWNLOADER
            </span>
          </h1>

          {/* User Requested exact sentence */}
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#0f0e1c] border border-purple-500/20 text-purple-200/90 text-xs sm:text-sm leading-relaxed shadow-lg">
            <p className="font-medium text-white/95">
              hai pengguna bily downloader di sini kami menyediakan link url downloader YouTube, Pinterest, TikTok dan Spotify silahkan di coba ya dan masukan url nya ya
            </p>
          </div>
        </div>

        {/* INPUT & CONVERT CARD BOX */}
        <div className="bg-[#0c0c17]/95 border border-purple-500/30 rounded-3xl p-4 sm:p-7 shadow-[0_0_40px_rgba(147,51,234,0.2)] backdrop-blur-xl space-y-5">
          
          {/* MODE SELECTOR TABS (YouTube, Pinterest, Spotify di sebelah kiri TikTok, TikTok) */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-purple-300">
              Pilih Platform:
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[#131324] border border-purple-900/40">
              
              {/* 1. YouTube */}
              <button
                type="button"
                onClick={() => {
                  setMode('youtube');
                  setErrorMsg('');
                }}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'youtube'
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-[1.01]'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Music className="w-4 h-4 text-purple-200" />
                <span>YouTube</span>
              </button>

              {/* 2. Pinterest */}
              <button
                type="button"
                onClick={() => {
                  setMode('pinterest');
                  setErrorMsg('');
                }}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'pinterest'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-[1.01]'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-rose-300" />
                <span>Pinterest</span>
              </button>

              {/* 3. Spotify (Di sebelah kiri TikTok) */}
              <button
                type="button"
                onClick={() => {
                  setMode('spotify');
                  setErrorMsg('');
                }}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'spotify'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-[1.01]'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Disc3 className="w-4 h-4 text-emerald-300" />
                <span>Spotify</span>
              </button>

              {/* 4. TikTok */}
              <button
                type="button"
                onClick={() => {
                  setMode('tiktok');
                  setErrorMsg('');
                }}
                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'tiktok'
                    ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-[1.01]'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Sparkles className="w-4 h-4 text-pink-300" />
                <span>TikTok</span>
              </button>

            </div>
          </div>

          {/* URL INPUT FORM */}
          <form onSubmit={handleConvert} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-purple-400" />
                  <span>Masukan URL Anda:</span>
                </label>

                {urlInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setUrlInput('');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                )}
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={
                    mode === 'spotify'
                      ? 'Tempel link Spotify: https://open.spotify.com/track/...'
                      : mode === 'pinterest'
                      ? 'Tempel link Pinterest: https://pin.it/... atau https://www.pinterest.com/...'
                      : mode === 'tiktok'
                      ? 'Tempel link TikTok: https://vt.tiktok.com/...'
                      : 'Tempel link YouTube: https://www.youtube.com/watch?v=...'
                  }
                  className="w-full bg-[#121223] border border-purple-500/40 hover:border-purple-400 focus:border-purple-400 rounded-2xl py-3.5 pl-4 pr-24 sm:pr-28 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner"
                />

                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2 px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-purple-500/30 transition cursor-pointer active:scale-95"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tempel</span>
                </button>
              </div>
            </div>

            {/* ERROR ALERT */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/70 text-rose-200 text-xs flex items-center gap-2.5 shadow-lg">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* CONVERT BUTTON - Teks: CONVERT / MEMPROSES... */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.45)] transition-all cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>MEMPROSES...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span>CONVERT</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* 3. KOTAK BOX HASIL DOWNLOAD (YouTube, Pinterest, Spotify, TikTok) */}
        <ResultCard
          mode={mode}
          ytData={ytResult}
          tiktokData={tiktokResult}
          pinterestData={pinterestResult}
          spotifyData={spotifyResult}
        />

        {/* KEY FEATURES HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-[#0d0d18] border border-purple-900/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">YouTube HD</div>
              <div className="text-[11px] text-zinc-400">MP3 & MP4 1080p</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d0d18] border border-purple-900/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Pinterest</div>
              <div className="text-[11px] text-zinc-400">Video & Gambar HD</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d0d18] border border-purple-900/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
              <Disc3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Spotify</div>
              <div className="text-[11px] text-zinc-400">Track 320kbps Music</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d0d18] border border-purple-900/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-fuchsia-600/20 text-fuchsia-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">TikTok</div>
              <div className="text-[11px] text-zinc-400">No Watermark HD</div>
            </div>
          </div>
        </div>

      </main>

      {/* 4. FOOTER SHIMMER BERGERAK: POWERED BY BILY DEVELOPER */}
      <FooterShimmer />

      {/* HAMBURGER SIDEBAR DRAWER (Report Bug -> WhatsApp 6287892412411) */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

    </div>
  );
}

export default App;
