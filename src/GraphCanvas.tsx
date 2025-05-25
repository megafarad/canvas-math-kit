import React, { useEffect, useRef, useState } from 'react';
import {
    drawGrid,
    drawAxes,
    drawLine,
    drawArrowhead,
    drawCircle,
    drawParallelogram,
    toCanvas,
    Point,
    snapToGrid
} from './canvasGraphUtils';

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
    width: number;
    height: number;
    scale: number;
    vectors: CanvasVector[];
    parallelograms?: CanvasParallelogram[];
    snap?: number | ((x: number, y: number) => [number, number]);
    locked?: boolean;
    isLocked?: (vectors: CanvasVector[]) => boolean;
    onVectorsChange?: (updated: CanvasVector[]) => void;
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
                                                     isLocked,
                                                     onVectorsChange,
                                                     customDraw
                                                 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const origin: Point = { x: width / 2, y: height / 2 };
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const shouldLock = locked ?? isLocked?.(vectors) ?? false;

    // Draw vectors on canvas
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        drawGrid(ctx, width, height, scale);
        drawAxes(ctx, width, height, origin);

        vectors.forEach((vec) => {
            const from = toCanvas(0, 0, origin, scale);
            const to = toCanvas(vec.x, vec.y, origin, scale);
            const color = vec.color || 'blue';
            const style = vec.headStyle ?? 'arrow';

            // Always draw the line
            drawLine(ctx, from, to, color);

            // Optional head decorations
            if (style === 'arrow' || style === 'both') {
                drawArrowhead(ctx, from, to, color);
            }

            if (style === 'circle' || style === 'both') {
                drawCircle(ctx, to, 4, color);
            }
        });

        const fromPVec = (v: ParallelogramVector) => toCanvas(v.x, v.y, origin, scale);

        parallelograms?.forEach(p => {
            const p0 = toCanvas(0, 0, origin, scale);
            const p1 = fromPVec(p.vectorA);
            const p3 = fromPVec(p.vectorB);
            const p2 = { x: p1.x + (p3.x - p0.x), y: p1.y + (p3.y - p0.y) };
            drawParallelogram(ctx, p0, p1, p2, p3, p.fillColor, p.strokeColor);
        });

        if (customDraw) {
            try {
                customDraw(ctx, origin, scale);
            } catch (e) {
                console.error('customDraw threw error: ', e);
            }
        }

    }, [vectors, width, height, scale, parallelograms, customDraw]);

    // Handle dragging
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (let i = 0; i < vectors.length; i++) {
            const vec = vectors[i];
            if (shouldLock || !vec.draggable) continue;
            const head = toCanvas(vec.x, vec.y, origin, scale);
            const dist = Math.hypot(mx - head.x, my - head.y);
            if (dist < 10) {
                setDragIndex(i);
                break;
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (dragIndex === null) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        let vx = (mx - origin.x) / scale;
        let vy = (origin.y - my) / scale;

        // Apply snapping here
        if (typeof snap === 'number') {
            [vx, vy] = snapToGrid(vx, vy, snap);
        } else if (typeof snap === 'function') {
            [vx, vy] = snap(vx, vy);
        }

        const updated = vectors.map((vec, i) =>
            i === dragIndex ? { ...vec, x: vx, y: vy } : vec
        );
        onVectorsChange?.(updated);
    };


    const handleMouseUp = () => {
        setDragIndex(null);
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{cursor: dragIndex !== null ? 'grabbing' : 'default'}}
        />
    );
};

export default GraphCanvas;
