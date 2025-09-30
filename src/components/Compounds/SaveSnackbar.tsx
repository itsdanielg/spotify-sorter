import { useContext } from "react";
import { PlaylistTracksContext } from "@/context";
import { PlaylistActions } from "@/api/reducers";
import { Snackbar } from "@/components/Atoms";

export function SaveSnackbar() {
  const {
    playlistHook: { playlistState, dispatch }
  } = useContext(PlaylistTracksContext);

  const showResult = () => {
    setTimeout(() => {
      dispatch({ type: PlaylistActions.SAVE_RESET });
    }, 5000);
  };

  const visibility = playlistState.saving === "complete" ? "visible animate-snackbar" : "invisible";
  const errorStyle = playlistState.hasSavingError ? "bg-red-400" : "bg-green";
  const label = playlistState.hasSavingError ? "Saving incomplete. Please try again." : "Saving complete!";

  if (playlistState.saving === "complete") showResult();
  return (
    <Snackbar className={`${visibility} ${errorStyle} flex flex-col p-4 px-6 pointer-events-none`}>
      <span>{label}</span>
      <span>
        <strong>{playlistState.playlistTracksUpdated}</strong>
        {playlistState.playlistTracksUpdated === 1
          ? " total track has been updated!"
          : " total tracks have been updated!"}
      </span>
    </Snackbar>
  );
}
