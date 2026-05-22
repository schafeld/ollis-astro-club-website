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

export async function getApod(): Promise<ApodData | null> {
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