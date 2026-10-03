import React from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  type?: 'upload' | 'youtube' | 'facebook' | 'tiktok' | 'other';
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, type, title = "Video" }) => {
  if (!url) return null;

  // Helper to extract YouTube video ID
  const getYouTubeId = (inputUrl: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isYouTube = type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be');
  const isFacebook = type === 'facebook' || url.includes('facebook.com') || url.includes('fb.watch');
  const isTikTok = type === 'tiktok' || url.includes('tiktok.com');

  if (isYouTube) {
    const ytId = getYouTubeId(url);
    if (ytId) {
      return (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-border/50">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  if (isFacebook) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-border/50">
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`}
          title={title}
          className="w-full h-full border-0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct video file (data:video, blob, .mp4, .webm, or uploaded)
  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-border/50 flex items-center justify-center">
      <video
        src={url}
        controls
        playsInline
        className="w-full h-full object-contain"
      >
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
};
