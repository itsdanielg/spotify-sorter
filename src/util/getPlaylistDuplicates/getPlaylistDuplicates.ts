import { PlaylistTrack } from "@/types";

type DuplicateTrack = {
  previewURL: string;
  tracks: PlaylistTrack[];
};

export function getPlaylistDuplicates(playlist: PlaylistTrack[]): DuplicateTrack[] {
  const trackMap = new Map();
  const duplicates: DuplicateTrack[] = [];

  // Determine duplicates by preview_url of tracks
  playlist.forEach((playlistTrack) => {
    const previewURL = playlistTrack.track.preview_url;
    if (!trackMap.has(previewURL)) trackMap.set(previewURL, []);
    trackMap.get(previewURL).push(playlistTrack);
  });

  trackMap.forEach((tracks, previewURL) => {
    if (tracks.length > 1)
      duplicates.push({
        previewURL: previewURL,
        tracks: tracks
      });
  });

  return duplicates;
}
