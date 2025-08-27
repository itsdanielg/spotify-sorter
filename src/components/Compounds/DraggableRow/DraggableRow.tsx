import { Draggable } from "@hello-pangea/dnd";
import { ReactNode, useEffect, useState } from "react";
import { Handle } from "../../Atoms";

export interface DraggableRowProps {
  draggableId: string;
  index: number;
  children: ReactNode;
}

export function DraggableRow({ draggableId, index, children }: DraggableRowProps) {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const handleWindowSizeChange = () => {
    setWindowWidth(window.innerWidth);
  };

  const isMobile = windowWidth <= 768;

  return (
    <Draggable
      draggableId={draggableId}
      index={index}>
      {(provided) => {
        if (isMobile)
          return (
            <div
              {...provided.draggableProps}
              ref={provided.innerRef}
              className="flex items-center gap-2 w-full">
              {children}
              <div
                className="flex items-center"
                {...provided.dragHandleProps}>
                <Handle />
              </div>
            </div>
          );
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="w-full">
            {children}
          </div>
        );
      }}
    </Draggable>
  );
}
