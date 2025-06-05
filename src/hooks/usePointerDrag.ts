// hooks/usePointerDrag.ts
import React, { useEffect, useRef } from 'react';

export interface DragTarget {
    x: number;
    y: number;
    draggable?: boolean;
}

export interface PointerDragOptions {
    origin: { x: number; y: number };
    scale: number;
    snap?: number | ((x: number, y: number) => [number, number]);
    isLocked?: boolean;
    hitRadius?: number; // In graph units
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

export function usePointerDrag<T extends DragTarget>(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    items: T[],
    onChange: (updated: T[]) => void,
    {
        origin,
        scale,
        snap,
        isLocked = false,
        hitRadius = 0.3,
        onDragStart = () => null,
        onDragEnd = () => null,
    }: PointerDragOptions
): void {
    const dragIndexRef = useRef<number | null>(null);
    const itemsRef = useRef(items);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    function getCanvasCoords(e: PointerEvent): { x: number; y: number } {
        const rect = canvasRef.current!.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const x = (mx - origin.x) / scale;
        const y = (origin.y - my) / scale;
        return { x, y };
    }

    function isNear(p: { x: number; y: number }, v: DragTarget): boolean {
        const dx = p.x - v.x;
        const dy = p.y - v.y;
        return dx * dx + dy * dy <= hitRadius * hitRadius;
    }

    function applySnap(x: number, y: number): [number, number] {
        if (typeof snap === 'function') return snap(x, y);
        if (typeof snap === 'number' && snap > 0) {
            return [Math.round(x / snap) * snap, Math.round(y / snap) * snap];
        }
        return [x, y];
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleDown = (e: PointerEvent) => {
            if (isLocked) return;
            const coords = getCanvasCoords(e);
            const index = items.findIndex(
                (item) => item.draggable && isNear(coords, item)
            );
            if (index !== -1) {
                dragIndexRef.current = index;
                canvas.setPointerCapture(e.pointerId);
                onDragStart?.()
            }

        };

        const handleMove = (e: PointerEvent) => {
            if (isLocked) return;
            if (dragIndexRef.current === null) return;
            const coords = getCanvasCoords(e);
            const [x, y] = applySnap(coords.x, coords.y);
            const updated = itemsRef.current.map((item, i) =>
                i === dragIndexRef.current ? { ...item, x, y } : item
            );
            onChange(updated);
        };

        const handleUp = (e: PointerEvent) => {
            dragIndexRef.current = null;
            canvas.releasePointerCapture(e.pointerId);
            onDragEnd?.()
        };

        canvas.addEventListener('pointerdown', handleDown);
        canvas.addEventListener('pointermove', handleMove);
        canvas.addEventListener('pointerup', handleUp);
        canvas.addEventListener('pointercancel', handleUp);

        return () => {
            canvas.removeEventListener('pointerdown', handleDown);
            canvas.removeEventListener('pointermove', handleMove);
            canvas.removeEventListener('pointerup', handleUp);
            canvas.removeEventListener('pointercancel', handleUp);
        };
    }, [canvasRef, items, onChange, origin, scale, snap, isLocked, hitRadius]);
}
