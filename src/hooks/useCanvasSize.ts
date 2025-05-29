// hooks/useCanvasSize.ts
import React, { useEffect } from 'react';

/**
 * Resizes the canvas to fill its container and scales the drawing context
 * to match the device's pixel ratio. Re-runs on window resize.
 */
export function useCanvasSize(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    { autoScale = true }: { autoScale?: boolean } = {}
): void {
    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            // Set the canvas pixel dimensions
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            // Optional: scale the context to match DPI
            if (autoScale) {
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // safer than scale()
            }
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [canvasRef, autoScale]);
}
