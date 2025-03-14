import { SetStateAction, useCallback, useEffect } from "react";

export default function useKeyControls({
  setVertices,
  hoveredCell,
}: {
  setVertices: React.Dispatch<SetStateAction<Point[]>>;
  hoveredCell: Point | null;
}) {
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!hoveredCell) return;
      if (e.code === "KeyV") {
        setVertices((prev) => {
          const existingIndex = prev.findIndex(
            (point) => point.x === hoveredCell.x && point.y === hoveredCell.y
          );

          if (existingIndex >= 0) {
            return prev
              .filter((_, index) => index !== existingIndex)
              .sort((a, b) => {
                if (a.x > b.x) {
                  return 1;
                } else if (a.x < b.x) {
                  return -1;
                } else if (a.y > b.y) {
                  return 1;
                } else if (a.y < b.y) {
                  return -1;
                }
                return 0;
              });
          } else {
            return [...prev, hoveredCell].sort((a, b) => {
              if (a.x > b.x) {
                return 1;
              } else if (a.x < b.x) {
                return -1;
              } else if (a.y > b.y) {
                return 1;
              } else if (a.y < b.y) {
                return -1;
              }
              return 0;
            });
          }
        });
      }
    },
    [hoveredCell, setVertices]
  );

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      handleKeyUp(e);
    };
    window.addEventListener("keyup", eventHandler);

    return () => {
      window.removeEventListener("keyup", eventHandler);
    };
  }, [handleKeyUp]);
}
