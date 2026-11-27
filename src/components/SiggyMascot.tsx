'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SiggyMascotProps {
  size?: number;
  variant?: 'hero' | 'avatar';
  className?: string;
}

export function SiggyMascot({
  size = 84,
  variant = 'avatar',
  className = '',
}: SiggyMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 160, damping: 18 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (variant === 'hero') {
    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full flex items-center justify-center py-4 [perspective:900px] ${className}`}
      >
        {/* Floating 3D Glass Pill 1 (Top Left) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-2 left-1 sm:left-3 z-20 px-3 py-1.5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_8px_24px_rgba(180,110,100,0.14)] text-[11px] font-bold text-[#2D213A] flex items-center gap-1.5"
        >
          <span>✨ Smart Problem Farming</span>
        </motion.div>

        {/* Floating 3D Glass Pill 2 (Bottom Right) */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.6,
          }}
          className="absolute bottom-3 right-1 sm:right-2 z-20 px-3 py-1.5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_8px_24px_rgba(180,110,100,0.14)] text-[11px] font-bold text-[#2D213A] flex items-center gap-1.5"
        >
          <span>🎯 Sistem Poin Otomatis</span>
        </motion.div>

        {/* 3D Floating & Interactive Tilt Mascot Image */}
        <motion.div
          style={{ rotateX, rotateY }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-[235px] sm:w-[270px] aspect-square rounded-3xl overflow-hidden shadow-[0_18px_40px_rgba(180,110,100,0.18)] border-4 border-white/80 bg-[#FDE8D7]"
        >
          <img
            src="/images/siggy-3d.png"
            alt="Siggy 3D Mascot"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden border-2 border-[#F4DFDA] shadow-sm bg-[#FDE8D7] shrink-0 ${className}`}
    >
      <img
        src="/images/siggy-3d.png"
        alt="Siggy Avatar"
        className="w-full h-full object-cover object-top scale-110 select-none pointer-events-none"
      />
    </motion.div>
  );
}
