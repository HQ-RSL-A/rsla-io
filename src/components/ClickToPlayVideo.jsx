import { useState } from 'react';
import { Play } from 'lucide-react';
import { videoPlayer } from '@/lib/videoPlayer';

// A video host's player sets its own cookies the moment its iframe loads, before the visitor has made any
// cookie choice. So nothing loads until the visitor presses play: that press is the visitor asking for the video.
export default function ClickToPlayVideo({ url, title, className = '' }) {
    const [playing, setPlaying] = useState(false);
    const player = videoPlayer(url);
    if (!player) return null;

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {playing ? (
                <iframe
                    src={player.src}
                    title={title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play video: ${title}`}
                    className="group absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 bg-surfaceAlt cursor-pointer"
                >
                    <span className="flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white shadow-lg transition-transform duration-200 group-hover:scale-105">
                        <Play className="w-7 h-7 ml-1" fill="currentColor" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-sans text-textMuted">Plays from {player.provider}</span>
                </button>
            )}
        </div>
    );
}
