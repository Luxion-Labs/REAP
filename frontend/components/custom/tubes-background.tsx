"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Use eval-based dynamic import so TypeScript does not try to resolve remote URL modules.
        const remoteUrl = 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js';
        const module = await (0, eval)(`import(/* webpackIgnore: true */ "${remoteUrl}")`);
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#ffffff", "#94A3B8", "#475569"],
            lights: {
              intensity: 150,
              colors: ["#ffffff", "#94A3B8", "#E2E8F0", "#F8FAFC"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {
          // The library handles internal resize, but we can trigger it if needed
        };

        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    // Maintain theme-appropriate colors even on click, or randomize within a range
    const themeColors = ["#ffffff", "#94A3B8", "#E2E8F0", "#F8FAFC", "#CBD5E1", "#475569"];
    const getRandomThemeColors = (count: number) => {
      return [...themeColors].sort(() => 0.5 - Math.random()).slice(0, count);
    };

    tubesRef.current.tubes.setColors(getRandomThemeColors(3));
    tubesRef.current.tubes.setLightsColors(getRandomThemeColors(4));
  };

  return (
    <div 
      className={cn("relative w-full h-full min-h-[400px] overflow-hidden bg-[#080808]", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      <div className="absolute inset-0 bg-black/22" />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
