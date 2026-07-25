import React, { useState } from 'react';
import { DownloadMode, YouTubeResult, TikTokResult, PinterestResult, SpotifyResult } from '../types/downloader';
import { formatDuration, triggerDirectDownload } from '../services/apiService';
import {
  Music,
  Video,
  User,
  Sparkles,
  Loader2,
  FileText,
  Clock,
  Tv,
  Image as ImageIcon,
  Disc3,
} from 'lucide-react';

interface ResultCardProps {
  mode: DownloadMode;
  ytData?: YouTubeResult;
  tiktokData?: TikTokResult;
  pinterestData?: PinterestResult;
  spotifyData?: SpotifyResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  mode,
  ytData,
  tiktokData,
  pinterestData,
  spotifyData,
}) => {
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string, key: string) => {
    setDownloadingKey(key);
    await triggerDirectDownload(url, filename);
    setTimeout(() => setDownloadingKey(null), 2500);
  };

  // Fake Ping 200ms dengan animasi sinyal jaringan di samping kanannya
  const renderNetworkStatus = () => (
    <div className="flex items-center gap-1.5 bg-[#121124] border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.2)]">
      <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-tight">
        200ms
      </span>
      {/* Animasi sinyal jaringan di samping kanan */}
      <div className="flex items-end gap-0.5 h-3">
        <span className="w-1 h-1.5 bg-emerald-400 rounded-xs animate-pulse"></span>
        <span className="w-1 h-2.5 bg-emerald-400 rounded-xs animate-pulse delay-75"></span>
        <span className="w-1 h-3.5 bg-emerald-400 rounded-xs animate-pulse delay-150"></span>
        <span className="w-1 h-4 bg-emerald-400 rounded-xs animate-pulse delay-200"></span>
      </div>
    </div>
  );

  // 1. YouTube Display Card
  if (mode === 'youtube') {
    if (!ytData) return null;

    const mp3DownloadUrl = ytData.downloadMp3 || '';
    const mp4DownloadUrl = ytData.downloadMp4 || '';

    return (
      <div className="w-full bg-[#0e0e1a]/95 border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_35px_rgba(168,85,247,0.25)] transition-all animate-fadeIn">
        
        {/* Header with Fake Ping 200ms & Animated Signal */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <Video className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              YouTube NexRay
            </span>
          </div>
          {renderNetworkStatus()}
        </div>

        {/* Thumbnail & Description Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          
          {/* Thumbnail Box */}
          <div className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-purple-500/30 bg-black aspect-video flex items-center justify-center">
            <img
              src={ytData.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
              alt={ytData.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-white flex items-center gap-1 border border-white/10">
              <Clock className="w-3 h-3 text-purple-400" />
              {formatDuration(ytData.duration)}
            </div>
          </div>

          {/* Details Content */}
          <div className="md:col-span-7 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#121124] border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Deskripsi:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed line-clamp-3">
                {ytData.title}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-purple-200/80">
              <span className="flex items-center gap-1 bg-[#17172b] px-2.5 py-1 rounded-lg border border-purple-900/40 font-mono">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{formatDuration(ytData.duration)}</span>
              </span>
              <span className="flex items-center gap-1 bg-[#17172b] px-2.5 py-1 rounded-lg border border-purple-900/40 font-mono text-emerald-300 font-bold">
                <Tv className="w-3.5 h-3.5 text-emerald-400" />
                <span>{ytData.resolusi || '1080'}p HD</span>
              </span>
            </div>
          </div>

        </div>

        {/* Side-by-Side Download Buttons: Samping Kiri UNDUH MP3, Samping Kanan UNDUH MP4 */}
        <div className="mt-5 pt-4 border-t border-purple-900/30 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Samping Kiri: UNDUH MP3 */}
          <button
            onClick={() =>
              handleDownload(
                mp3DownloadUrl,
                `${ytData.title.slice(0, 25)}.mp3`,
                'yt-mp3'
              )
            }
            className="w-full py-3.5 rounded-2xl bg-[#1c1836] hover:bg-purple-950/80 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition cursor-pointer active:scale-98"
          >
            {downloadingKey === 'yt-mp3' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-fuchsia-400" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4 text-fuchsia-400" />
                <span>UNDUH MP3</span>
              </>
            )}
          </button>

          {/* Samping Kanan: UNDUH MP4 */}
          <button
            onClick={() =>
              handleDownload(
                mp4DownloadUrl,
                `${ytData.title.slice(0, 25)}.mp4`,
                'yt-mp4'
              )
            }
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(217,70,239,0.45)] transition cursor-pointer active:scale-98"
          >
            {downloadingKey === 'yt-mp4' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>UNDUH MP4</span>
              </>
            )}
          </button>

        </div>

      </div>
    );
  }

  // 2. Pinterest Display Card
  if (mode === 'pinterest') {
    if (!pinterestData) return null;

    const downloadUrl = pinterestData.downloadUrl || pinterestData.video || pinterestData.image || '';

    return (
      <div className="w-full bg-[#0e0e1a]/95 border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_35px_rgba(168,85,247,0.25)] transition-all animate-fadeIn">
        
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <ImageIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Pinterest Downloader
            </span>
          </div>
          {renderNetworkStatus()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          {pinterestData.thumbnail && (
            <div className="md:col-span-4 relative group overflow-hidden rounded-2xl border border-purple-500/30 bg-black aspect-video sm:aspect-square flex items-center justify-center max-h-56 mx-auto w-full">
              <img
                src={pinterestData.thumbnail}
                alt={pinterestData.title || 'Pinterest Media'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className={pinterestData.thumbnail ? 'md:col-span-8 space-y-3' : 'md:col-span-12 space-y-3'}>
            {pinterestData.author && (
              <div className="flex items-center gap-2 bg-[#17172b] px-3.5 py-1.5 rounded-xl border border-purple-900/50 w-fit">
                <User className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-xs sm:text-sm text-rose-200">
                  {pinterestData.author}
                </span>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#121124] border border-purple-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>Deskripsi:</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans line-clamp-3">
                {pinterestData.title || 'Pinterest Media'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-purple-900/30">
          <button
            onClick={() =>
              handleDownload(
                downloadUrl,
                `${(pinterestData.author || 'pinterest').slice(0, 15)}.${pinterestData.mediaType === 'image' ? 'jpg' : 'mp4'}`,
                'pin-download'
              )
            }
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-fuchsia-600 hover:from-rose-500 hover:to-fuchsia-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(225,29,72,0.4)] transition cursor-pointer active:scale-98"
          >
            {downloadingKey === 'pin-download' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>DOWNLOAD</span>
              </>
            )}
          </button>
        </div>

      </div>
    );
  }

  // 3. Spotify Display Card
  if (mode === 'spotify') {
    if (!spotifyData) return null;

    const downloadUrl = spotifyData.url;

    return (
      <div className="w-full bg-[#0e0e1a]/95 border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_35px_rgba(168,85,247,0.25)] transition-all animate-fadeIn">
        
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Disc3 className="w-4 h-4 animate-spin" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Spotify NexRay Music
            </span>
          </div>
          {renderNetworkStatus()}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-[#17172b] px-3.5 py-1.5 rounded-xl border border-emerald-900/50 w-fit">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs sm:text-sm text-emerald-200">
              Artis: {spotifyData.artist}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121124] border border-purple-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deskripsi:</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans font-semibold">
              {spotifyData.title}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-purple-900/30">
          <button
            onClick={() =>
              handleDownload(
                downloadUrl,
                `${spotifyData.title.slice(0, 25)}.mp3`,
                'spotify-mp3'
              )
            }
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition cursor-pointer active:scale-98"
          >
            {downloadingKey === 'spotify-mp3' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4" />
                <span>UNDUH SPOTIFY</span>
              </>
            )}
          </button>
        </div>

      </div>
    );
  }

  // 4. TikTok Display Card
  if (mode === 'tiktok') {
    if (!tiktokData) return null;

    const audioUrl = tiktokData.musicUrl;
    const videoUrl = tiktokData.videoUrl;

    return (
      <div className="w-full bg-[#0e0e1a]/95 border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_35px_rgba(168,85,247,0.25)] transition-all animate-fadeIn">
        
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-600/20 text-pink-400 border border-pink-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              TikTok NeoApis HD
            </span>
          </div>
          {renderNetworkStatus()}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#17172b] px-3.5 py-1.5 rounded-xl border border-purple-900/50">
              <User className="w-4 h-4 text-pink-400" />
              <span className="font-bold text-sm text-pink-200">@{tiktokData.author}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121124] border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
              <FileText className="w-3.5 h-3.5 text-pink-400" />
              <span>Deskripsi:</span>
            </div>
            
            <div className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-sans max-h-48 overflow-y-auto pr-1">
              {tiktokData.content_desc && tiktokData.content_desc.length > 0 ? (
                <div className="space-y-1">
                  {tiktokData.content_desc.map((descLine, idx) => (
                    <p key={idx} className="text-zinc-200">
                      {descLine}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-300">{tiktokData.title}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-purple-900/30 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={() =>
              handleDownload(
                audioUrl,
                `${tiktokData.author}-sound.mp3`,
                'tt-audio'
              )
            }
            className="w-full py-3.5 rounded-2xl bg-[#1c1836] hover:bg-purple-950/80 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition cursor-pointer active:scale-98"
          >
            {downloadingKey === 'tt-audio' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-fuchsia-400" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4 text-fuchsia-400" />
                <span>TIKTOK MP3</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              handleDownload(
                videoUrl,
                `${tiktokData.author}-video.mp4`,
                'tt-video'
              )
            }
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(217,70,239,0.45)] transition cursor-pointer active:scale-98"
          >
            {downloadingKey === 'tt-video' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>MEMPROSES...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>TIKTOK MP4</span>
              </>
            )}
          </button>
        </div>

      </div>
    );
  }

  return null;
};
