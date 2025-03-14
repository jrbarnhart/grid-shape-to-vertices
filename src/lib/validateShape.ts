import { SetStateAction } from "react";

// Find and validate the shape on the grid
export default function validateShape({
  gridSize,
  gridState,
  setStatus,
}: {
  gridSize: {
    x: number;
    y: number;
  };
  gridState: number[][];
  setStatus: React.Dispatch<SetStateAction<string>>;
}) {
  // Create a copy of the grid to mark visited cells
  const visited = Array.from(
    { length: gridSize.x },
    () => Array.from({ length: gridSize.y }).fill(false) as boolean[]
  );

  let firstShape = null;
  let foundMultipleShapes = false;

  // Find the first filled cell to start our search
  let startFound = false;
  let startX = 0,
    startY = 0;

  // Find the first filled cell
  for (let x = 0; x < gridSize.x && !startFound; x++) {
    for (let y = 0; y < gridSize.y && !startFound; y++) {
      if (gridState[x][y] === 1) {
        startX = x;
        startY = y;
        startFound = true;
      }
    }
  }

  // If no filled cells, return early
  if (!startFound) {
    setStatus("No shape drawn.");
    return false;
  }

  // Find the first shape
  firstShape = findConnectedCells(startX, startY, visited, gridSize, gridState);

  // Check if there are any more filled cells that weren't visited
  for (let x = 0; x < gridSize.x; x++) {
    for (let y = 0; y < gridSize.y; y++) {
      if (gridState[x][y] === 1 && !visited[x][y]) {
        foundMultipleShapes = true;
        break;
      }
    }
    if (foundMultipleShapes) break;
  }

  if (foundMultipleShapes) {
    setStatus("Invalid shape. All cells must be connected.");
    return false;
  } else {
    setStatus(`Valid shape with ${firstShape.length.toString()} cells.`);

    // Could call extract and set vertices here, or elsewhere for single responsibilty

    return true;
  }
}

// Find all connected cells starting from a given cell
const findConnectedCells = (
  startX: number,
  startY: number,
  visited: boolean[][],
  gridSize: { x: number; y: number },
  gridState: number[][]
) => {
  const shape = [];
  const queue = [{ x: startX, y: startY }];

  // Define the four directions: up, right, down, left
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 1, dy: 0 }, // right
    { dx: 0, dy: 1 }, // down
    { dx: -1, dy: 0 }, // left
  ];

  while (queue.length > 0) {
    const entry = queue.shift();
    const { x, y } = entry || { x: null, y: null };
    // Skip if already visited or out of bounds or not filled
    if (!x || !y) {
      continue;
    }
    if (
      x < 0 ||
      x >= gridSize.x ||
      y < 0 ||
      y >= gridSize.y ||
      visited[x][y] ||
      gridState[x][y] !== 1
    ) {
      continue;
    }

    // Mark as visited and add to shape
    visited[x][y] = true;
    shape.push({ x, y });

    // Check all four adjacent cells
    for (const { dx, dy } of directions) {
      queue.push({ x: x + dx, y: y + dy });
    }
  }

  return shape;
};
