import {
  YouTubeApiResponse,
  TikTokApiResponse,
  TikTokResult,
  YouTubeResult,
  PinterestApiResponse,
  PinterestResult,
  SpotifyApiResponse,
  SpotifyResult,
} from '../types/downloader';
import { _dec } from '../utils/security';

// Obfuscated Encrypted API Endpoints (Proteksi agar tidak terbaca di source code)
const NEXRAY_YTMP4_URL = _dec('aHR0cHM6Ly9hcGkubmV4cmF5LmV1LmNjL2Rvd25sb2FkZXIveXRtcDQ=');
const NEXRAY_YTMP3_URL = _dec('aHR0cHM6Ly9hcGkubmV4cmF5LmV1LmNjL2Rvd25sb2FkZXIveXRtcDM=');
const NEXRAY_PINTEREST_URL = _dec('aHR0cHM6Ly9hcGkubmV4cmF5LmV1LmNjL2Rvd25sb2FkZXIvcGludGVyZXN0');
const NEXRAY_SPOTIFY_URL = _dec('aHR0cHM6Ly9hcGkubmV4cmF5LmV1LmNjL2Rvd25sb2FkZXIvc3BvdGlmeQ==');
const NEOAPIS_TIKTOK_URL = _dec('aHR0cHM6Ly93d3cubmVvYXBpcy54eXovYXBpL2Rvd25sb2FkZXIvdGlrdG9r');

export const API_ERROR_MESSAGE =
  'maaf hari ini api kami sedang dalam kendala mohon untuk bersabar untuk memulihkan kembali api tersebut by bily';

export function formatDuration(seconds: number | string | undefined): string {
  if (!seconds) return '00:00';
  const num = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;
  if (isNaN(num) || num <= 0) return '00:00';
  const mins = Math.floor(num / 60);
  const secs = num % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes('youtube.com/watch') ||
    clean.includes('youtu.be/') ||
    clean.includes('youtube.com/shorts/') ||
    clean.includes('youtube.com/embed/')
  );
}

export function isValidPinterestUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes('pinterest.com/') ||
    clean.includes('pin.it/') ||
    clean.includes('pinterest.co')
  );
}

export function isValidSpotifyUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes('spotify.com/track') ||
    clean.includes('spotify.link/') ||
    clean.includes('open.spotify.com')
  );
}

export function isValidTikTokUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes('tiktok.com/') ||
    clean.includes('vt.tiktok.com/') ||
    clean.includes('vm.tiktok.com/')
  );
}

/**
 * Fetch YouTube MP4 (1080p) & MP3 from https://api.nexray.eu.cc/downloader/ytmp4 & ytmp3
 */
export async function fetchYouTubeDownload(url: string): Promise<{ status: boolean; result: YouTubeResult }> {
  const cleanUrl = url.trim();

  if (!isValidYouTubeUrl(cleanUrl)) {
    throw new Error('URL YouTube tidak valid! Pastikan link berasal dari YouTube.');
  }

  const endpointMp4 = `${NEXRAY_YTMP4_URL}?url=${encodeURIComponent(cleanUrl)}&resolusi=1080`;
  const endpointMp3 = `${NEXRAY_YTMP3_URL}?url=${encodeURIComponent(cleanUrl)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const respMp4 = await fetch(endpointMp4, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (respMp4.ok) {
      const json: YouTubeApiResponse = await respMp4.json();
      if (json && json.status && json.result) {
        const item = json.result;
        return {
          status: true,
          result: {
            id: 'yt-' + Date.now(),
            title: item.title || 'YouTube Media',
            thumbnail: item.thumbnail || '',
            duration: item.duration || 16,
            resolusi: item.resolusi || '1080',
            url: cleanUrl,
            downloadMp4: item.url || endpointMp4,
            downloadMp3: endpointMp3,
          },
        };
      }
    }
  } catch {
    // try proxy
  }

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(endpointMp4)}`;
    const proxyResp = await fetch(proxyUrl);
    if (proxyResp.ok) {
      const json = await proxyResp.json();
      if (json && json.status && json.result) {
        const item = json.result;
        return {
          status: true,
          result: {
            id: 'yt-' + Date.now(),
            title: item.title || 'YouTube Media',
            thumbnail: item.thumbnail || '',
            duration: item.duration || 16,
            resolusi: item.resolusi || '1080',
            url: cleanUrl,
            downloadMp4: item.url || endpointMp4,
            downloadMp3: endpointMp3,
          },
        };
      }
    }
  } catch {
    // handled below
  }

  throw new Error(API_ERROR_MESSAGE);
}

/**
 * Fetch Pinterest Image / Video from https://api.nexray.eu.cc/downloader/pinterest?url=
 */
