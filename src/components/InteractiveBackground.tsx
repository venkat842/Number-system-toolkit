import React, { useEffect, useRef } from 'react';

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // State tracked in refs to avoid re-mounting animation loops
  const stateRef = useRef({
    currentValue: 2026,
    targetValue: 2026,
    prevX: null as number | null,
    // Store last changed timestamps for each character in each base
    digitTimestamps: {
      dec: {} as Record<number, number>,
      bin: {} as Record<number, number>,
      oct: {} as Record<number, number>,
      hex: {} as Record<number, number>,
    },
    prevStrings: {
      dec: '2026',
      bin: (2026).toString(2),
      oct: (2026).toString(8),
      hex: (2026).toString(16).toUpperCase(),
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const state = stateRef.current;
      if (state.prevX === null) {
        state.prevX = e.clientX;
        return;
      }
      const delta = e.clientX - state.prevX;
      state.prevX = e.clientX;

      // Sensitivity: mapping delta across viewport
      const sensitivity = 65535 / window.innerWidth;
      const change = Math.round(delta * sensitivity * 0.4);
      let nextVal = state.targetValue + change;
      if (nextVal < 0) nextVal = 0;
      if (nextVal > 65535) nextVal = 65535;

      state.targetValue = nextVal;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (time: number) => {
      const state = stateRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Smooth lerp towards targetValue
      if (state.currentValue !== state.targetValue) {
        const diff = state.targetValue - state.currentValue;
        if (Math.abs(diff) <= 1) {
          state.currentValue = state.targetValue;
        } else {
          state.currentValue = Math.round(state.currentValue + diff * 0.25);
        }

        // Compute string representations
        const decStr = state.currentValue.toString(10);
        const binStr = state.currentValue.toString(2);
        const octStr = state.currentValue.toString(8);
        const hexStr = state.currentValue.toString(16).toUpperCase();

        // Check per-digit changes
        const checkChanges = (
          type: 'dec' | 'bin' | 'oct' | 'hex',
          newStr: string,
          oldStr: string
        ) => {
          const maxLen = Math.max(newStr.length, oldStr.length);
          for (let i = 0; i < maxLen; i++) {
            if (newStr[i] !== oldStr[i]) {
              state.digitTimestamps[type][i] = time;
            }
          }
        };

        checkChanges('dec', decStr, state.prevStrings.dec);
        checkChanges('bin', binStr, state.prevStrings.bin);
        checkChanges('oct', octStr, state.prevStrings.oct);
        checkChanges('hex', hexStr, state.prevStrings.hex);

        state.prevStrings = {
          dec: decStr,
          bin: binStr,
          oct: octStr,
          hex: hexStr,
        };
      }

      ctx.clearRect(0, 0, width, height);

      // Current string values
      const decStr = state.prevStrings.dec;
      const binStr = state.prevStrings.bin;
      const octStr = state.prevStrings.oct;
      const hexStr = state.prevStrings.hex;

      // 1. Render Large Background Number (Center-Right)
      const bigFontSize = Math.max(width * 0.16, 120);
      ctx.font = `500 ${bigFontSize}px 'IBM Plex Mono', monospace`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const bigX = width * 0.88;
      const bigY = height * 0.44;

      // Render large number digits
      let currentBigX = bigX;
      for (let i = decStr.length - 1; i >= 0; i--) {
        const char = decStr[i];
        const changedAt = state.digitTimestamps.dec[i] || 0;
        const elapsed = time - changedAt;

        if (elapsed < 320) {
          const signalOpacity = Math.max(0, 1 - elapsed / 320);
          ctx.fillStyle = `rgba(255, 138, 0, ${0.15 + signalOpacity * 0.4})`;
        } else {
          ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        }

        ctx.fillText(char, currentBigX, bigY);
        currentBigX -= ctx.measureText(char).width;
      }

      // 2. Render 4 Columns (Decimal, Binary, Octal, Hex)
      const colStartY = height * 0.62;
      const columns = [
        { label: 'DECIMAL (BASE 10)', value: decStr, type: 'dec' as const },
        { label: 'BINARY (BASE 2)', value: binStr, type: 'bin' as const },
        { label: 'OCTAL (BASE 8)', value: octStr, type: 'oct' as const },
        { label: 'HEX (BASE 16)', value: hexStr, type: 'hex' as const },
      ];

      const colGap = Math.min(width * 0.22, 220);
      const startColX = Math.max(width * 0.25, width - colGap * 4 - 40);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      columns.forEach((col, cIdx) => {
        const cx = startColX + cIdx * colGap;

        // Label
        ctx.font = `500 11px 'IBM Plex Mono', monospace`;
        ctx.fillStyle = 'rgba(10, 10, 10, 0.22)';
        ctx.fillText(col.label, cx, colStartY);

        // Value digits
        ctx.font = `500 20px 'IBM Plex Mono', monospace`;
        let dx = cx;
        for (let i = 0; i < col.value.length; i++) {
          const char = col.value[i];
          const changedAt = state.digitTimestamps[col.type][i] || 0;
          const elapsed = time - changedAt;

          if (elapsed < 320) {
            const signalFade = Math.max(0, 1 - elapsed / 320);
            ctx.fillStyle = `rgba(255, 138, 0, ${0.4 + signalFade * 0.6})`;
          } else {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.18)';
          }

          ctx.fillText(char, dx, colStartY + 18);
          dx += ctx.measureText(char).width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};
