export default function extractVertices(gridState: number[][]) {
  const rows = gridState.length;
  const cols = gridState[0].length;

  // First, get all boundary points (vertices)
  const boundaryPoints = new Set<string>();

  // Helper to check if a cell is part of the shape
  const isShapeCell = (r: number, c: number) => {
    return r >= 0 && r < rows && c >= 0 && c < cols && gridState[r][c] === 1;
  };

  // Extract all boundary points
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isShapeCell(r, c)) {
        // Check each corner of the cell to see if it's on the boundary

        // Top-left corner (r, c)
        if (
          !isShapeCell(r - 1, c) ||
          !isShapeCell(r, c - 1) ||
          !isShapeCell(r - 1, c - 1)
        ) {
          boundaryPoints.add(`${c.toString()},${r.toString()}`);
        }

        // Top-right corner (r, c+1)
        if (
          !isShapeCell(r - 1, c) ||
          !isShapeCell(r, c + 1) ||
          !isShapeCell(r - 1, c + 1)
        ) {
          boundaryPoints.add(`${(c + 1).toString()},${r.toString()}`);
        }

        // Bottom-right corner (r+1, c+1)
        if (
          !isShapeCell(r + 1, c) ||
          !isShapeCell(r, c + 1) ||
          !isShapeCell(r + 1, c + 1)
        ) {
          boundaryPoints.add(`${(c + 1).toString()},${(r + 1).toString()}`);
        }

        // Bottom-left corner (r+1, c)
        if (
          !isShapeCell(r + 1, c) ||
          !isShapeCell(r, c - 1) ||
          !isShapeCell(r + 1, c - 1)
        ) {
          boundaryPoints.add(`${c.toString()},${(r + 1).toString()}`);
        }
      }
    }
  }

  // Convert to array of points with proper types
  const points: { x: number; y: number }[] = Array.from(boundaryPoints).map(
    (coord) => {
      const [xStr, yStr] = coord.split(",");
      return { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
    }
  );

  // Now, filter out non-corner points
  const cornerPoints: { x: number; y: number }[] = [];

  for (const point of points) {
    const neighbors = points.filter(
      (p) => Math.abs(p.x - point.x) + Math.abs(p.y - point.y) === 1 // Manhattan distance of 1
    );

    if (neighbors.length !== 2) {
      // This is likely a corner (or an isolated point)
      cornerPoints.push(point);
      continue;
    }

    // Check if neighbors form a straight line (not a corner)
    const [n1, n2] = neighbors;
    const isHorizontalLine = n1.y === point.y && n2.y === point.y;
    const isVerticalLine = n1.x === point.x && n2.x === point.x;

    if (!isHorizontalLine && !isVerticalLine) {
      // The neighbors don't form a straight line, so this is a corner
      cornerPoints.push(point);
    }
  }

  return cornerPoints;
}
