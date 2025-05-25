// canvasGraphUtils.ts

export interface Point {
    x: number;
    y: number;
}

export function toCanvas(x: number, y: number, origin: Point, scale: number): Point {
    return {
        x: origin.x + x * scale,
        y: origin.y - y * scale,
    };
}

export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) {
    ctx.strokeStyle = '#eee';
    for (let x = 0; x <= width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

export function drawAxes(ctx: CanvasRenderingContext2D, width: number, height: number, origin: Point) {
    ctx.strokeStyle = '#aaa';
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);
    ctx.stroke();
}

export function drawVector(
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    color: string,
    width: number = 2
) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function drawArrowhead(
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    color: string
) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return;

    const angle = Math.atan2(dy, dx);
    const headlen = 10;

    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
        to.x - headlen * Math.cos(angle - Math.PI / 6),
        to.y - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        to.x - headlen * Math.cos(angle + Math.PI / 6),
        to.y - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

export function drawCircle(
    ctx: CanvasRenderingContext2D,
    center: Point,
    radius: number,
    color: string
) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

export function snapToGrid(x: number, y: number, gridSize: number): [number, number] {
    if (gridSize <= 0) return [x, y]; // no snapping
    const round = (v: number) => {
        const snapped = Math.round(v / gridSize) * gridSize;
        return Object.is(snapped, -0) ? 0 : snapped;
    };
    return [round(x), round(y)];
}

