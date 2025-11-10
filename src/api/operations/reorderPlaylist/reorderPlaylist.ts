import { PlaylistTrack, APIReturn, PlaylistUpdateError } from "@/types";
import { updatePlaylistTrack } from "../../calls/";

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
  // Build a map for O(1) lookups instead of O(n) findIndex
  const trackIdToIndex = new Map<string, number>();
  currentOrder.forEach((track, index) => {
    trackIdToIndex.set(track.id, index);
  });

  let tracksMoved = 0;

  for (let targetIndex = 0; targetIndex < desiredOrder.length; targetIndex++) {
    const desiredTrackId = desiredOrder[targetIndex].id;
    const currentIndex = trackIdToIndex.get(desiredTrackId);

    // Track not found - invalid reorder
    if (currentIndex === undefined) {
      return {
        data: null,
        errorResponse: { message: `Track ${desiredTrackId} not found in current order` } as any
      };
    }

    // Skip if already in the correct position
    if (currentIndex === targetIndex) continue;

    // Make the API call to move the track
    const { errorResponse } = await updatePlaylistTrack(playlistId, currentIndex, targetIndex);

    if (errorResponse) {
      console.error("Error moving track:", errorResponse);
      throw {
        message: "Error reordering playlist",
        tracksSwitched: tracksMoved
      } as PlaylistUpdateError;
    }

    // Update the map to reflect the new positions after the move
    // When moving from currentIndex to targetIndex:
    // - All tracks between targetIndex and currentIndex shift by 1
    if (currentIndex > targetIndex) {
      // Moving backwards: tracks between targetIndex and currentIndex shift right
      for (const [trackId, index] of trackIdToIndex.entries()) {
        if (index >= targetIndex && index < currentIndex) {
          trackIdToIndex.set(trackId, index + 1);
        }
      }
    } else {
      // Moving forwards: tracks between currentIndex and targetIndex shift left
      for (const [trackId, index] of trackIdToIndex.entries()) {
        if (index > currentIndex && index <= targetIndex) {
          trackIdToIndex.set(trackId, index - 1);
        }
      }
    }

    // Update the moved track's position
    trackIdToIndex.set(desiredTrackId, targetIndex);

    tracksMoved++;
  }

  return { data: tracksMoved, errorResponse: null };
}
