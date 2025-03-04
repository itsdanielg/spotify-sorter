import { fetchPlaylistTracks } from "@/api/calls";
import { SpotifyError, SpotifyPlaylistTrack, PlaylistTrack, SpotifyArtist, Track } from "@/types";

export async function getPlaylistTracks(playlistId: string): Promise<PlaylistTrack[]> {
  const { data, errorResponse } = await fetchPlaylistTracks(playlistId);
  if (errorResponse) throw errorResponse.error as SpotifyError;

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
          durationInMs: playlistTrack.track.duration_ms
        } as Track
      } as PlaylistTrack;
    }
  );

  return playlistTracks;
}
