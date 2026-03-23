"use client";

import { motion } from "motion/react";

interface ReapLogoProps {
  className?: string;
  size?: number;
}

export function ReapLogo({ className, size = 48 }: ReapLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 251 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <defs>
        <linearGradient id="silverGradient" x1="0" y1="0" x2="251" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="0.5" stopColor="#CBD5E1" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Official REAP "R" Path from reap.svg */}
      <motion.path 
        d="M0 86.0837H83.3739C95.9587 86.0837 106.865 87.4121 116.094 90.0689C125.323 92.6557 132.979 96.4311 139.061 101.395C145.144 106.359 149.654 112.407 152.59 119.538C155.596 126.669 157.1 134.745 157.1 143.764C157.1 149.846 156.365 155.649 154.897 161.173C153.429 166.626 151.157 171.66 148.081 176.274C145.074 180.889 141.264 185.014 136.649 188.649C132.035 192.215 126.617 195.186 120.394 197.564L156.051 250H115.36L84.5275 203.436H83.5837L33.2447 203.332V250H0V86.0837ZM84.2129 174.596C90.5053 174.596 95.9936 173.862 100.678 172.394C105.432 170.926 109.382 168.863 112.529 166.207C115.745 163.55 118.122 160.334 119.66 156.558C121.268 152.713 122.072 148.448 122.072 143.764C122.072 134.605 118.926 127.543 112.633 122.579C106.341 117.546 96.8676 115.029 84.2129 115.029H33.2447V174.596H84.2129Z" 
        fill="url(#silverGradient)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        filter="url(#glow)"
      />

      {/* Decorative dot from reap.svg enhanced with a pulse */}
      <motion.path 
        d="M235.718 23C235.718 26.3137 233.032 29 229.718 29C226.405 29 223.718 26.3137 223.718 23C223.718 19.6863 226.405 17 229.718 17C233.032 17 235.718 19.6863 235.718 23Z" 
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
