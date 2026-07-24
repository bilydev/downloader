export type DownloadMode = 'youtube' | 'pinterest' | 'tiktok';

export interface YouTubeResult {
  id?: string;
  title: string;
  channel?: string;
  duration?: number | string;
  url?: string;
  download: string;
  downloadMp4?: string;
  type?: string;
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

export interface PinterestResult {
  title?: string;
  author?: string;
  thumbnail?: string;
  video?: string;
  downloadUrl?: string;
}

export interface YouTubeApiResponse {
  status: boolean;
  creator?: string;
  data?: {
    id?: string;
    title?: string;
    type?: string;
    download?: string;
  };
  result?: YouTubeResult;
  message?: string;
}

export interface TikTokApiResponse {
  status: boolean;
  result?: TikTokResult;
  message?: string;
}

export interface PinterestApiResponse {
  status: boolean;
  author?: string;
  result?: PinterestResult;
  message?: string;
}
