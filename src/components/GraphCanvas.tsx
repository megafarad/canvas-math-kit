import React, { useEffect, useRef, useState } from 'react';
import {DragTarget, usePointerDrag} from "../hooks/usePointerDrag";
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
    label?: string | ((x: number, y: number) => string);
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
    width: number;
    height: number;
    scale: number;
    vectors?: CanvasVector[];
    parallelograms?: CanvasParallelogram[];
    snap?: number | ((x: number, y: number) => [number, number]);
    locked?: boolean;
    onVectorsChange?: (updated: CanvasVector[]) => void;
    customDragTargets?: DragTarget[];
    onCustomDragTargetsChange?: (updated: DragTarget[]) => void;
    customDraw?: (ctx: CanvasRenderingContext2D, origin: Point, scale: number) => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
                                                     width,
                                                     height,
                                                     scale,
                                                     vectors,
                                                     parallelograms,
                                                     snap,
                                                     locked,
                                                     onVectorsChange,
                                                     customDragTargets,
                                                     onCustomDragTargetsChange,
                                                     customDraw
                                                 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dragging, setDragging] = useState(false);
    const shouldLock = locked ?? false;

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });


    useEffect(() => {
        const resize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 600) {
                // Mobile-ish: use full width, cap height to maintain square
                const size = Math.min(screenWidth - 20, 300); // give some margin
                setCanvasSize({ width: size, height: size });
            } else {
                setCanvasSize({ width: width, height: height });
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

        canvas.width = canvasSize.width * dpr;
        canvas.height = canvasSize.height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr); // this affects only the rendering, not the logical units

        const origin: Point = {
            x: canvasSize.width / 2,
            y: canvasSize.height / 2,
        };

        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        drawGrid(ctx, logicalWidth, logicalHeight, scale);
        drawAxes(ctx, logicalWidth, logicalHeight, origin);

        vectors?.forEach((vec) => {
            const from = toCanvas(0, 0, origin, scale);
            const to = toCanvas(vec.x, vec.y, origin, scale);
            const color = vec.color || 'blue';
            const style = vec.headStyle ?? 'arrow';

            drawLine(ctx, from, to, color);
            if (style === 'arrow' || style === 'both') drawArrowhead(ctx, from, to, color);
            if (style === 'circle' || style === 'both') drawCircle(ctx, to, 4, color); // 4 is already in logical units
            if (vec.label) {
                const label = typeof vec.label === 'string' ? vec.label : vec.label(vec.x, vec.y);
                ctx.save();
                ctx.font = '12px sans-serif';
                ctx.fillStyle = color;
                ctx.fillText(label, to.x + 5, to.y - 5);
                ctx.restore();
            }
        });

        parallelograms?.forEach(p => {
            const vA = p.vectorA;
            const vB = p.vectorB;
            const p0 = toCanvas(0, 0, origin, scale);
            const p1 = toCanvas(vA.x, vA.y, origin, scale);
            const p2 = toCanvas(vA.x + vB.x, vA.y + vB.y, origin, scale);
            const p3 = toCanvas(vB.x, vB.y, origin, scale);

            drawParallelogram(ctx, p0, p1, p2, p3, p.fillColor, p.strokeColor);
        });

        if (customDraw) {
            try {
                customDraw(ctx, origin, scale);
            } catch (e) {
                console.error('customDraw threw error: ', e);
            }
        }

    }, [vectors, scale, parallelograms, customDraw, canvasSize]);

    usePointerDrag(canvasRef, vectors ?? [], onVectorsChange ?? (() => {}), {
        origin: { x: canvasSize.width / 2, y: canvasSize.height / 2 },
        scale: scale,
        snap,
        isLocked: shouldLock,
        onDragStart: () => setDragging(true),
        onDragEnd: () => setDragging(false),
    });

    usePointerDrag(canvasRef, customDragTargets ?? [], onCustomDragTargetsChange ?? (() => {}), {
        origin: { x: canvasSize.width / 2, y: canvasSize.height / 2 },
        scale: scale,
        snap,
        isLocked: shouldLock,
        onDragStart: () => setDragging(true),
        onDragEnd: () => setDragging(false)
    });

    return (
        <canvas
            ref={canvasRef}
            className="border"
            style={{
                width: canvasSize.width + 'px',
                height: canvasSize.height + 'px',
                touchAction: 'none',
                cursor: dragging ? 'grabbing' : 'grab',
            }}
        />

    );
};

export default GraphCanvas;
