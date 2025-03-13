import { useCallback, useEffect, useRef, useState } from "react";

type CellSizeValue = "Small" | "Medium" | "Large";

function App() {
  const defaultCellCount = 1600; // 40 * 40
  const defaultOrigin = 20 * 40 + 20; // (n / 2 * n) + n /2  n = sqrt(cellCount)
  const defaultGridState = Array.from({ length: defaultCellCount }, () => 0);

  const [cellCount, setCellCount] = useState(defaultCellCount);
  const [origin, setOrigin] = useState(defaultOrigin); // Middle cell will be cellCount / 2
  const [cellSize, setCellSize] = useState<CellSizeValue>("Medium");
  const [vertices, setVertices] = useState<[number, number][]>([]);
  const [status, setStatus] = useState("No shape drawn.");
  const [gridState, setGridState] = useState(defaultGridState);
  const [previewCells, setPreviewCells] = useState<number[]>([]);

  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const startCell = useRef(-1);
  const endCell = useRef(-1);

  // Update origin and grid state if cellCount changes
  useEffect(() => {
    const n = Math.sqrt(cellCount);
    setOrigin((n / 2) * n + n / 2);
    setGridState(Array.from({ length: cellCount }, () => 0));
  }, [cellCount]);

  const disableContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Get row and column from index
  const getRowCol = useCallback(
    (index: number) => {
      const gridSize = Math.sqrt(cellCount);
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      return { row, col };
    },
    [cellCount]
  );

  // Get index from row and column
  const getIndex = useCallback(
    (row: number, col: number) => {
      const gridSize = Math.sqrt(cellCount);
      return row * gridSize + col;
    },
    [cellCount]
  );

  // Find valid shape

  // Extract vertices from valid shape

  // Get cells in rectangle from startCell to endCell
  const getCellsInRectangle = (start: number, end: number) => {
    const startPos = getRowCol(start);
    const endPos = getRowCol(end);

    const minRow = Math.min(startPos.row, endPos.row);
    const maxRow = Math.max(startPos.row, endPos.row);
    const minCol = Math.min(startPos.col, endPos.col);
    const maxCol = Math.max(startPos.col, endPos.col);

    const cells: number[] = [];

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push(getIndex(row, col));
      }
    }

    return cells;
  };

  // Clear grid handler
  const handleClearGrid = () => {
    setGridState(Array.from({ length: cellCount }, () => 0));
    setVertices([]);
    setStatus("Grid cleared.");
    const n = Math.sqrt(cellCount);
    setOrigin((n / 2) * n + n / 2);
  };

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (e.button === 1) {
      setOrigin(index);
      return;
    } else if (e.button === 0) {
      // Left click
      isDrawing.current = true;
      isErasing.current = false;
    } else if (e.button === 2) {
      // Right click
      isDrawing.current = false;
      isErasing.current = true;
    }

    startCell.current = index;
    endCell.current = index;

    // For immediate feedback on click
    const newGrid = [...gridState];
    if (isDrawing.current) {
      newGrid[index] = 1;
    } else if (isErasing.current) {
      newGrid[index] = 0;
    }
    setGridState(newGrid);

    setStatus(isDrawing.current ? "Drawing..." : "Erasing...");
  };

  const handleMouseMove = (index: number) => {
    if (!isDrawing.current && !isErasing.current) return;

    endCell.current = index;

    // Calculate preview cells
    setPreviewCells(getCellsInRectangle(startCell.current, endCell.current));

    // Update status with preview information
    const cellCount = previewCells.length;
    setStatus(
      `${
        isDrawing.current ? "Drawing" : "Erasing"
      } preview: ${cellCount.toString()} cells`
    );
  };

  const handleMouseUp = () => {
    if (!isDrawing.current && !isErasing.current) return;

    // Apply the drawing/erasing to all cells in the rectangle
    const cellsToModify = getCellsInRectangle(
      startCell.current,
      endCell.current
    );
    const newGrid = [...gridState];

    cellsToModify.forEach((cellIndex) => {
      newGrid[cellIndex] = isDrawing.current ? 1 : 0;
    });

    setGridState(newGrid);

    setStatus(
      `${cellsToModify.length.toString()} cells ${
        isDrawing.current ? "drawn" : "erased"
      }.`
    );

    // Reset states
    isDrawing.current = false;
    isErasing.current = false;
    setPreviewCells([]);
  };

  const handleMouseLeave = () => {
    isDrawing.current = false;
    isErasing.current = false;
    setPreviewCells([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-3xl font-semibold pt-5">2D Shape Grid Editor</h1>

        <div className=" flex gap-4 items-center">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-400 text-primary px-2 py-4 rounded-sm cursor-pointer font-bold select-none"
            onClick={handleClearGrid}
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

          <label htmlFor="cell-count-select">
            Cell Size:{" "}
            <select
              className="bg-gray-900 px-1 py-2 rounded-sm"
              defaultValue={cellSize}
              onChange={(e) => {
                setCellSize(e.target.value as CellSizeValue);
              }}
              id="cell-count-select"
            >
              <option value={"Small"}>Small</option>
              <option value={"Medium"}>Medium</option>
              <option value={"Large"}>Large</option>
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
          onMouseLeave={handleMouseLeave}
        >
          {gridState.map((cell, index) => {
            const isPreview = previewCells.includes(index);
            const previewDrawing = isDrawing.current && isPreview;
            const previewErasing = isErasing.current && isPreview;

            return (
              <div
                // These are not inserted or deleted so this is ok
                // eslint-disable-next-line react-x/no-array-index-key
                key={index}
                className={`${
                  index === origin
                    ? "bg-slate-800"
                    : previewDrawing
                    ? "bg-blue-300"
                    : previewErasing
                    ? "bg-red-300"
                    : cell === 1
                    ? "bg-blue-100"
                    : "bg-slate-600"
                } ${
                  cellSize === "Small"
                    ? "h-2.5 w-2.5"
                    : cellSize === "Medium"
                    ? "h-5 w-5"
                    : "h-8 w-8"
                } hover:bg-blue-300 cursor-pointer`}
                onMouseDown={(e) => {
                  handleMouseDown(e, index);
                }}
                onMouseMove={() => {
                  handleMouseMove(index);
                }}
                onMouseUp={handleMouseUp}
              />
            );
          })}
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
