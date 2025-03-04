import { Dispatch, SetStateAction } from "react";
import { DropResult, DragDropContext, Droppable } from "@hello-pangea/dnd";
import { PlaylistViewHeader } from "./PlaylistViewHeader/PlaylistViewHeader";
import { DraggablePlaylistTrack } from "./PlaylistViewTracks/DraggablePlaylistTrack";
import { PlaylistTrack } from "@/types";

interface PlaylistViewProps {
  workingPlaylistTracks: PlaylistTrack[];
  moveTrack: (sourceIndex: number, destinationIndex: number) => void;
  sortPlaylist: (field: string) => void;
  isCompact: boolean;
}
export function PlaylistView({ workingPlaylistTracks, moveTrack, sortPlaylist, isCompact }: PlaylistViewProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full md:w-5/6">
      <PlaylistViewHeader sortPlaylist={sortPlaylist} />
      <PlaylistView.Body
        workingPlaylistTracks={workingPlaylistTracks}
        moveTrack={moveTrack}
        isCompact={isCompact}
      />
    </div>
  );
}

PlaylistView.Body = ({ isCompact, workingPlaylistTracks, moveTrack }: Omit<PlaylistViewProps, "sortPlaylist">) => {
  const handleOnDragEnd = (draggedCard: DropResult) => {
    if (!draggedCard.destination) return;
    if (draggedCard.source.index === draggedCard.destination.index) return;
    moveTrack(draggedCard.source.index, draggedCard.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="playlistSongs">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col items-center w-full">
            {workingPlaylistTracks.map(({ id, rearranged, ...props }) => (
              <DraggablePlaylistTrack
                isCompact={isCompact}
                key={id}
                id={id}
                rearranged={!!rearranged}
                {...props}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
