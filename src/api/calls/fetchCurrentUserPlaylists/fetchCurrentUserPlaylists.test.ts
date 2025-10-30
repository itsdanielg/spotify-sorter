import { describe, it, expect, vi, beforeEach } from "vitest";
import { axiosInstance } from "@/api";
import { SpotifyResponseError, SpotifySimplifiedPlaylist, SpotifyUserPlaylists } from "@/types";
import * as helpers from "../fetchNextRecursive";
import { fetchCurrentUserPlaylists } from "./fetchCurrentUserPlaylists";

describe(fetchCurrentUserPlaylists, () => {
  const mockGet = vi.spyOn(axiosInstance, "get");
  const mockFetchNextRecursive = vi.spyOn(helpers, "fetchNextRecursive");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("when fetch is unsuccessful", async () => {
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

    const { data, errorResponse } = await fetchCurrentUserPlaylists();

    it("data is null", () => {
      expect(data).toBeNull();
    });

    it("errorResponse is non-null", () => {
      expect(errorResponse).not.toBeNull();
    });

    it("errorResponse is a SpotifyResponseError object", () => {
      expect(errorResponse).toHaveProperty("error");
    });

    it("errorResponse.error has status", () => {
      expect(errorResponse.error.status).toBe(401);
    });

    it("errorResponse.error has message", () => {
      expect(errorResponse.error.message).toBe("error caught");
    });
  });

  describe("when fetch is successful", () => {
    beforeEach(() => {
      mockGet.mockResolvedValue({
        data: { href: "test-url" } as SpotifyUserPlaylists
      });
    });

    describe("when fetchNextRecursive is unsuccessful", async () => {
      let result: Awaited<ReturnType<typeof fetchCurrentUserPlaylists>>;

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

        result = await fetchCurrentUserPlaylists();
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

    describe("when fetchNextRecursive is successful", async () => {
      let result: Awaited<ReturnType<typeof fetchCurrentUserPlaylists>>;

      beforeEach(async () => {
        mockFetchNextRecursive.mockResolvedValue({
          data: [
            {
              id: "",
              name: "",
              collaborative: false,
              description: null,
              href: "",
              images: [],
              owner: {
                id: "",
                display_name: null,
                images: [],
                type: "user"
              },
              public: false,
              tracks: {
                href: "",
                total: 0
              },
              type: "playlist"
            }
          ] as unknown as SpotifySimplifiedPlaylist[],
          errorResponse: null
        });

        result = await fetchCurrentUserPlaylists();
      });

      it("errorResponse is null", () => {
        expect(result.errorResponse).toBeNull();
      });

      it("data is non-null", () => {
        expect(result.data).not.toBeNull();
      });

      describe("data is a SpotifySimplifiedPlaylist array", () => {
        const mockedPlaylists: SpotifySimplifiedPlaylist[] = [
          {
            id: "",
            name: "",
            collaborative: false,
            description: null,
            href: "",
            images: [],
            owner: {
              id: "",
              display_name: null,
              images: [],
              type: "user"
            },
            public: false,
            tracks: {
              href: "",
              total: 0
            },
            type: "playlist"
          }
        ];

        Object.keys(mockedPlaylists[0]).forEach((key) => {
          it(`data element has ${key} property`, () => {
            expect((result.data as SpotifySimplifiedPlaylist[])[0]).toHaveProperty(key);
          });
        });
      });
    });
  });
});
