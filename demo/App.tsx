import React, {useState} from 'react';
import {GraphCanvas} from "../src";
import {CanvasVector} from "../src";
import {CanvasParallelogram} from "../src/GraphCanvas";

const App = () => {
    const [vectors, setVectors] = useState<CanvasVector[]>([
            { x: 1, y: 1, color: 'red', draggable: true, headStyle: 'circle' },
            { x: 2, y: 0.5, color: 'blue', headStyle: 'arrow' },
            { x: -1, y: 1, color: 'green', headStyle: 'both', draggable: true },
            { x: -0.5, y: -0.5, headStyle: 'none' }
        ]
    );

    const parallelograms: CanvasParallelogram[] = [
        {
            vectorA: {
                x: 1,
                y: 0
            },
            vectorB: {
                x: 0,
                y: 1
            }
        }
    ]

    return (
        <div style={{ padding: 20 }}>
            <h1>Canvas Math Kit Demo</h1>
            <GraphCanvas
                width={400}
                height={400}
                scale={40}
                vectors={vectors}
                parallelograms={parallelograms}
                snap={.5}
                onVectorsChange={setVectors}
            />
        </div>
    );
};

export default App;