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
      if (
        e.code === "Digit1" ||
        e.code === "Digit2" ||
        e.code === "Digit3" ||
        e.code === "Digit4"
      ) {
        const offset = { x: 0, y: 0 };
        switch (e.code) {
          case "Digit1":
            break;
          case "Digit2":
            offset.x = 1;
            break;
          case "Digit3":
            offset.x = 1;
            offset.y = 1;
            break;
          case "Digit4":
            offset.y = 1;
            break;
        }

        setVertices((prev) => {
          const existingIndex = prev.findIndex(
            (point) =>
              point.x === hoveredCell.x + offset.x &&
              point.y === hoveredCell.y + offset.y
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
            return [
              ...prev,
              { x: hoveredCell.x + offset.x, y: hoveredCell.y + offset.y },
            ].sort((a, b) => {
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
