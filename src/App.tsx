import { useEffect, useRef, useState } from "react";
import useMouseControls from "./lib/useMouseControls";
import useKeyControls from "./lib/useKeyControls";
import VertexOverlay from "./components/SvgVertexOverlay";

type SizeValue = "Small" | "Medium" | "Large";

function App() {
  const defaultXSize = 30;
  const defaultYSize = 30;
  const defaultOrigin = { x: defaultXSize / 2, y: defaultYSize / 2 };
  const defaultGridState: number[][] = Array.from({ length: defaultXSize }).map(
    () => Array.from({ length: defaultYSize }).fill(0) as number[]
  );

  // const defaultGridState = Array.from({ length: defaultCellCount }, () => 0);
  const [gridSize, setGridSize] = useState<Point>({
    x: defaultXSize,
    y: defaultYSize,
  });
  const [origin, setOrigin] = useState<Point>(defaultOrigin); // Middle cell will be cellCount / 2
  const [cellSize, setCellSize] = useState<SizeValue>("Large");
  const [vertices, setVertices] = useState<Point[]>([]);
  const [status, setStatus] = useState<string>("No shape drawn.");
  const [gridState, setGridState] = useState<number[][]>(defaultGridState);
  const [previewCells, setPreviewCells] = useState<Point[]>([]);
  const [hoveredCell, setHoveredCell] = useState<Point | null>(null);
  const [toastHidden, setToastHidden] = useState(true);
  const [toolTipHidden, setToolTipHidden] = useState(true);
  const toolTipInterval = useRef<number | null>(null);

  // Update origin and gridState if gridSize changes
  useEffect(() => {
    setOrigin({ x: gridSize.x / 2, y: gridSize.y / 2 });
    setGridState(() => {
      const newState = Array.from({ length: gridSize.x }).map(
        () => Array.from({ length: gridSize.y }).fill(0) as number[]
      );

      setVertices([]);

      return newState;
    });
  }, [gridSize]);

  // Disable context menu on mouse events
  const disableContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
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

  // Mouse controls
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseLeaveGrid,
    isDrawing,
    isErasing,
  } = useMouseControls({
    gridState,
    previewCells,
    setGridState,
    setOrigin,
    setPreviewCells,
    setStatus,
    setHoveredCell,
  });

  // Keyboard controls
  useKeyControls({ hoveredCell, setVertices });

  // Copy vertices to clipboard
  const handleVerticesClick = () => {
    setToastHidden(false);
    setTimeout(() => {
      setToastHidden(true);
    }, 1500);
    const formattedVertices = `[${vertices
      .map(
        (vertex) =>
          `[${(vertex.x - origin.x).toString()}, ${(
            vertex.y - origin.y
          ).toString()}]`
      )
      .join(", ")}]`;
    navigator.clipboard.writeText(formattedVertices).catch((err: unknown) => {
      console.error(err);
    });
  };

  const handleVerticesMouseOver = () => {
    setToolTipHidden(false);
    if (toolTipInterval.current) {
      clearInterval(toolTipInterval.current);
    }
  };

  const handleVerticesMouseLeave = () => {
    toolTipInterval.current = setTimeout(() => {
      setToolTipHidden(true);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-3xl font-semibold pt-5 select-none">
          2D Shape Grid Editor
        </h1>

        <div className=" flex gap-4 items-center select-none">
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
              defaultValue={"Medium"}
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

          <label htmlFor="cell-size-select">
            Cell Size:{" "}
            <select
              className="bg-gray-900 px-1 py-2 rounded-sm"
              defaultValue={cellSize}
              onChange={(e) => {
                setCellSize(e.target.value as SizeValue);
              }}
              id="cell-size-select"
            >
              <option value={"Small"}>Small</option>
              <option value={"Medium"}>Medium</option>
              <option value={"Large"}>Large</option>
            </select>
          </label>
        </div>

        <p className="font-bold select-none">
          Controls:{" "}
          <span className="whitespace-nowrap">Draw - Left Mouse |</span>{" "}
          <span className="whitespace-nowrap">Erase - Right Mouse |</span>{" "}
          <span className="whitespace-nowrap">Set Origin - Middle Mouse |</span>
          <span className="whitespace-nowrap">Set Vertex - Q,E,A,D</span>
        </p>

        <div
          className="relative grid grid-flow-col bg-gray-900 shadow-md p-[1px] select-none "
          style={{
            gridTemplateRows: `repeat(${gridSize.x.toString()}, 1fr)`,
          }}
          onContextMenu={disableContextMenu}
          onMouseLeave={handleMouseLeaveGrid}
        >
          <VertexOverlay
            cellSize={
              cellSize === "Small" ? 10 : cellSize === "Medium" ? 20 : 32
            }
            gridHeight={gridSize.y}
            gridWidth={gridSize.x}
            vertices={vertices}
          />
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
                    } hover:bg-blue-300 cursor-pointer border border-slate-900 box-border`}
                    onMouseDown={(e) => {
                      handleMouseDown(e, { x: colNumber, y: rowNumber });
                    }}
                    onMouseMove={() => {
                      handleMouseMove({ x: colNumber, y: rowNumber });
                    }}
                    onMouseUp={handleMouseUp}
                    onMouseEnter={() => {
                      handleMouseEnter({ x: colNumber, y: rowNumber });
                    }}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <p className="select-none">{status}</p>
          <h3 className="select-none">Shape Vertices:</h3>
          <div className="relative">
            <div
              className={`${
                toolTipHidden ? "opacity-0" : "opacity-100"
              } absolute -top-12 -left-12 whitespace-nowrap bg-gray-900 p-2 rounded-lg transition-opacity ease-in`}
            >
              <p>Click to Copy</p>
            </div>
            <button
              type="button"
              className="max-w-[min(75%,_800px)] hover:text-green-500"
              onClick={handleVerticesClick}
              onMouseEnter={handleVerticesMouseOver}
              onMouseLeave={handleVerticesMouseLeave}
            >
              [
              {vertices
                .map(
                  (vertice) =>
                    `[${(vertice.x - origin.x).toString()}, ${(
                      vertice.y - origin.y
                    ).toString()}] `
                )
                .join(", ")}
              ]
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          toastHidden ? "opacity-0" : "opacity-100"
        } absolute bottom-0 right-0 p-5 bg-gray-900 rounded-2xl m-4 transition-opacity ease-in`}
      >
        <p>Copied text to clipboard.</p>
      </div>
    </div>
  );
}

export default App;
