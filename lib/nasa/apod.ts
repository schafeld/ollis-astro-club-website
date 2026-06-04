interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  date: string;
  copyright?: string;
}

export interface VideoEmbedInfo {
  type: 'youtube' | 'direct' | 'external';
  embedUrl: string;
}

const NASA_DEMO_KEY = 'DEMO_KEY';
let hasWarnedAboutDemoKey = false;

export function getVideoEmbedUrl(url: string): VideoEmbedInfo {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);

  if (youtubeMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return {
      type: 'direct',
      embedUrl: url,
    };
  }

  return {
    type: 'external',
    embedUrl: url,
  };
}

// Calls the NASA API directly. Only safe to run on the server, where the
// NASA_API_KEY runtime secret is available; used by both the SSR render and
// the `/api/nasa/apod` server route.
export async function fetchApodFromNasa(): Promise<ApodData | null> {
  const config = useRuntimeConfig();
  const apiKey = config.nasaApiKey || NASA_DEMO_KEY;

  if (!config.nasaApiKey && !hasWarnedAboutDemoKey) {
    hasWarnedAboutDemoKey = true;
    console.warn('NASA_API_KEY not found, using NASA DEMO_KEY for APOD requests');
  }

  try {
    return await $fetch<ApodData>('https://api.nasa.gov/planetary/apod', {
      params: { api_key: apiKey },
    });
  } catch (error) {
    console.error('Error fetching NASA APOD:', error);
    return null;
  }
}

export async function getApod(): Promise<ApodData | null> {
  // On the client the server-only NASA key is unavailable, so route through the
  // server endpoint to keep using the real key instead of the rate-limited DEMO_KEY.
  if (import.meta.client) {
    return $fetch<ApodData | null>('/api/nasa/apod');
  }

  return fetchApodFromNasa();
}