import { describe, it, expect } from "vitest";
import { mockPlaylistTracks } from "@/util/mockPlaylistTracks";
import { sortByAddedAt } from "../sortComparators";

describe(sortByAddedAt, () => {
  const playlistTracks = [
    ...mockPlaylistTracks.map((playlistTrack) => {
      return { ...playlistTrack, track: { ...playlistTrack.track } };
    })
  ];
  playlistTracks[0].addedAt = new Date(1696436210);
  playlistTracks[1].addedAt = new Date(1696436210);
  playlistTracks[2].addedAt = new Date(1696436211);

  describe("when dates added are the same", () => {
    it("returns 0", () => {
      const returnVal = sortByAddedAt(playlistTracks[0], playlistTracks[1]);
      expect(returnVal).toBe(0);
    });
  });

  describe("when dates added are different", () => {
    it("returns -1 if a < b", () => {
      const returnVal = sortByAddedAt(playlistTracks[1], playlistTracks[2]);
      expect(returnVal).toBe(-1);
    });

    it("returns 1 if a > b", () => {
      const returnVal = sortByAddedAt(playlistTracks[2], playlistTracks[1]);
      expect(returnVal).toBe(1);
    });
  });
});
