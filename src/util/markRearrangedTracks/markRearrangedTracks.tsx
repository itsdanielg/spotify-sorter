import { PlaylistTrack } from "@/types";

export function markRearrangedTracks(playlistTracks: PlaylistTrack[]) {
  const indexSet = new Set<number>();
  let realIndex = 0;

  return playlistTracks.map((playlistTrack) => {
    while (indexSet.has(realIndex)) {
      indexSet.delete(realIndex);
      realIndex++;
    }

    let rearranged = false;
    if (playlistTrack.index !== realIndex) {
      indexSet.add(playlistTrack.index);
      rearranged = true;
    } else {
      realIndex++;
    }

    return { ...playlistTrack, rearranged };
  });
}
