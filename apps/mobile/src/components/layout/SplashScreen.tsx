import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Radio, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2400,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Syncing IMD-WRF Radar Grid...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        if (next > 70) {
          setStatusText('Calibrating Biometeorological Models...');
        } else if (next > 35) {
          setStatusText('Connecting to National Weather Feeds...');
        }
        return next;
      });
    }, durationMs / 25);

    const timer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [durationMs, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#0E0E12] text-white overflow-hidden select-none"
    >
      {/* Ambient Atmospheric Glow & Radar Waves */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial Ambient Gradient */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-sky-500/15 blur-[90px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-indigo-500/10 blur-[80px]" />

        {/* Concentric Radar Wave Rings */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            className="absolute w-44 h-44 rounded-full border border-sky-400/30"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.6, ease: 'easeOut' }}
            className="absolute w-44 h-44 rounded-full border border-sky-400/20"
          />
        </div>
      </div>

      {/* Top Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pt-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
          Govt. of India • MoES
        </span>
      </motion.div>

      {/* Central Hero Emblem & Logo Animation */}
      <div className="flex flex-col items-center text-center space-y-4 my-auto relative z-10">
        {/* Popping Logo Container */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
          className="relative group"
        >
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 opacity-40 blur-xl animate-pulse" />
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-[#18181D] border-2 border-white/15 p-3 flex items-center justify-center shadow-2xl shadow-sky-500/20">
            <img
              src="/logo.png"
              alt="IMD Official Logo"
              className="h-full w-full object-contain drop-shadow-md"
            />
          </div>
        </motion.div>

        {/* App Title & Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-1">
              मौसम<span className="text-sky-400">+</span>
            </h1>
            <span className="text-xl sm:text-2xl font-heading font-light text-slate-400">
              Mausam+
            </span>
          </div>

          <p className="text-xs font-semibold text-sky-400/90 tracking-wide uppercase">
            India Meteorological Department
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs font-medium">
            AI-Personalized Weather Telemetry & Hyperlocal Advisory
          </p>
        </motion.div>
      </div>

      {/* Bottom Progress Bar & Telemetry Status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-xs space-y-2 pb-6 text-center"
      >
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
            {statusText}
          </span>
          <span className="font-mono text-sky-400">{progress}%</span>
        </div>

        {/* Progress Track */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
