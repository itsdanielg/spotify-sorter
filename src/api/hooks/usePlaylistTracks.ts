import { Dispatch, useState, useReducer, useEffect } from "react";
import { PlaylistTrack, HookReturn, SpotifyError, SpotifyPlaylistTrack, SpotifyArtist, Track } from "@/types";
import { markRearrangedTracks, getSortedPlaylist, unmarkPlaylistTracks, playlistTracksAreEqualByOrder } from "@/util";
import { updatePlaylistTracks, fetchPlaylistTracks } from "../calls";
import {
  usePlaylistTracksStateTypes,
  PlaylistAction,
  PlaylistTracksReducer,
  initialState,
  PlaylistActions
} from "../reducers";
import { useToken } from "./useToken";
import { getPlaylistDuplicates } from "@/util/getPlaylistDuplicates";

export type usePlaylistTracksReturn = {
  playlistTracks: PlaylistTrack[];
  playlistState: usePlaylistTracksStateTypes;
  dispatch: Dispatch<PlaylistAction>;
  moveTrack: (sourceIndex: number, destinationIndex: number) => void;
  sortPlaylist: (field: string) => void;
  cancelChanges: () => void;
  findDuplicates: () => any;
  saveChanges: () => Promise<void>;
};

export function usePlaylistTracks(playlistId: string): HookReturn<usePlaylistTracksReturn> {
  const { token } = useToken();

  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrack[]>([]);
  const [unmodifiedPlaylistTracks, setUnmodifiedPlaylistTracks] = useState<PlaylistTrack[]>([]);
  const [error, setError] = useState<SpotifyError | null>(null);

  const [playlistState, dispatch] = useReducer(PlaylistTracksReducer, initialState);

  const moveTrack = (sourceIndex: number, destinationIndex: number) => {
    const newPlaylist = [...playlistTracks];
    const [track] = newPlaylist.splice(sourceIndex, 1);
    newPlaylist.splice(destinationIndex, 0, track);
    markRearrangedTracks(newPlaylist);
    setPlaylistTracks(newPlaylist);
  };

  const sortPlaylist = (field: string) => {
    const sortedPlaylist = getSortedPlaylist(playlistTracks, field);
    markRearrangedTracks(sortedPlaylist);
    setPlaylistTracks(sortedPlaylist);
  };

  const cancelChanges = () => {
    const oldPlaylist = [...unmodifiedPlaylistTracks].map((song) => {
      song.rearranged = false;
      return song;
    });
    setPlaylistTracks(oldPlaylist);
  };

  const saveChanges = async () => {
    dispatch({ type: PlaylistActions.SAVE });
    const { data, errorResponse } = await updatePlaylistTracks(
      token,
      playlistId,
      unmodifiedPlaylistTracks,
      playlistTracks
    );
    if (errorResponse) {
      setError(errorResponse.error as SpotifyError);
      dispatch({ type: PlaylistActions.SAVE_ERROR, payload: data! });
      return;
    }

    const newPlaylist = unmarkPlaylistTracks(playlistTracks);
    setPlaylistTracks(newPlaylist);
    setUnmodifiedPlaylistTracks(newPlaylist);
    dispatch({ type: PlaylistActions.SAVE_SUCCESS, payload: data! });
  };

  const findDuplicates = () => {
    getPlaylistDuplicates(playlistTracks).map((duplicateTrack) => {
      console.log(duplicateTrack.tracks[0].track.title);
      duplicateTrack.tracks.map((track) => console.log(track.track.album));
      console.log("");
    });
  };

  useEffect(() => {
    if (!playlistTracksAreEqualByOrder(playlistTracks, unmodifiedPlaylistTracks)) {
      dispatch({ type: PlaylistActions.MODIFY });
      return;
    }
    dispatch({ type: PlaylistActions.UNMODIFY });
  }, [playlistTracks]);

  useEffect(() => {
    const getPlaylist = async () => {
      dispatch({ type: PlaylistActions.INITIALIZE });
      const { data, errorResponse } = await fetchPlaylistTracks(token, playlistId);
      if (errorResponse) {
        setPlaylistTracks([]);
        setError(errorResponse.error as SpotifyError);
        dispatch({ type: PlaylistActions.INITIALIZE_SUCCESS });
        return;
      }

      const dataPlaylistTracks = data as SpotifyPlaylistTrack[];
      const playlistTracks: PlaylistTrack[] = dataPlaylistTracks.map(
        (playlistTrack: SpotifyPlaylistTrack, index: number) => {
          return {
            id: playlistTrack.track.id,
            index: index,
            addedAt: new Date(playlistTrack.added_at),
            addedBy: playlistTrack.added_by.id,
            isLocal: playlistTrack.is_local,
            rearranged: false,
            track: {
              title: playlistTrack.track.name,
              artists: playlistTrack.track.artists.map((artist: SpotifyArtist) => artist.name),
              album: playlistTrack.track.album.name,
              albumCoverURL: playlistTrack.track.album.images[0]?.url ?? "",
              trackNumber: playlistTrack.track.track_number,
              releaseDate: new Date(playlistTrack.track.album.release_date),
              explicit: playlistTrack.track.explicit,
              durationInMs: playlistTrack.track.duration_ms,
              preview_url: playlistTrack.track.preview_url
            } as Track
          } as PlaylistTrack;
        }
      );

      setPlaylistTracks(playlistTracks);
      setUnmodifiedPlaylistTracks(playlistTracks);
      dispatch({ type: PlaylistActions.INITIALIZE_SUCCESS });
    };
    getPlaylist();
  }, []);

  findDuplicates();

  return {
    data: {
      playlistTracks,
      playlistState,
      dispatch,
      moveTrack,
      sortPlaylist,
      cancelChanges,
      saveChanges,
      findDuplicates
    },
    error
  };
}
