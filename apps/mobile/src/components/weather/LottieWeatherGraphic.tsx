import React from 'react';
import { motion } from 'framer-motion';

interface LottieWeatherGraphicProps {
  condition: string;
  isDay?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const LottieWeatherGraphic: React.FC<LottieWeatherGraphicProps> = ({
  condition,
  isDay = true,
  className = '',
  size = 'hero',
}) => {
  const norm = condition.toLowerCase();

  const isRain =
    norm.includes('rain') ||
    norm.includes('drizzle') ||
    norm.includes('shower') ||
    norm.includes('precipitation');

  const isThunder =
    norm.includes('thunder') ||
    norm.includes('storm') ||
    norm.includes('lightning') ||
    norm.includes('squall');

  const isSnow =
    norm.includes('snow') ||
    norm.includes('sleet') ||
    norm.includes('blizzard') ||
    norm.includes('hail');

  const isFog =
    norm.includes('fog') ||
    norm.includes('mist') ||
    norm.includes('haze') ||
    norm.includes('smog') ||
    norm.includes('dust') ||
    norm.includes('smoke');

  const isCloudy =
    norm.includes('cloud') ||
    norm.includes('overcast') ||
    norm.includes('gloomy');

  const isClear = norm.includes('clear') || norm.includes('sunny') || norm.includes('fair');

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    hero: 'w-44 h-44 sm:w-52 sm:h-52',
  }[size];

  // 1. Thunderstorm / Severe Storm Animated Scene
  if (isThunder) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        {/* Thunder Cloud Dark Backing */}
        <motion.div
          animate={{ scale: [1, 1.03, 1], y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500 drop-shadow-xl"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M 28 65 A 18 18 0 0 1 22 30 A 24 24 0 0 1 68 24 A 20 20 0 0 1 82 52 A 16 16 0 0 1 76 65 Z" />
          </svg>
        </motion.div>

        {/* Flashing Lightning Bolt */}
        <motion.div
          animate={{
            opacity: [0, 0, 1, 0, 0.8, 0, 0, 1, 0],
            scale: [0.95, 0.95, 1.05, 0.95, 1.05, 0.95, 0.95, 1.08, 0.95],
          }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.4, 0.42, 0.45, 0.47, 0.5, 0.85, 0.87, 0.9] }}
          className="absolute z-10 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
        >
          <svg viewBox="0 0 50 70" className="w-16 h-20 fill-current">
            <polygon points="28,2 10,36 24,36 16,68 40,28 26,28" />
          </svg>
        </motion.div>

        {/* Dynamic Raindrops */}
        <div className="absolute bottom-2 inset-x-4 flex justify-around">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 24], opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.16, ease: 'easeIn' }}
              className="w-1 h-3.5 rounded-full bg-sky-400"
            />
          ))}
        </div>
      </div>
    );
  }

  // 2. Rain & Drizzle Animated Scene
  if (isRain) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        {/* Soft Blue Rain Cloud */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center text-sky-400/90 dark:text-sky-300 drop-shadow-lg"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M 28 62 A 18 18 0 0 1 22 28 A 24 24 0 0 1 68 22 A 20 20 0 0 1 82 50 A 16 16 0 0 1 76 62 Z" />
          </svg>
        </motion.div>

        {/* Streaking Rain Streaks */}
        <div className="absolute -bottom-1 inset-x-5 flex justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [-4, 22], opacity: [0, 0.95, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.14, ease: 'easeIn' }}
              className="w-1 h-4 rounded-full bg-gradient-to-b from-sky-300 to-sky-500 shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // 3. Fog / Mist / Smog Animated Scene
  if (isFog) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <div className="w-full h-full flex flex-col justify-center gap-2.5 px-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ x: i % 2 === 0 ? [-8, 8, -8] : [8, -8, 8], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
              className={`h-2.5 rounded-full bg-gradient-to-r ${
                i === 1
                  ? 'from-slate-400/60 via-slate-300 to-slate-400/60 w-3/4 mx-auto'
                  : 'from-slate-400/40 via-slate-300/80 to-slate-400/40 w-full'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // 4. Snow / Hail Scene
  if (isSnow) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center text-cyan-200 drop-shadow-md"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M 28 62 A 18 18 0 0 1 22 28 A 24 24 0 0 1 68 22 A 20 20 0 0 1 82 50 A 16 16 0 0 1 76 62 Z" />
          </svg>
        </motion.div>

        {/* Drifting Snow Particles */}
        <div className="absolute bottom-0 inset-x-4 flex justify-around">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 20], x: [0, i % 2 === 0 ? 4 : -4, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // 5. Partly Cloudy & Overcast Scene
  if (isCloudy) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        {/* Ambient Sun or Moon behind cloud */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-3 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)]"
        />

        {/* Foreground Drifting Cloud */}
        <motion.div
          animate={{ x: [-4, 4, -4], y: [0, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center text-slate-200 dark:text-slate-300 drop-shadow-xl"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M 28 66 A 18 18 0 0 1 22 32 A 24 24 0 0 1 68 26 A 20 20 0 0 1 82 54 A 16 16 0 0 1 76 66 Z" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // 6. Night Clear / Moonlit Scene
  if (!isDay) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        {/* Radiant Crescent Moon */}
        <motion.div
          animate={{ rotate: [-2, 2, -2], scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative text-indigo-200 drop-shadow-[0_0_25px_rgba(165,180,252,0.4)]"
        >
          <svg viewBox="0 0 100 100" className="w-32 h-32 fill-current">
            <path d="M 50 10 A 35 35 0 1 0 85 75 A 38 38 0 0 1 50 10 Z" />
          </svg>
        </motion.div>

        {/* Twinkling Stars */}
        {[
          { top: '15%', left: '20%', delay: 0 },
          { top: '25%', right: '15%', delay: 0.8 },
          { bottom: '25%', left: '25%', delay: 1.4 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: pos.delay, ease: 'easeInOut' }}
            style={pos}
            className="absolute w-2 h-2 rounded-full bg-indigo-100 shadow-[0_0_8px_white]"
          />
        ))}
      </div>
    );
  }

  // 7. Radiant Sunny / Clear Day Scene (Default)
  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
      {/* Rotating Sun Rays */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 flex items-center justify-center text-amber-400/40"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <rect
              key={idx}
              x="47"
              y="6"
              width="6"
              height="14"
              rx="3"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      </motion.div>

      {/* Core Glowing Sun Disc */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_35px_rgba(251,191,36,0.6)]"
      />
    </div>
  );
};
