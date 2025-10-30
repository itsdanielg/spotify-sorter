import { describe, it, expect, vi, beforeEach } from "vitest";
import { axiosInstance, fetchPlaylistTracks } from "@/api";
import { SpotifyResponseError, SpotifyPlaylistTrack, SpotifyPlaylistTracks } from "@/types";
import * as helpers from "../fetchNextRecursive";

describe(fetchPlaylistTracks, () => {
  const mockGet = vi.spyOn(axiosInstance, "get");
  const mockFetchNextRecursive = vi.spyOn(helpers, "fetchNextRecursive");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("when fetch is unsuccessful", () => {
    let result: Awaited<ReturnType<typeof fetchPlaylistTracks>>;

    beforeEach(async () => {
      mockGet.mockRejectedValue({
        response: {
          data: {
            error: {
              status: 401,
              message: "error caught"
            }
          } as unknown as SpotifyResponseError
        }
      });

      result = await fetchPlaylistTracks("test-playlist-id");
    });

    it("data is null", () => {
      expect(result.data).toBeNull();
    });

    it("errorResponse is non-null", () => {
      expect(result.errorResponse).not.toBeNull();
    });

    it("errorResponse is a SpotifyResponseError object", () => {
      expect(result.errorResponse).toHaveProperty("error");
    });

    it("errorResponse.error has status", () => {
      expect(result.errorResponse.error.status).toBe(401);
    });

    it("errorResponse.error has message", () => {
      expect(result.errorResponse.error.message).toBe("error caught");
    });
  });

  describe("when fetch is successful", () => {
    beforeEach(() => {
      mockGet.mockResolvedValue({
        data: { href: "test-url" } as SpotifyPlaylistTracks
      });
    });

    describe("when fetchNextRecursive is unsuccessful", () => {
      let result: Awaited<ReturnType<typeof fetchPlaylistTracks>>;

      beforeEach(async () => {
        mockFetchNextRecursive.mockResolvedValue({
          data: null,
          errorResponse: {
            error: {
              status: 401,
              message: "error caught"
            }
          } as unknown as SpotifyResponseError
        });

        result = await fetchPlaylistTracks("test-playlist-id");
      });

      it("recursion is called", () => {
        expect(mockFetchNextRecursive).toHaveBeenCalled();
      });

      it("data is null", () => {
        expect(result.data).toBeNull();
      });

      it("errorResponse is non-null", () => {
        expect(result.errorResponse).not.toBeNull();
      });

      it("errorResponse is a SpotifyResponseError object", () => {
        expect(result.errorResponse).toHaveProperty("error");
      });

      it("errorResponse.error has status", () => {
        expect(result.errorResponse.error.status).toBe(401);
      });

      it("errorResponse.error has message", () => {
        expect(result.errorResponse.error.message).toBe("error caught");
      });
    });

    describe("when fetchNextRecursive is successful", () => {
      let result: Awaited<ReturnType<typeof fetchPlaylistTracks>>;

      beforeEach(async () => {
        mockFetchNextRecursive.mockResolvedValue({
          data: [
            {
              added_at: "",
              added_by: {
                id: "",
                type: "user"
              },
              is_local: false,
              track: {
                id: "",
                name: "",
                artists: [],
                album: {
                  id: "",
                  name: "",
                  images: []
                },
                duration_ms: 0,
                explicit: false,
                type: "track",
                uri: ""
              }
            }
          ] as unknown as SpotifyPlaylistTrack[],
          errorResponse: null
        });

        result = await fetchPlaylistTracks("test-playlist-id");
      });

      it("recursion is called", () => {
        expect(mockFetchNextRecursive).toHaveBeenCalled();
      });

      it("errorResponse is null", () => {
        expect(result.errorResponse).toBeNull();
      });

      it("data is non-null", () => {
        expect(result.data).not.toBeNull();
      });

      describe("data is a SpotifyPlaylistTrack array", () => {
        const mockedTrack: SpotifyPlaylistTrack = {
          added_at: "",
          added_by: {
            id: "",
            type: "user"
          },
          is_local: false,
          track: {
            id: "",
            name: "",
            artists: [],
            album: {
              id: "",
              name: "",
              images: [],
              album_type: "album",
              artists: [],
              href: "",
              release_date: "",
              release_date_precision: "year",
              restrictions: {
                reason: "explicit"
              },
              total_tracks: 0,
              type: "album"
            },
            duration_ms: 0,
            explicit: false,
            type: "track",
            href: "",
            is_local: false,
            is_playable: false,
            popularity: 0,
            preview_url: null,
            restrictions: {
              reason: "explicit"
            },
            track_number: 0
          }
        };

        Object.keys(mockedTrack).forEach((key) => {
          it(`data element has ${key} property`, () => {
            expect((result.data as SpotifyPlaylistTrack[])[0]).toHaveProperty(key);
          });
        });
      });
    });
  });
});
