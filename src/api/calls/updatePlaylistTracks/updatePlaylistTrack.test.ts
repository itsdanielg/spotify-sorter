import { describe, it, expect, vi, beforeEach } from "vitest";
import { axiosInstance } from "@/api";
import { SpotifyResponseError } from "@/types";
import { updatePlaylistTrack } from "./updatePlaylistTrack";

describe(updatePlaylistTrack, () => {
  const mockPut = vi.spyOn(axiosInstance, "put");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("when startIndex equals endIndex", () => {
    let result: Awaited<ReturnType<typeof updatePlaylistTrack>>;

    beforeEach(async () => {
      result = await updatePlaylistTrack("playlist-id", 5, 5);
    });

    it("returns false without making API call", () => {
      expect(result.data).toBe(false);
      expect(result.errorResponse).toBeNull();
      expect(mockPut).not.toHaveBeenCalled();
    });
  });

  describe("when startIndex does not equal endIndex", () => {
    describe("when update is unsuccessful", () => {
      let result: Awaited<ReturnType<typeof updatePlaylistTrack>>;

      beforeEach(async () => {
        mockPut.mockRejectedValue({
          response: {
            data: {
              error: {
                status: 403,
                message: "Insufficient permissions"
              }
            } as unknown as SpotifyResponseError
          }
        });

        result = await updatePlaylistTrack("playlist-id", 0, 5);
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
        expect(result.errorResponse.error.status).toBe(403);
      });

      it("errorResponse.error has message", () => {
        expect(result.errorResponse.error.message).toBe("Insufficient permissions");
      });
    });

    describe("when update is successful", () => {
      let result: Awaited<ReturnType<typeof updatePlaylistTrack>>;

      beforeEach(async () => {
        mockPut.mockResolvedValue({ data: {} });

        result = await updatePlaylistTrack("test-playlist-id", 2, 7);
      });

      it("errorResponse is null", () => {
        expect(result.errorResponse).toBeNull();
      });

      it("data is true", () => {
        expect(result.data).toBe(true);
      });

      it("calls the correct endpoint with correct parameters", () => {
        expect(mockPut).toHaveBeenCalledTimes(1);

        const callArgs = mockPut.mock.calls[0];
        expect(callArgs).toBeDefined();

        const [url, body, config] = callArgs;
        expect(url).toBe("https://api.spotify.com/v1/playlists/test-playlist-id/tracks");
        expect(body).toEqual({
          range_start: 2,
          insert_before: 7
        });
        expect(config?.headers?.["Content-Type"]).toBe("application/json");
      });
    });
  });
});
