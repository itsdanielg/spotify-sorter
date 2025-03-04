import { PlaylistTrack, APIReturn, PlaylistUpdateError } from "@/types";
import { updatePlaylistTrack } from "./updatePlaylistTrack";

/**
 * Reorders a playlist to match the desired order by making sequential API calls.
 * Maintains a local copy of the playlist state to calculate correct indices for each move.
 *
 * @param playlistId - The Spotify playlist ID
 * @param currentOrder - The current order of tracks (will not be mutated)
 * @param desiredOrder - The desired final order of tracks
 * @returns The number of tracks that were moved
 */
export async function reorderPlaylist(
  playlistId: string,
  currentOrder: PlaylistTrack[],
  desiredOrder: PlaylistTrack[]
): APIReturn<number> {
  // Work on a local copy to track state changes as we make API calls
  const workingOrder = [...currentOrder];
  let tracksMoved = 0;

  for (let targetIndex = 0; targetIndex < desiredOrder.length; targetIndex++) {
    const desiredTrack = desiredOrder[targetIndex];

    // Find where this track currently is in our working copy
    const currentIndex = workingOrder.findIndex((track) => track.id === desiredTrack.id);

    // Skip if already in the correct position
    if (currentIndex === targetIndex) continue;

    // Make the API call to move the track
    const { data, errorResponse } = await updatePlaylistTrack(playlistId, currentIndex, targetIndex);

    if (errorResponse) {
      console.error("Error moving track:", errorResponse);
      throw {
        message: "Error reordering playlist",
        tracksSwitched: tracksMoved
      } as PlaylistUpdateError;
    }

    // Update our local state to match what the server now has
    // Remove track from current position and insert at target position
    const [movedTrack] = workingOrder.splice(currentIndex, 1);
    workingOrder.splice(targetIndex, 0, movedTrack);

    tracksMoved++;
  }

  return { data: tracksMoved, errorResponse: null };
}
