import { fetchCurrentUserPlaylists } from "@/api/calls";
import { SpotifyError, SpotifySimplifiedPlaylist, Playlist } from "@/types";

export async function getPlaylists(): Promise<Playlist[]> {
  const { data, errorResponse } = await fetchCurrentUserPlaylists();
  if (errorResponse) {
    throw errorResponse.error as SpotifyError;
  }

  const playlists: Playlist[] = (data as SpotifySimplifiedPlaylist[]).map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    imageURL: playlist.images?.[0]?.url || "",
    owner: playlist.owner.display_name || "",
    description: playlist.description || "",
    collaborative: playlist.collaborative,
    isPublic: playlist.public
  }));

  return playlists;
}
