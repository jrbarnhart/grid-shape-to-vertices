import React from "react";

type VertexOverlayProps = {
  vertices: Point[];
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
};

const VertexOverlay: React.FC<VertexOverlayProps> = ({
  vertices,
  gridWidth,
  gridHeight,
  cellSize,
}) => {
  const svgWidth = gridWidth * cellSize;
  const svgHeight = gridHeight * cellSize;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none z-10"
      width={svgWidth}
      height={svgHeight}
      style={{
        width: `${svgWidth.toString()}px`,
        height: `${svgHeight.toString()}px`,
      }}
    >
      {vertices.map((v) => (
        <circle
          key={`${v.x.toString()}, ${v.y.toString()}`}
          cx={v.x * cellSize}
          cy={v.y * cellSize}
          r={cellSize * 0.1} // scale dot size with cell size
          fill="red"
          stroke="black"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

export default VertexOverlay;
