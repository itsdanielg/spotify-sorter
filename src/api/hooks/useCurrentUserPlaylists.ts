import { useEffect, useState } from "react";
import { HookReturn, Playlist, SpotifyError, SpotifySimplifiedPlaylist } from "@/types";
import { fetchCurrentUserPlaylists } from "../calls";
import { useToken } from "./useToken";

export type useCurrentUserPlaylistsReturn = {
  playlists: Playlist[];
};

export function useCurrentUserPlaylists(): HookReturn<useCurrentUserPlaylistsReturn> {
  const { token } = useToken();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<SpotifyError | null>(null);

  useEffect(() => {
    const getPlaylists = async () => {
      const { data, errorResponse } = await fetchCurrentUserPlaylists(token);
      if (errorResponse) {
        setPlaylists([]);
        setError(errorResponse.error as SpotifyError);
        return;
      }

      const dataPlaylists = data as SpotifySimplifiedPlaylist[];
      const newPlaylists: Playlist[] = dataPlaylists.map((playlist: SpotifySimplifiedPlaylist) => {
        return {
          id: playlist.id,
          name: playlist.name,
          imageURL: playlist.images === null ? "" : playlist.images[0]?.url,
          owner: playlist.owner.display_name ?? "",
          description: playlist.description ?? "",
          collaborative: playlist.collaborative,
          isPublic: playlist.public
        } as Playlist;
      });

      setPlaylists(newPlaylists);
    };

    getPlaylists();
  }, []);

  return { data: { playlists }, error };
}
