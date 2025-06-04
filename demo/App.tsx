import React, { useState } from 'react';
import {drawArrowhead, drawCircle, drawLine, GraphCanvas, Point, toCanvas, writeLabel} from "../src";
import { CanvasVector } from "../src";
import { CanvasParallelogram } from "../src";
import './index.css';
import {DragTarget} from "../src";

const initialPoints: DragTarget = { x: 2, y: 2, draggable: true };

const width = 400;
const height = 400;
const scale = 30;

const initialVectors: CanvasVector[] = [
    { x: 1, y: 1, color: 'red', draggable: true, headStyle: 'circle', label: 'v₁' },
    { x: 2, y: 0.5, color: 'blue', headStyle: 'arrow', label: 'v₂' },
    { x: -1, y: 1, color: 'green', headStyle: 'both', draggable: true },
    { x: -0.5, y: -0.5, headStyle: 'none' }
]

const App = () => {
    const [vectors, setVectors] = useState<CanvasVector[]>(initialVectors);
    const [points, setPoints] = useState<DragTarget>(initialPoints);

    const gradients: DragTarget = {
            x: 2 * points.x,
            y: 2 * points.y,
        }
    ;

    const magnitude = Math.hypot(gradients.x, gradients.y);

    const parallelograms: CanvasParallelogram[] = [
        {
            vectorA: { x: 1, y: 0 },
            vectorB: { x: 0, y: 1 },
            fillColor: 'rgba(0,0,255,0.1)',
            strokeColor: 'rgba(0,0,0,255.4)',
        }
    ];

    const handleReset = () => {
        setVectors(initialVectors);
        setPoints(initialPoints);
    }

    const customDraw = (ctx: CanvasRenderingContext2D, origin: Point, scale: number) => {
        const pointCanvas = toCanvas(points.x, points.y, origin, scale);
        const gradientEnd = toCanvas(points.x + gradients.x * 0.2, points.y + gradients.y * 0.2, origin, scale);

        drawLine(ctx, pointCanvas, gradientEnd, 'red', 2);
        drawCircle(ctx, pointCanvas, 4, 'red');
        drawArrowhead(ctx, pointCanvas, gradientEnd, 'red');
        writeLabel(ctx, `Point: (${points.x}, ${points.y})`, 10, 20, '12px Arial');
        writeLabel(ctx, `Gradient: (2×${points.x}, 2×${points.y}) = (${gradients.x}, ${gradients.y})`, 10,
            40, '12px Arial' );
        writeLabel(ctx, `Magnitude: ${magnitude.toFixed(2)}`, 10, 60, '12px Arial' );
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Canvas Math Kit Demo</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Text content */}
                <div className="lg:w-1/3 space-y-4">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat velit vitae nulla
                        ultricies blandit. Curabitur sagittis sapien at justo tristique, at posuere neque finibus.
                    </p>
                    <p>
                        Integer suscipit lorem et mauris cursus, at varius sapien porta. Morbi ac rhoncus nisl, sit
                        amet luctus purus. Vivamus tincidunt diam sed diam pharetra.
                    </p>
                </div>

                {/* Canvas + button */}
                <div className="flex flex-col flex-1 h-[80vh] items-center">
                    <div className="w-full flex-1 items-center">
                        <GraphCanvas
                            width={width}
                            height={height}
                            scale={scale}
                            vectors={vectors}
                            parallelograms={parallelograms}
                            snap={0.5}
                            customDraw={customDraw}
                            customDragTargets={[points]}
                            onCustomDragTargetsChange={(dragTargets) => setPoints(dragTargets[0])}
                            onVectorsChange={setVectors}
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Reset Items
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );

};

export default App;