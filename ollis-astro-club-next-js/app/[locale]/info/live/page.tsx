import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  date: string;
  copyright?: string;
}

function getVideoEmbedUrl(url: string): { type: 'youtube' | 'direct' | 'external'; embedUrl: string } {
  // Check if it's a YouTube URL
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  // Check if it's a direct video file
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return {
      type: 'direct',
      embedUrl: url,
    };
  }

  // Otherwise, it's an external page that can't be embedded
  return {
    type: 'external',
    embedUrl: url,
  };
}

async function getApod(): Promise<ApodData | null> {
  try {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      console.error('NASA_API_KEY not found in environment variables');
      return null;
    }

    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      console.error('NASA APOD API error:', res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching NASA APOD:', error);
    return null;
  }
}

export default async function LivePage() {
  const t = await getTranslations('info');
  const apod = await getApod();

  // Get video embed info if it's a video
  const videoInfo = apod && apod.media_type === 'video' ? getVideoEmbedUrl(apod.url) : null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('live')}</h1>
      
      {apod ? (
        <Card className="overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-2xl font-bold">
                {t('apod.title')}
              </h2>
              <Badge variant="blue">
                {t('apod.date')}: {apod.date}
              </Badge>
            </div>

            <h3 className="font-heading text-xl">{apod.title}</h3>

            {apod.media_type === 'image' ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={apod.url}
                  alt={apod.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            ) : videoInfo ? (
              <div className="space-y-2">
                <Badge variant="accent">{t('apod.videoNote')}</Badge>
                {videoInfo.type === 'youtube' ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={videoInfo.embedUrl}
                      title={apod.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : videoInfo.type === 'direct' ? (
                  <div className="relative w-full overflow-hidden rounded-lg bg-neutral-900">
                    <video
                      src={videoInfo.embedUrl}
                      controls
                      className="w-full"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-color)] bg-[var(--muted)] p-8">
                    <div className="space-y-4 text-center">
                      <p className="font-body text-sm opacity-70">
                        📹 {t('apod.externalVideo')}
                      </p>
                      <a
                        href={videoInfo.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wobbly-pill inline-block border-[3px] border-[var(--border-color)] bg-[var(--background)] px-6 py-2.5 font-body text-lg shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--accent)] hover:text-white hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                      >
                        {t('apod.viewOnNasa')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="font-body text-sm leading-relaxed apod-explanation">
                {apod.explanation}
              </p>
              <p className="font-body text-xs">
                <a
                  href={`https://apod.nasa.gov/apod/ap${apod.date.replace(/-/g, '').slice(2)}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-blue)] underline hover:text-[var(--accent)]"
                >
                  → {t('apod.sourceLink')}
                </a>
              </p>
              {apod.copyright && (
                <p className="font-body text-xs opacity-60">
                  {t('apod.copyright')}: {apod.copyright}
                </p>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="font-body text-center text-lg opacity-70">
            {t('apod.error')}
          </p>
        </Card>
      )}
    </div>
  );
}
