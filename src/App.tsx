import { useEffect, useRef, useState } from "react";

function App() {
  const defaultCellCount = 1600; // 40 * 40
  const defaultOrigin = 20 * 40 + 20; // (n / 2 * n) + n /2  n = sqrt(cellCount)
  const defaultCellSize = 20;
  const defaultGridState = Array.from({ length: defaultCellCount }, () => 0);

  const [cellCount, setCellCount] = useState(defaultCellCount);
  const [origin, setOrigin] = useState(defaultOrigin); // Middle cell will be cellCount / 2
  const [cellSize, setCellSize] = useState(defaultCellSize);
  const [vertices, setVertices] = useState<[number, number][]>([]);
  const [status, setStatus] = useState("No shape drawn.");
  const [gridState, setGridState] = useState(defaultGridState);

  const isDrawing = useRef(false);

  // Update origin if cellCount changes
  useEffect(() => {
    const n = Math.sqrt(cellCount);
    setOrigin((n / 2) * n + n / 2);
  }, [cellCount]);

  const disableContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent) => {};

  const handleMouseMove = (e: React.MouseEvent) => {};

  const handleMouseUp = (e: React.MouseEvent) => {};

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-3xl font-semibold pt-5">2D Shape Grid Editor</h1>

        <div className=" flex gap-4 items-center">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-400 text-primary px-2 py-4 rounded-sm cursor-pointer font-bold select-none"
          >
            Clear Grid
          </button>
          <label htmlFor="cell-count-select">
            Grid Size:{" "}
            <select
              className="bg-gray-900 px-1 py-2 rounded-sm"
              defaultValue={cellCount}
              onChange={(e) => {
                setCellCount(parseInt(e.target.value));
              }}
              id="cell-count-select"
            >
              <option value={20 * 20}>20x20</option>
              <option value={30 * 30}>30x30</option>
              <option value={40 * 40}>40x40</option>
            </select>
          </label>
        </div>

        <div
          className="grid gap-[1px] bg-gray-900 shadow-md p-[1px] select-none "
          style={{
            gridTemplateColumns: `repeat(${Math.sqrt(
              cellCount
            ).toString()}, 1fr)`,
          }}
          onContextMenu={disableContextMenu}
        >
          {Array.from({ length: cellCount }).map((_, index) => (
            <div
              // No insertion or deletion happening so this is ok to ignore
              // eslint-disable-next-line react-x/no-array-index-key
              key={index}
              data-index={index}
              className={`${
                index === origin ? "bg-slate-800" : "bg-slate-600"
              } h-5 w-5 hover:bg-blue-300 cursor-pointer`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          ))}
        </div>

        <p className="select-none">{status}</p>

        <h3 className="text-xl select-none">Shape Vertices:</h3>
        <p className="output" id="output">
          [{vertices.map((vertice) => `[${vertice.toString()}]`)}]
        </p>
      </div>
    </div>
  );
}

export default App;
