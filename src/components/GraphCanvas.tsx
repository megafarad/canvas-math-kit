import React, { useEffect, useRef, useState } from 'react';
import { usePointerDrag } from "../hooks/usePointerDrag";
import {
    drawGrid,
    drawAxes,
    drawLine,
    drawArrowhead,
    drawCircle,
    drawParallelogram,
    toCanvas,
    Point,
} from '../utils/canvasGraphUtils';

export type VectorHeadStyle = 'arrow' | 'circle' | 'both' | 'none';

export interface CanvasVector {
    x: number;
    y: number;
    color?: string;
    draggable?: boolean;
    headStyle?: VectorHeadStyle;
    label?: string;
}

export interface ParallelogramVector {
    x: number;
    y: number;
}

export interface CanvasParallelogram {
    vectorA: ParallelogramVector;
    vectorB: ParallelogramVector;
    fillColor?: string;
    strokeColor?: string;
}

interface GraphCanvasProps {
    scale: number;
    vectors?: CanvasVector[];
    parallelograms?: CanvasParallelogram[];
    snap?: number | ((x: number, y: number) => [number, number]);
    locked?: boolean;
    onVectorsChange?: (updated: CanvasVector[]) => void;
    customDraw?: (ctx: CanvasRenderingContext2D, origin: Point, scale: number) => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
                                                     scale,
                                                     vectors,
                                                     parallelograms,
                                                     snap,
                                                     locked,
                                                     onVectorsChange,
                                                     customDraw
                                                 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dragging, setDragging] = useState(false);
    const shouldLock = locked ?? false;

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const dpr = window.devicePixelRatio || 1;// user-friendly
    const scaleDevice = scale * dpr; // actual pixels per unit

    useEffect(() => {
        const resize = () => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                setCanvasSize({ width: rect.width, height: rect.height });
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const logicalWidth = rect.width;
        const logicalHeight = rect.height;

        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr); // this affects only the rendering, not the logical units

        const origin: Point = { x: logicalWidth / 2, y: logicalHeight / 2 };

        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        drawGrid(ctx, logicalWidth, logicalHeight, scaleDevice);
        drawAxes(ctx, logicalWidth, logicalHeight, origin);

        vectors?.forEach((vec) => {
            const from = toCanvas(0, 0, origin, scaleDevice);
            const to = toCanvas(vec.x, vec.y, origin, scaleDevice);
            const color = vec.color || 'blue';
            const style = vec.headStyle ?? 'arrow';

            drawLine(ctx, from, to, color);
            if (style === 'arrow' || style === 'both') drawArrowhead(ctx, from, to, color);
            if (style === 'circle' || style === 'both') drawCircle(ctx, to, 4, color); // 4 is already in logical units
        });

        parallelograms?.forEach(p => {
            const vA = p.vectorA;
            const vB = p.vectorB;
            const p0 = toCanvas(0, 0, origin, scaleDevice);
            const p1 = toCanvas(vA.x, vA.y, origin, scaleDevice);
            const p2 = toCanvas(vA.x + vB.x, vA.y + vB.y, origin, scaleDevice);
            const p3 = toCanvas(vB.x, vB.y, origin, scaleDevice);

            drawParallelogram(ctx, p0, p1, p2, p3, p.fillColor, p.strokeColor);
        });

        if (customDraw) {
            try {
                customDraw(ctx, origin, scaleDevice);
            } catch (e) {
                console.error('customDraw threw error: ', e);
            }
        }

    }, [vectors, scale, parallelograms, customDraw, canvasSize]);

    usePointerDrag(canvasRef, vectors ?? [], onVectorsChange ?? (() => {}), {
        origin: { x: canvasSize.width / 2, y: canvasSize.height / 2 },
        scale: scaleDevice,
        snap,
        isLocked: shouldLock,
        onDragStart: () => setDragging(true),
        onDragEnd: () => setDragging(false),
    });

    return (
        <canvas
            ref={canvasRef}
            className="border"
            style={{
                width: '100%',
                height: '100%',
                touchAction: 'none',
                cursor: dragging ? 'grabbing' : 'grab',
            }}
        />
    );
};

export default GraphCanvas;
