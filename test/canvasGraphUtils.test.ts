import { describe, it, expect } from 'vitest';
import { toCanvas } from '../src';

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
});
