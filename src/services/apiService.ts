import {
  YouTubeApiResponse,
  TikTokApiResponse,
  TikTokResult,
  YouTubeResult,
  PinterestApiResponse,
  PinterestResult,
} from '../types/downloader';

const NEOAPIS_YTDL_URL = 'https://www.neoapis.xyz/api/downloader/ytdl';
const NEOAPIS_TIKTOK_URL = 'https://www.neoapis.xyz/api/downloader/tiktok';
const NEXRAY_PINTEREST_URL = 'https://api.nexray.eu.cc/downloader/pinterest';

export const API_ERROR_MESSAGE =
  'maaf hari ini api kami sedang dalam kendala mohon untuk bersabar untuk memulihkan kembali api tersebut by bily';

export function formatDuration(seconds: number | string): string {
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
 * Fetch YouTube MP3 / MP4 from https://www.neoapis.xyz/api/downloader/ytdl?url=
 */
export async function fetchYouTubeDownload(url: string): Promise<YouTubeApiResponse> {
  const cleanUrl = url.trim();

  if (!isValidYouTubeUrl(cleanUrl)) {
    throw new Error('URL YouTube tidak valid! Pastikan link berasal dari YouTube.');
  }

  const targetUrlMp3 = `${NEOAPIS_YTDL_URL}?url=${encodeURIComponent(cleanUrl)}&type=mp3`;
  const targetUrlMp4 = `${NEOAPIS_YTDL_URL}?url=${encodeURIComponent(cleanUrl)}&type=mp4`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(targetUrlMp3, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && (json.status || json.data)) {
        const item = json.data || json.result || json;
        const parsedResult: YouTubeResult = {
          id: item.id || 'yt-' + Date.now(),
          title: item.title || 'YouTube Media',
          download: item.download || '',
          downloadMp4: targetUrlMp4,
          type: item.type || 'mp3',
          url: cleanUrl,
        };
        return { status: true, result: parsedResult };
      }
    }
  } catch {
    // try proxy
  }

  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrlMp3)}`;
    const proxyResp = await fetch(proxyUrl);
    if (proxyResp.ok) {
      const json = await proxyResp.json();
      const item = json.data || json.result || json;
      if (item && (item.title || item.download)) {
        const parsedResult: YouTubeResult = {
          id: item.id || 'yt-' + Date.now(),
          title: item.title || 'YouTube Media',
          download: item.download || '',
          downloadMp4: targetUrlMp4,
          type: item.type || 'mp3',
          url: cleanUrl,
        };
        return { status: true, result: parsedResult };
      }
    }
  } catch {
    // handled below
  }

  throw new Error(API_ERROR_MESSAGE);
}

/**
 * Fetch Pinterest Video from https://api.nexray.eu.cc/downloader/pinterest?url=
 */
export async function fetchPinterestDownload(url: string): Promise<PinterestApiResponse> {
  const cleanUrl = url.trim();

  if (!isValidPinterestUrl(cleanUrl)) {
    throw new Error('URL Pinterest tidak valid! Pastikan link berasal dari Pinterest (pin.it atau pinterest.com).');
  }

  const targetUrl = `${NEXRAY_PINTEREST_URL}?url=${encodeURIComponent(cleanUrl)}`;

  // 1. Direct fetch
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json && (json.status || json.result)) {
        const res = json.result || json.data || json;
        const parsed: PinterestResult = {
          title: res.title || 'Pinterest Video',
          author: res.author || json.author || 'Pinterest Creator',
          thumbnail: res.thumbnail || '',
          video: res.video || res.url || '',
          downloadUrl: res.video || res.url || '',
        };
        return { status: true, result: parsed };
      }
    }
  } catch {
    // try proxy
  }

  // 2. Proxy attempt
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    const proxyResp = await fetch(proxyUrl);
    if (proxyResp.ok) {
      const json = await proxyResp.json();
      if (json && (json.status || json.result)) {
        const res = json.result || json.data || json;
        const parsed: PinterestResult = {
          title: res.title || 'Pinterest Video',
          author: res.author || json.author || 'Pinterest Creator',
          thumbnail: res.thumbnail || '',
          video: res.video || res.url || '',
          downloadUrl: res.video || res.url || '',
        };
        return { status: true, result: parsed };
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

  // 1. Direct fetch
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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

  // 2. CORS Proxy attempt
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    const proxyResp = await fetch(proxyUrl);
    if (proxyResp.ok) {
      const json = await proxyResp.json();
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
  } catch {
    // handled below
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

  // 1. Background Blob stream
  try {
    const proxyList = [
      url,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    ];

    for (const target of proxyList) {
      try {
        const resp = await fetch(target);
        if (resp.ok) {
          const blob = await resp.blob();
          if (blob && blob.size > 200) {
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
        // next
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
