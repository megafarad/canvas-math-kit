import React, { useState } from 'react';
import { GraphCanvas } from "../src";
import { CanvasVector } from "../src";
import { CanvasParallelogram } from "../src/components/GraphCanvas";
import './index.css';

const initialVectors: CanvasVector[] = [
    { x: 1, y: 1, color: 'red', draggable: true, headStyle: 'circle' },
    { x: 2, y: 0.5, color: 'blue', headStyle: 'arrow' },
    { x: -1, y: 1, color: 'green', headStyle: 'both', draggable: true },
    { x: -0.5, y: -0.5, headStyle: 'none' }
]

const App = () => {
    const [vectors, setVectors] = useState<CanvasVector[]>(initialVectors);

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
                            width={400}
                            height={400}
                            scale={40}
                            vectors={vectors}
                            parallelograms={parallelograms}
                            snap={0.5}
                            onVectorsChange={setVectors}
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Reset Vectors
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );

};

export default App;