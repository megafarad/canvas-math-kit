# 🎯 canvas-math-kit

A lightweight, interactive canvas-based vector visualizer for math, linear algebra, and ML education. Built with React + TypeScript.

Perfect for:
- 📐 Math and ML learning tools
- 🎓 Educational visualizations
- 🧮 Interactive vector diagrams

---

## 📦 Installation

```bash
npm install @sirhc77/canvas-math-kit
````

### 📦 Import

```tsx
import { GraphCanvas, type CanvasVector, type CanvasParallelogram } from '@sirhc77/canvas-math-kit';
```

---

### 🎛️ `<GraphCanvas />` Props

| Prop                        | Type                                                                  | Description                                                         |
|-----------------------------|-----------------------------------------------------------------------|---------------------------------------------------------------------|
| `width`                     | `number`                                                              | Width of the canvas in pixels                                       |
| `height`                    | `number`                                                              | Height of the canvas in pixels                                      |
| `scale`                     | `number`                                                              | Pixels per unit                                                     |
| `vectors`                   | `CanvasVector[]` *(optional)*                                         | Vectors to render and optionally drag                               |
| `onVectorsChange`           | `(updated: CanvasVector[]) => void` *(optional)*                      | Callback fired when a draggable vector is moved                     |
| `snap`                      | `number` \| `(x: number, y: number) => [number, number]` *(optional)* | Enables snapping to a grid or custom logic                          |
| `locked`                    | `boolean` *(optional)*                                                | If `true`, disables all dragging                                    |
| `parallelograms`            | `CanvasParallelogram[]` *(optional)*                                  | Areas formed by two vectors, filled and outlined                    |
| `customDragTargets`         | `DragTarget[]` *(optional)*                                           | Items other than vectors that are draggable                         |
| `onCustomDragTargetsChange` | `(updated: DragTarget[]) => void` *(optional)*                        | Callback fired when a custonm drag target is moved                  |
| `customDraw`                | `(ctx, origin, scale) => void` *(optional)*                           | Custom canvas drawing logic (runs after vectors and parallelograms) |

---

### 🧩 `CanvasVector` Type

```ts
type VectorHeadStyle = 'arrow' | 'circle' | 'both' | 'none';

interface CanvasVector {
  x: number;
  y: number;
  color?: string;              // Default: 'blue'
  draggable?: boolean;         // Default: false
  headStyle?: VectorHeadStyle; // Default: 'arrow'
  label?: string;
  width?: number;
}
```

---

### 🔷 `CanvasParallelogram` Type

```ts
interface CanvasParallelogram {
  vectorA: { x: number; y: number };
  vectorB: { x: number; y: number };
  fillColor?: string;   // Default: translucent blue
  strokeColor?: string; // Default: darker blue
}
```

---

### 🧪 Example Usage

```tsx
<GraphCanvas
  width={400}
  height={400}
  scale={40}
  vectors={[
    { x: 2, y: 1, color: 'red', draggable: true, headStyle: 'both' },
    { x: -1, y: 2, color: 'green', headStyle: 'circle' }
  ]}
  parallelograms={[
    {
      vectorA: { x: 2, y: 1 },
      vectorB: { x: -1, y: 2 },
      fillColor: 'rgba(255, 0, 0, 0.1)',
      strokeColor: 'rgba(255, 0, 0, 0.4)'
    }
  ]}
  snap={1}
  customDraw={(ctx, origin, scale) => {
    const p = (x: number, y: number) => toCanvas(x, y, origin, scale);
    drawLine(ctx, p(-3, 0), p(3, 0), 'black', 1, true);
  }}
/>
```

---

## 🧪 Example Projects

Try out the demo locally:

```bash
cd demo
npm install
npm run dev
```

Or check the [live demo](#) (coming soon).

---

## 🛠️ Roadmap

* [x] Draggable vectors
* [x] Snapping support
* [x] Per-vector styling
* [x] Labels
* [ ] Hover highlights
* [ ] Animation support
* [ ] Export to PNG

---

## 📃 License

MIT