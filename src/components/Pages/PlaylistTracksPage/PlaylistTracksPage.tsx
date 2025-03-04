import { useState } from "react";
import { useLocation } from "react-router-dom";
import { usePlaylistTracks } from "@/api";
import { LoaderModal } from "@/components/Compounds";
import { Page } from "@/components/Templates";
import { PlaylistBar } from "./PlaylistBar";
import { PlaylistView } from "./PlaylistView";
import { SaveSnackbar } from "./SaveSnackbar";

export function PlaylistTracksPage() {
  const [isCompact, setIsCompact] = useState(true);

  const playlistId = useLocation().pathname.substring(1);
  const { data, callbacks, error, isLoading, saving } = usePlaylistTracks(playlistId);

  return (
    <Page
      isLoading={isLoading}
      error={error}>
      <div className="flex flex-col items-center gap-4 mt-4">
        <PlaylistBar
          isCompact={isCompact}
          isRearranged={data.playlistTracks.some((track) => track.rearranged)}
          playlistTracks={data.playlistTracks}
          setIsCompact={setIsCompact}
          cancelChanges={callbacks.cancelChanges}
          saveChanges={callbacks.saveChanges}
        />
        <PlaylistView
          isCompact={isCompact}
          workingPlaylistTracks={data.playlistTracks}
          moveTrack={callbacks.moveTrack}
          sortPlaylist={callbacks.sortPlaylist}
        />
      </div>
      <LoaderModal isLoading={isLoading} />
      <SaveSnackbar
        tracksSwitched={data.tracksSwitched}
        saving={saving}
      />
    </Page>
  );
}
