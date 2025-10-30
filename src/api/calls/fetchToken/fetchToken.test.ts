import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SpotifyResponseError } from "@/types";
import { fetchToken } from "./fetchToken";

describe(fetchToken, () => {
  const mockPost = vi.spyOn(axios, "post");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("when fetching with authorization code", () => {
    describe("when fetch is unsuccessful", () => {
      let result: Awaited<ReturnType<typeof fetchToken>>;

      beforeEach(async () => {
        mockPost.mockRejectedValue({
          response: {
            data: {
              error: {
                status: 400,
                message: "Invalid authorization code"
              }
            } as unknown as SpotifyResponseError
          }
        });

        result = await fetchToken({ code: "invalid_code", codeVerifier: "verifier123" });
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
        expect(result.errorResponse.error.status).toBe(400);
      });

      it("errorResponse.error has message", () => {
        expect(result.errorResponse.error.message).toBe("Invalid authorization code");
      });
    });

    describe("when fetch is successful", () => {
      let result: Awaited<ReturnType<typeof fetchToken>>;

      beforeEach(async () => {
        mockPost.mockResolvedValue({
          data: {
            access_token: "BQD123abc",
            token_type: "Bearer",
            expires_in: 3600,
            refresh_token: "AQA456def",
            scope: "playlist-read-private playlist-modify-public"
          }
        });

        result = await fetchToken({ code: "valid_code", codeVerifier: "verifier123" });
      });

      it("errorResponse is null", () => {
        expect(result.errorResponse).toBeNull();
      });

      it("data is non-null", () => {
        expect(result.data).not.toBeNull();
      });

      describe("data is a TokenResponse object", () => {
        const expectedKeys = ["access_token", "token_type", "expires_in", "refresh_token", "scope"];

        expectedKeys.forEach((key) => {
          it(`data has ${key} property`, () => {
            expect(result.data).toHaveProperty(key);
          });
        });
      });

      it("calls the correct endpoint and sends correct parameters", () => {
        expect(mockPost).toHaveBeenCalledTimes(1);

        const callArgs = mockPost.mock.calls[0];
        expect(callArgs).toBeDefined();

        const [url, body, config] = callArgs;
        expect(url).toBe("https://accounts.spotify.com/api/token");
        expect(config?.headers?.["Content-Type"]).toBe("application/x-www-form-urlencoded");

        const bodyParams = new URLSearchParams(body as string);
        expect(bodyParams.get("code")).toBe("valid_code");
        expect(bodyParams.get("code_verifier")).toBe("verifier123");
        expect(bodyParams.get("grant_type")).toBe("authorization_code");
      });
    });
  });

  describe("when fetching with refresh token", () => {
    describe("when fetch is unsuccessful", () => {
      let result: Awaited<ReturnType<typeof fetchToken>>;

      beforeEach(async () => {
        mockPost.mockRejectedValue({
          response: {
            data: {
              error: {
                status: 400,
                message: "Invalid refresh token"
              }
            } as unknown as SpotifyResponseError
          }
        });

        result = await fetchToken({ refreshToken: "invalid_refresh_token" });
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
        expect(result.errorResponse.error.status).toBe(400);
      });

      it("errorResponse.error has message", () => {
        expect(result.errorResponse.error.message).toBe("Invalid refresh token");
      });
    });

    describe("when fetch is successful", () => {
      let result: Awaited<ReturnType<typeof fetchToken>>;

      beforeEach(async () => {
        mockPost.mockResolvedValue({
          data: {
            access_token: "BQD789xyz",
            token_type: "Bearer",
            expires_in: 3600,
            scope: "playlist-read-private playlist-modify-public"
          }
        });

        result = await fetchToken({ refreshToken: "valid_refresh_token" });
      });

      it("errorResponse is null", () => {
        expect(result.errorResponse).toBeNull();
      });

      it("data is non-null", () => {
        expect(result.data).not.toBeNull();
      });

      it("data has access_token", () => {
        expect(result.data).toHaveProperty("access_token");
      });

      it("calls the correct endpoint and sends correct parameters", () => {
        expect(mockPost).toHaveBeenCalledTimes(1);

        const callArgs = mockPost.mock.calls[0];
        expect(callArgs).toBeDefined();

        const [url, body, config] = callArgs;
        expect(url).toBe("https://accounts.spotify.com/api/token");
        expect(config?.headers?.["Content-Type"]).toBe("application/x-www-form-urlencoded");

        const bodyParams = new URLSearchParams(body as string);
        expect(bodyParams.get("refresh_token")).toBe("valid_refresh_token");
        expect(bodyParams.get("grant_type")).toBe("refresh_token");
        expect(bodyParams.get("code_verifier")).toBeNull();
      });
    });
  });
});
