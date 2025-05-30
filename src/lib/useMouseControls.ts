import { SetStateAction, useRef } from "react";

export default function useMouseControls({
  setOrigin,
  gridState,
  setGridState,
  setStatus,
  previewCells,
  setPreviewCells,
  setHoveredCell,
}: {
  setOrigin: React.Dispatch<SetStateAction<Point>>;
  gridState: number[][];
  setGridState: React.Dispatch<SetStateAction<number[][]>>;
  setStatus: React.Dispatch<SetStateAction<string>>;
  previewCells: Point[];
  setPreviewCells: React.Dispatch<SetStateAction<Point[]>>;
  setHoveredCell: React.Dispatch<SetStateAction<Point | null>>;
}) {
  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const startCell = useRef<null | Point>(null);
  const endCell = useRef<null | Point>(null);

  const getCellsInRectangle = (
    startPos: Point | null,
    endPos: Point | null
  ) => {
    if (!startPos || !endPos) {
      return [];
    }

    const minRow = Math.min(startPos.y, endPos.y);
    const maxRow = Math.max(startPos.y, endPos.y);
    const minCol = Math.min(startPos.x, endPos.x);
    const maxCol = Math.max(startPos.x, endPos.x);

    const cells: Point[] = [];

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push({ x: col, y: row });
      }
    }

    return cells;
  };

  const handleMouseDown = (e: React.MouseEvent, pos: Point) => {
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

  const handleMouseMove = (pos: Point) => {
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

  const handleMouseEnter = (pos: Point) => {
    setHoveredCell(pos);
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const handleMouseLeaveGrid = () => {
    isDrawing.current = false;
    isErasing.current = false;
    setPreviewCells([]);
  };

  return {
    isDrawing,
    isErasing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseLeaveGrid,
  };
}
