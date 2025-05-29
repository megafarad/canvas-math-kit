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
    ctx.save();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    const originX = width / 2;
    const originY = height / 2;

    const startX = -Math.floor(originX / scale);
    const endX = Math.ceil((width - originX) / scale);
    const startY = -Math.floor(originY / scale);
    const endY = Math.ceil((height - originY) / scale);

    for (let i = startX; i <= endX; i++) {
        const x = originX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let j = startY; j <= endY; j++) {
        const y = originY - j * scale;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.restore();
}

export function drawAxes(ctx: CanvasRenderingContext2D, width: number, height: number, origin: Point) {
    ctx.save();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);
    ctx.stroke();

    ctx.restore();
}

export function drawLine(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
}

export function drawArrowhead(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string) {
    const headLength = 10; // size in logical pixels
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

export function drawCircle(ctx: CanvasRenderingContext2D, center: Point, radius: number, color: string) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

export function drawParallelogram(
    ctx: CanvasRenderingContext2D,
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    fillColor?: string,
    strokeColor?: string
) {
    ctx.save();
    if (fillColor) {
        ctx.fillStyle = fillColor;
    }
    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
    }

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();

    if (fillColor) ctx.fill();
    if (strokeColor) ctx.stroke();

    ctx.restore();
}
