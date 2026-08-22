import React, { useEffect, useRef } from 'react';

export type BackgroundStyle = 'particles' | 'grid' | 'code' | 'cosmic' | 'off';

interface InteractiveBackgroundProps {
  style?: BackgroundStyle;
  opacity?: number;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  style = 'particles',
  opacity = 0.6
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (style === 'off') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle Constellation setup
    const particlesCount = Math.min(Math.floor((width * height) / 18000), 70);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = ['#818cf8', '#a78bfa', '#38bdf8', '#34d399', '#f472b6'];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Grid / Code setup
    let gridOffset = 0;
    const codeSnippets = ['01', 'AI', 'PROMPT', 'CODE', 'GEMINI', 'AST', 'GIT', 'PEGA', 'CWE', 'LLM', '101', 'PRIYA'];
    const codeDrops: Array<{ x: number; y: number; text: string; speed: number; opacity: number }> = [];

    for (let i = 0; i < 25; i++) {
      codeDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (style === 'particles') {
        // Render Neural Particles & Constellation Lines
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Connect nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(129, 140, 248, ${0.25 * (1 - dist / 130)})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      } else if (style === 'grid') {
        // Cybernetic Hologram Grid
        gridOffset = (gridOffset + 0.4) % 40;
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
        ctx.lineWidth = 1;

        // Vertical Grid lines
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal Grid lines (moving)
        for (let y = gridOffset; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (style === 'code') {
        // Floating Code Telemetry
        ctx.font = '10px monospace';
        for (let i = 0; i < codeDrops.length; i++) {
          const drop = codeDrops[i];
          drop.y += drop.speed;
          if (drop.y > height) {
            drop.y = -20;
            drop.x = Math.random() * width;
            drop.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          }

          ctx.fillStyle = `rgba(52, 211, 153, ${drop.opacity})`;
          ctx.fillText(drop.text, drop.x, drop.y);
        }
      } else if (style === 'cosmic') {
        // Ambient Cosmic Glowing Nebulae
        const time = Date.now() * 0.0005;

        const g1 = ctx.createRadialGradient(
          width * 0.2 + Math.sin(time) * 100,
          height * 0.3 + Math.cos(time) * 80,
          20,
          width * 0.2,
          height * 0.3,
          width * 0.4
        );
        g1.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
        g1.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        const g2 = ctx.createRadialGradient(
          width * 0.8 - Math.cos(time) * 120,
          height * 0.7 + Math.sin(time) * 90,
          30,
          width * 0.8,
          height * 0.7,
          width * 0.5
        );
        g2.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
        g2.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [style]);

  if (style === 'off') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{ opacity }}
        className="absolute inset-0 w-full h-full"
      />

      {/* Radial Ambient Vignette Gradient */}
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none" />
    </div>
  );
};
