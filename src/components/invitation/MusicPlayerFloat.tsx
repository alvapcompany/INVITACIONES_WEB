import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { luxuryAudio } from '../../lib/audioManager';
import { ThemeConfig } from '../../types';

interface MusicPlayerFloatProps {
  musicUrl: string;
  musicTitle: string;
  themeConfig: ThemeConfig;
}

export const MusicPlayerFloat: React.FC<MusicPlayerFloatProps> = ({
  musicUrl,
  musicTitle,
  themeConfig,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsubscribe = luxuryAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    luxuryAudio.togglePlay(musicUrl);
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = luxuryAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs">
      <div
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300"
        style={{
          backgroundColor: 'rgba(10, 15, 20, 0.88)',
          borderColor: themeConfig.goldBorder,
          boxShadow: `0 8px 32px -4px ${themeConfig.waxSealColor}66`,
        }}
      >
        {/* Play/Pause Button */}
        <button
          onClick={handleToggle}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow transition-transform active:scale-95"
          style={{
            backgroundColor: themeConfig.waxSealColor,
            color: '#ffffff',
          }}
          title={isPlaying ? 'Pausar música' : 'Reproducir música'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        {/* Music Waves Visualizer */}
        <div className="flex items-end gap-0.5 h-4 w-5 px-0.5" onClick={handleToggle}>
          {[1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'h-1'
              }`}
              style={{
                backgroundColor: themeConfig.audioVisualizerColor,
                height: isPlaying ? `${(bar % 2 === 0 ? 14 : 9) + Math.random() * 4}px` : '3px',
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div className="flex flex-col cursor-pointer max-w-[120px] sm:max-w-[160px] truncate" onClick={handleToggle}>
          <span className="text-[10px] text-amber-300/80 uppercase tracking-widest font-semibold flex items-center gap-1">
            <Music className="w-2.5 h-2.5" />
            <span>Música de Fondo</span>
          </span>
          <span className="text-xs text-white/90 truncate font-medium">
            {musicTitle || 'Música de Gala'}
          </span>
        </div>

        {/* Mute Toggle */}
        <button
          onClick={handleMute}
          className="text-stone-400 hover:text-white p-1 transition-colors"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
