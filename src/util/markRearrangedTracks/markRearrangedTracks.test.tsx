import { describe, it, expect, beforeEach } from "vitest";
import { markRearrangedTracks } from "./markRearrangedTracks";
import { PlaylistTrack } from "@/types";
import { mockUpdatePlaylistItem } from "../mockApi/mockUpdatePlaylistItem";

describe(markRearrangedTracks, () => {
  const mockPlaylistTracks: PlaylistTrack[] = Array.from(
    { length: 5 },
    (_, i) =>
      ({
        index: i,
        rearranged: false
      }) as PlaylistTrack
  );

  describe("rearranges tracks to 1, 2, 5, 3, 4", () => {
    const rearrangedPlaylist = [...mockPlaylistTracks];
    mockUpdatePlaylistItem(rearrangedPlaylist, 4, 2);
    const finalPlaylist = markRearrangedTracks(rearrangedPlaylist);

    it("marks tracks 1, 2, 3, 4 as false", () => {
      expect(finalPlaylist[0].rearranged).toBeFalsy();
      expect(finalPlaylist[1].rearranged).toBeFalsy();
      expect(finalPlaylist[3].rearranged).toBeFalsy();
      expect(finalPlaylist[4].rearranged).toBeFalsy();
    });

    it("marks tracks 5 as true", () => {
      expect(finalPlaylist[2].rearranged).toBeTruthy();
    });
  });

  describe("rearranges tracks to 2, 3, 4, 5, 1", () => {
    const rearrangedPlaylist = [...mockPlaylistTracks];
    mockUpdatePlaylistItem(rearrangedPlaylist, 0, 4);
    const finalPlaylist = markRearrangedTracks(rearrangedPlaylist);

    it("marks tracks 2, 3, 4, 5 as true", () => {
      expect(finalPlaylist[0].rearranged).toBeTruthy();
      expect(finalPlaylist[1].rearranged).toBeTruthy();
      expect(finalPlaylist[2].rearranged).toBeTruthy();
      expect(finalPlaylist[3].rearranged).toBeTruthy();
    });

    it("marks track 1 as false", () => {
      expect(finalPlaylist[4].rearranged).toBeFalsy();
    });
  });

  describe("rearranges tracks to 5, 1, 2, 3, 4", () => {
    const rearrangedPlaylist = [...mockPlaylistTracks];
    mockUpdatePlaylistItem(rearrangedPlaylist, 4, 0);
    const finalPlaylist = markRearrangedTracks(rearrangedPlaylist);

    it("marks tracks 1, 2, 3, 4 as false", () => {
      expect(finalPlaylist[1].rearranged).toBeFalsy();
      expect(finalPlaylist[2].rearranged).toBeFalsy();
      expect(finalPlaylist[3].rearranged).toBeFalsy();
      expect(finalPlaylist[4].rearranged).toBeFalsy();
    });

    it("marks track 5 as true", () => {
      expect(finalPlaylist[0].rearranged).toBeTruthy();
    });
  });

  describe("rearranges tracks to 1, 3, 2, 5, 4", () => {
    const rearrangedPlaylist = [...mockPlaylistTracks];
    mockUpdatePlaylistItem(rearrangedPlaylist, 2, 1);
    mockUpdatePlaylistItem(rearrangedPlaylist, 4, 3);
    const finalPlaylist = markRearrangedTracks(rearrangedPlaylist);

    it("marks tracks 1, 2, 4 as false", () => {
      expect(finalPlaylist[0].rearranged).toBeFalsy();
      expect(finalPlaylist[2].rearranged).toBeFalsy();
      expect(finalPlaylist[4].rearranged).toBeFalsy();
    });

    it("marks tracks 3, 5 as true", () => {
      expect(finalPlaylist[1].rearranged).toBeTruthy();
      expect(finalPlaylist[3].rearranged).toBeTruthy();
    });
  });

  describe("rearranges tracks to 1, 4, 2, 3, 5", () => {
    const rearrangedPlaylist = [...mockPlaylistTracks];
    mockUpdatePlaylistItem(rearrangedPlaylist, 3, 1);
    const finalPlaylist = markRearrangedTracks(rearrangedPlaylist);

    it("marks tracks 1, 2, 3, 5 as false", () => {
      expect(finalPlaylist[0].rearranged).toBeFalsy();
      expect(finalPlaylist[2].rearranged).toBeFalsy();
      expect(finalPlaylist[3].rearranged).toBeFalsy();
      expect(finalPlaylist[4].rearranged).toBeFalsy();
    });

    it("marks track 4 as true", () => {
      expect(finalPlaylist[1].rearranged).toBeTruthy();
    });
  });
});