export async function fetchPinterestDownload(url: string): Promise<{ status: boolean; result: PinterestResult }> {
  const cleanUrl = url.trim();

  if (!isValidPinterestUrl(cleanUrl)) {
    throw new Error('URL Pinterest tidak valid! Pastikan link berasal dari Pinterest (pin.it atau pinterest.com).');
  }

  const targetUrl = `${NEXRAY_PINTEREST_URL}?url=${encodeURIComponent(cleanUrl)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json: PinterestApiResponse = await response.json();
      if (json && json.status && json.result) {
        const res = json.result;
        const videoLink = res.video || '';
        const imageLink = res.image || res.thumbnail || res.url || '';
        const isVideo = Boolean(videoLink && videoLink.length > 5);
        const actualDownloadUrl = isVideo ? videoLink : imageLink;

        return {
          status: true,
          result: {
            title: res.title || 'Pinterest Media',
            author: res.author || json.author || 'Pinterest Creator',
            thumbnail: res.thumbnail || imageLink,
            image: imageLink,
            video: videoLink,
            downloadUrl: actualDownloadUrl,
            mediaType: isVideo ? 'video' : 'image',
          },
        };
      }
    }
  } catch {
    // try proxy
  }

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    const proxyResp = await fetch(proxyUrl);
    if (proxyResp.ok) {
      const json = await proxyResp.json();
      if (json && json.status && json.result) {
        const res = json.result;
        const videoLink = res.video || '';
        const imageLink = res.image || res.thumbnail || res.url || '';
        const isVideo = Boolean(videoLink && videoLink.length > 5);

        return {
          status: true,
          result: {
            title: res.title || 'Pinterest Media',
            author: res.author || json.author || 'Pinterest Creator',
            thumbnail: res.thumbnail || imageLink,
            image: imageLink,
            video: videoLink,
            downloadUrl: isVideo ? videoLink : imageLink,
            mediaType: isVideo ? 'video' : 'image',
          },
        };
      }
    }
  } catch {
    // handled below
  }

  throw new Error(API_ERROR_MESSAGE);
}

/**
 * Fetch Spotify Music Track from https://api.nexray.eu.cc/downloader/spotify?url=
 */
export async function fetchSpotifyDownload(url: string): Promise<{ status: boolean; result: SpotifyResult }> {
  const cleanUrl = url.trim();

  if (!isValidSpotifyUrl(cleanUrl)) {
    throw new Error('URL Spotify tidak valid! Pastikan link berasal dari Spotify (open.spotify.com/track/...).');
  }

  const targetUrl = `${NEXRAY_SPOTIFY_URL}?url=${encodeURIComponent(cleanUrl)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json: SpotifyApiResponse = await response.json();
      if (json && json.status && json.result) {
        const res = json.result;
        return {
          status: true,
          result: {
            title: res.title || 'Spotify Track',
            artist: res.artist || json.author || 'Spotify Artist',
            url: res.url || '',
          },
        };
      }
    }
  } catch {
    // try proxy
  }

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    const proxyResp = await fetch(proxyUrl);
    if (proxyResp.ok) {
      const json = await proxyResp.json();
      if (json && json.status && json.result) {
        const res = json.result;
        return {
          status: true,
          result: {
            title: res.title || 'Spotify Track',
            artist: res.artist || json.author || 'Spotify Artist',
            url: res.url || '',
          },
        };
      }
    }
  } catch {
    // handled below
  }

  throw new Error(API_ERROR_MESSAGE);
}

/**
 * Fetch TikTok Video & Audio from https://www.neoapis.xyz/api/downloader/tiktok?url=
 */
export async function fetchTikTokDownload(url: string): Promise<TikTokApiResponse> {
  const cleanUrl = url.trim();

  if (!isValidTikTokUrl(cleanUrl)) {
    throw new Error('URL TikTok tidak valid! Pastikan link berasal dari TikTok.');
  }

  const targetUrl = `${NEOAPIS_TIKTOK_URL}?url=${encodeURIComponent(cleanUrl)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && (json.status || json.result)) {
        const item = json.result?.data || json.result || json.data;
        if (item) {
          const authorName =
            typeof item.author === 'object'
              ? item.author?.nickname || item.author?.unique_id || 'TikTok User'
              : item.author || 'TikTok User';

          const musicUrl =
            item.music ||
            item.music_info?.play ||
            item.music_info?.url ||
            '';

          const videoUrl =
            item.hdplay ||
            item.play ||
            item.wmplay ||
            '';

          const contentDesc = Array.isArray(item.content_desc)
            ? item.content_desc.filter((s: string) => s && s.trim().length > 0)
            : [];

          const parsedResult: TikTokResult = {
            id: item.id || 'tt-' + Date.now(),
            title: item.title || (contentDesc.length > 0 ? contentDesc[0] : 'TikTok Media'),
            content_desc: contentDesc,
            duration: item.duration || 10,
            author: authorName,
            musicUrl,
            videoUrl,
            musicTitle: item.music_info?.title || 'original sound',
          };

          return { status: true, result: parsedResult };
        }
      }
    }
  } catch {
    // try proxy
  }

  throw new Error(API_ERROR_MESSAGE);
}

/**
 * Super Fast Anti-CORS Background Download Dispatcher
 */
export async function triggerDirectDownload(url: string, filename: string): Promise<boolean> {
  if (!url) return false;

  const cleanFilename = (filename || 'bily-media')
    .replace(/[^\w\d_.-]/g, '_')
    .substring(0, 60);

  // 1. Background Blob Stream
  try {
    const proxyList = [
      url,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    ];

    for (const target of proxyList) {
      try {
        const resp = await fetch(target, { mode: 'cors' });
        if (resp.ok) {
          const blob = await resp.blob();
          if (blob && blob.size > 100) {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = cleanFilename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              window.URL.revokeObjectURL(blobUrl);
              try {
                document.body.removeChild(a);
              } catch {
                // safe
              }
            }, 1500);
            return true;
          }
        }
      } catch {
        // try next
      }
    }
  } catch {
    // continue
  }

  // 2. Dispatch background download anchor
  try {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = cleanFilename;
    link.setAttribute('download', cleanFilename);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {
        // safe
      }
    }, 1000);
    return true;
  } catch {
    window.open(url, '_blank');
    return true;
  }
}
