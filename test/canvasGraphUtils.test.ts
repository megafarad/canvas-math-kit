import { describe, it, expect } from 'vitest';
import { toCanvas, snapToGrid } from '../src';

describe('canvasGraphUtils', () => {
    describe('toCanvas', () => {
        it('transforms coordinates correctly with given origin and scale', () => {
            const origin = { x: 200, y: 200 };
            const scale = 40;

            expect(toCanvas(0, 0, origin, scale)).toEqual({ x: 200, y: 200 });
            expect(toCanvas(1, 1, origin, scale)).toEqual({ x: 240, y: 160 });
            expect(toCanvas(-2, 3, origin, scale)).toEqual({ x: 120, y: 80 });
        });
    });

    describe('snapToGrid', () => {
        it('snaps to the nearest whole number if grid size is 1', () => {
            expect(snapToGrid(1.6, -2.3, 1)).toEqual([2, -2]);
            expect(snapToGrid(-0.4, 0.4, 1)).toEqual([0, 0]);
        });

        it('snaps to the nearest half when grid size is 0.5', () => {
            expect(snapToGrid(1.49, 1.26, 0.5)).toEqual([1.5, 1.5]);
            expect(snapToGrid(-1.24, -0.76, 0.5)).toEqual([-1, -1]);
        });

        it('handles zero and negative grid size gracefully (no snap)', () => {
            expect(snapToGrid(1.7, 2.3, 0)).toEqual([1.7, 2.3]);
            expect(snapToGrid(1.7, 2.3, -1)).toEqual([1.7, 2.3]);
        });
    });
});
