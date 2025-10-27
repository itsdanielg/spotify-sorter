import { PlaylistTrack, APIReturn } from "@/types";
import { mockUpdatePlaylistItem } from "@/util/mockApi/mockUpdatePlaylistItem";
import { updatePlaylistTrack } from "./updatePlaylistTrack";

export async function updatePlaylistTracks(
  playlistId: string,
  unorderedPlaylist: PlaylistTrack[],
  playlist: PlaylistTrack[]
): APIReturn<number> {
  let tracksSwitched = 0;
  for (let i = 0; i < playlist.length; i++) {
    const track = playlist[i];
    const startIndex = unorderedPlaylist.indexOf(
      unorderedPlaylist.find((uneditedTrack) => uneditedTrack.id === track.id)!
    );

    const { data, errorResponse } = await updatePlaylistTrack(playlistId, startIndex, i);
    if (errorResponse) {
      return { data: tracksSwitched, errorResponse: errorResponse };
    }

    mockUpdatePlaylistItem(unorderedPlaylist, startIndex, i);
    if (data) tracksSwitched++;
  }

  return { data: tracksSwitched, errorResponse: null };
}
