import { useEffect, useRef, useState } from "react";

type SizeValue = "Small" | "Medium" | "Large";

function App() {
  const defaultXSize = 40;
  const defaultYSize = 40;
  const defaultOrigin = { x: defaultXSize / 2, y: defaultYSize / 2 };
  const defaultGridState: number[][] = Array.from({ length: defaultXSize }).map(
    () => Array.from({ length: defaultYSize }).fill(0) as number[]
  );

  // const defaultGridState = Array.from({ length: defaultCellCount }, () => 0);
  const [gridSize, setGridSize] = useState<{ x: number; y: number }>({
    x: defaultXSize,
    y: defaultYSize,
  });
  const [origin, setOrigin] = useState<{ x: number; y: number }>(defaultOrigin); // Middle cell will be cellCount / 2
  const [cellSize, setCellSize] = useState<SizeValue>("Medium");
  const [vertices, setVertices] = useState<[number, number][]>([]);
  const [status, setStatus] = useState<string>("No shape drawn.");
  const [gridState, setGridState] = useState<number[][]>(defaultGridState);
  const [previewCells, setPreviewCells] = useState<{ x: number; y: number }[]>(
    []
  );

  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const startCell = useRef<null | { x: number; y: number }>(null);
  const endCell = useRef<null | { x: number; y: number }>(null);

  // Update origin and gridState if gridSize changes
  useEffect(() => {
    setOrigin({ x: gridSize.x / 2, y: gridSize.y / 2 });
    setGridState(() => {
      const newState = Array.from({ length: gridSize.x }).map(
        () => Array.from({ length: gridSize.y }).fill(0) as number[]
      );

      return newState;
    });
  }, [gridSize]);

  // Disable context menu on mouse events
  const disableContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Find valid shape

  // Extract vertices from valid shape

  // Get cells in rectangle from startCell to endCell
  const getCellsInRectangle = (
    startPos: { x: number; y: number } | null,
    endPos: { x: number; y: number } | null
  ) => {
    if (!startPos || !endPos) {
      return [];
    }

    const minRow = Math.min(startPos.y, endPos.y);
    const maxRow = Math.max(startPos.y, endPos.y);
    const minCol = Math.min(startPos.x, endPos.x);
    const maxCol = Math.max(startPos.x, endPos.x);

    const cells: { x: number; y: number }[] = [];

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push({ x: col, y: row });
      }
    }

    return cells;
  };

  // Clear grid handler
  const handleClearGrid = () => {
    setGridState(() => {
      const newState = Array.from({ length: gridSize.x }).map(
        () => Array.from({ length: gridSize.y }).fill(0) as number[]
      );

      return newState;
    });
    setVertices([]);
    setStatus("Grid cleared.");
    setOrigin({ x: gridSize.x / 2, y: gridSize.y / 2 });
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    pos: { x: number; y: number }
  ) => {
    if (e.button === 1) {
      setOrigin(pos);
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

    startCell.current = pos;
    endCell.current = pos;

    // For immediate feedback on click
    const newGrid = [...gridState];
    if (isDrawing.current) {
      newGrid[pos.x][pos.y] = 1;
    } else if (isErasing.current) {
      newGrid[pos.x][pos.y] = 0;
    }
    setGridState(newGrid);

    setStatus(isDrawing.current ? "Drawing..." : "Erasing...");
  };

  const handleMouseMove = (pos: { x: number; y: number }) => {
    if (!isDrawing.current && !isErasing.current) return;

    endCell.current = pos;

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

    cellsToModify.forEach((cellPos) => {
      newGrid[cellPos.x][cellPos.y] = isDrawing.current ? 1 : 0;
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
              defaultValue={"Large"}
              onChange={(e) => {
                setGridSize(() => {
                  const size = e.target.value;
                  switch (size) {
                    case "Small":
                      return { x: 20, y: 20 };
                    case "Medium":
                      return { x: 30, y: 30 };
                    case "Large":
                      return { x: 40, y: 40 };
                    default:
                      return { x: 40, y: 40 };
                  }
                });
              }}
              id="cell-count-select"
            >
              <option value={"Small"}>Small</option>
              <option value={"Medium"}>Medium</option>
              <option value={"Large"}>Large</option>
            </select>
          </label>

          <label htmlFor="cell-count-select">
            Cell Size:{" "}
            <select
              className="bg-gray-900 px-1 py-2 rounded-sm"
              defaultValue={cellSize}
              onChange={(e) => {
                setCellSize(e.target.value as SizeValue);
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
            gridTemplateColumns: `repeat(${gridSize.x.toString()}, 1fr)`,
          }}
          onContextMenu={disableContextMenu}
          onMouseLeave={handleMouseLeave}
        >
          {gridState.map((col, colNumber) => (
            <div
              key={`column-${colNumber.toString()}`}
              style={{ display: "contents" }}
            >
              {col.map((cell, rowNumber) => {
                const isPreview = previewCells.some(
                  (pos) => pos.x === colNumber && pos.y === rowNumber
                );
                const previewDrawing = isDrawing.current && isPreview;
                const previewErasing = isErasing.current && isPreview;

                return (
                  <div
                    key={`cell-${colNumber.toString()}-${rowNumber.toString()}`}
                    className={`${
                      colNumber === origin.x && rowNumber === origin.y
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
                      handleMouseDown(e, { x: colNumber, y: rowNumber });
                    }}
                    onMouseMove={() => {
                      handleMouseMove({ x: colNumber, y: rowNumber });
                    }}
                    onMouseUp={handleMouseUp}
                  />
                );
              })}
            </div>
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
