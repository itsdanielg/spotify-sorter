import { PlaylistTrack } from "@/types";
import { DraggableRow } from "@/components/Compounds";
import { PlaylistViewTrack } from "./PlaylistViewTrack";

export function DraggablePlaylistTrack({ id, index, isCompact, ...props }: PlaylistTrack & { isCompact: boolean }) {
  return (
    <DraggableRow
      draggableId={id}
      index={index}>
      <PlaylistViewTrack
        index={index}
        isCompact={isCompact}
        {...props}
      />
    </DraggableRow>
  );
}
