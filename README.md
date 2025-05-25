# 🎯 canvas-math-kit

A lightweight, interactive canvas-based vector visualizer for math, linear algebra, and ML education. Built with React + TypeScript.

Perfect for:
- 📐 Math and ML learning tools
- 🎓 Educational visualizations
- 🧮 Interactive vector diagrams

---

## 📦 Installation

```bash
npm install canvas-math-kit
````

---

## 🚀 Usage

```tsx
import { GraphCanvas, CanvasVector } from 'canvas-math-kit';

const [vectors, setVectors] = useState<CanvasVector[]>([
  { x: 1, y: 1, color: 'red', draggable: true, headStyle: 'circle' },
  { x: -0.5, y: 1.5, color: 'blue', headStyle: 'arrow' }
]);

<GraphCanvas
  width={400}
  height={400}
  scale={40}
  vectors={vectors}
  onVectorsChange={setVectors}
  snap={1} // optional: snap to grid
/>
```

---

## 🎛️ Props

### `<GraphCanvas />`

| Prop              | Type                                           | Description                     |
| ----------------- | ---------------------------------------------- | ------------------------------- |
| `width`           | `number`                                       | Width of the canvas (pixels)    |
| `height`          | `number`                                       | Height of the canvas (pixels)   |
| `scale`           | `number`                                       | Canvas units per grid square    |
| `vectors`         | `CanvasVector[]`                               | Array of vectors to render      |
| `onVectorsChange` | `(updated: CanvasVector[]) => void`            | Called when a vector is dragged |
| `snap`            | `number` or `(x: number, y: number) => [x, y]` | Optional snapping               |

---

## 🧩 `CanvasVector`

```ts
interface CanvasVector {
  x: number;
  y: number;
  color?: string;              // Defaults to 'blue'
  draggable?: boolean;         // Defaults to false
  headStyle?: 'arrow' | 'circle' | 'both' | 'none'; // Defaults to 'arrow'
  label?: string;              // (planned feature)
}
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
* [ ] Labels
* [ ] Hover highlights
* [ ] Animation support
* [ ] Export to PNG

---

## 📃 License

MIT