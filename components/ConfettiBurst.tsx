"use client";

import React, { useEffect, useRef } from "react";

export default function ConfettiBurst({ run = true }: { run?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!run || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const confettiCount = 50;
    const confetti: { x: number; y: number; r: number; d: number; color: string }[] = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.2,
      r: 6 + Math.random() * 6,
      d: Math.random() * 2 + 1,
      color: ["#FFD700", "#00FF85", "#FFFFFF", "#FF3B5C"][Math.floor(Math.random() * 4)]
    }));

    let frame = 0;
    let animationId: number;

    function draw() {
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);

      for (const c of confetti) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.r * 0.01);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.r, -c.r, c.r * 2, c.r * 2);
        ctx.restore();

        c.y += c.d + Math.sin(frame / 8 + c.x);
        c.x += Math.sin(frame / 12 + c.y) * 0.7;
      }

      frame++;
      if (frame < 100) animationId = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, W, H);
    }

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [run]);

  return (
    <canvas ref={ref} className="fixed inset-0 pointer-events-none z-[9999]" />
  );
}
