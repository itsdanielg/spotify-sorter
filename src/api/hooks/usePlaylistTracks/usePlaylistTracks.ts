import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reorderPlaylist } from "@/api/operations";
import { PlaylistTrack, HookReturn, SpotifyError, PlaylistUpdateError } from "@/types";
import { markRearrangedTracks, getSortedPlaylist } from "@/util";
import { getPlaylistTracks } from "./getPlaylistTracks";

type usePlaylistTracksReturn = Omit<HookReturn<PlaylistTrack[]>, "data" | "callbacks"> & {
  data: {
    playlistTracks: PlaylistTrack[];
    tracksSwitched: number;
  };
  callbacks: {
    moveTrack: (sourceIndex: number, destinationIndex: number) => void;
    sortPlaylist: (field: string) => void;
    cancelChanges: () => void;
    saveChanges: () => void;
  };
  saving: {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
};

export function usePlaylistTracks(playlistId: string): usePlaylistTracksReturn {
  const queryClient = useQueryClient();

  const {
    data: playlistTracks = [],
    error,
    isLoading
  } = useQuery<PlaylistTrack[], SpotifyError>({
    queryKey: ["currentPlaylistTracks"],
    queryFn: async () => getPlaylistTracks(playlistId)
  });

  const saveMutation = useMutation({
    mutationFn: async () => reorderPlaylist(playlistId, playlistTracks, workingPlaylistTracks),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["currentPlaylistTracks"] });
      setTracksSwitched(res.data!);
    },
    onError: (error: PlaylistUpdateError) => {
      setTracksSwitched(error.tracksSwitched);
    }
  });

  const [workingPlaylistTracks, setWorkingPlaylistTracks] = useState<PlaylistTrack[]>([]);
  const [tracksSwitched, setTracksSwitched] = useState<number>(0);

  useEffect(() => {
    if (playlistTracks.length > 0) setWorkingPlaylistTracks([...playlistTracks]);
  }, [playlistTracks]);

  const moveTrack = (sourceIndex: number, destinationIndex: number) => {
    const newPlaylist = [...workingPlaylistTracks];
    const [track] = newPlaylist.splice(sourceIndex, 1);
    newPlaylist.splice(destinationIndex, 0, track);

    const markedPlaylist = markRearrangedTracks(newPlaylist);
    setWorkingPlaylistTracks(markedPlaylist);
  };

  const sortPlaylist = (field: string) => {
    const sortedPlaylist = getSortedPlaylist(playlistTracks, field);
    const markedPlaylist = markRearrangedTracks(sortedPlaylist);
    setWorkingPlaylistTracks(markedPlaylist);
  };

  const cancelChanges = () => {
    setWorkingPlaylistTracks([...playlistTracks]);
  };

  const saveChanges = async () => saveMutation.mutate();

  return {
    data: { playlistTracks: workingPlaylistTracks, tracksSwitched },
    callbacks: { moveTrack, sortPlaylist, cancelChanges, saveChanges },
    error: error ?? null,
    isLoading: isLoading,
    saving: { isPending: saveMutation.isPending, isSuccess: saveMutation.isSuccess, isError: saveMutation.isError }
  };
}
