import React from "react";

// Minimal confetti burst using canvas
export default function ConfettiBurst({ run }: { run: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!run || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const confettiCount = 42;
    const confetti: { x: number; y: number; r: number; d: number; color: string }[] = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.2,
      r: 6 + Math.random() * 6,
      d: Math.random() * 2 + 1,
      color: ["#FFD700", "#00FF85", "#fff", "#FF3B5C"][Math.floor(Math.random() * 4)]
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const c of confetti) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        c.y += c.d + Math.sin(frame / 8 + c.x);
        c.x += Math.sin(frame / 12 + c.y) * 0.7;
      }
      frame++;
      if (frame < 60) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, W, H);
    }
    draw();
    // Clean up
    return () => ctx.clearRect(0, 0, W, H);
  }, [run]);
  return (
    <canvas ref={ref} style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 9999
    }} width={window.innerWidth} height={window.innerHeight} />
  );
}
