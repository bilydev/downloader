export type DownloadMode = 'youtube' | 'pinterest' | 'spotify' | 'tiktok';

export interface YouTubeResult {
  id?: string;
  title: string;
  thumbnail?: string;
  channel?: string;
  duration?: number | string;
  url?: string;
  downloadMp3?: string;
  downloadMp4?: string;
  resolusi?: string;
  type?: string;
}

export interface PinterestResult {
  title?: string;
  author?: string;
  thumbnail?: string;
  image?: string;
  video?: string;
  downloadUrl: string;
  mediaType: 'image' | 'video';
}

export interface SpotifyResult {
  title: string;
  artist: string;
  url: string;
}

export interface TikTokResult {
  id?: string;
  title: string;
  content_desc?: string[];
  duration?: number | string;
  author: string;
  musicUrl: string;
  videoUrl: string;
  musicTitle?: string;
}

export interface YouTubeApiResponse {
  status: boolean;
  author?: string;
  result?: {
    title?: string;
    thumbnail?: string;
    duration?: number | string;
    resolusi?: string;
    url?: string;
  };
  message?: string;
}

export interface PinterestApiResponse {
  status: boolean;
  author?: string;
  result?: {
    title?: string;
    author?: string;
    thumbnail?: string;
    image?: string;
    video?: string;
    url?: string;
  };
  message?: string;
}

export interface SpotifyApiResponse {
  status: boolean;
  author?: string;
  result?: {
    title?: string;
    artist?: string;
    url?: string;
  };
  message?: string;
}

export interface TikTokApiResponse {
  status: boolean;
  result?: TikTokResult;
  message?: string;
}
