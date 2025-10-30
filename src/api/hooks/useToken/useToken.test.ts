/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import * as fetchTokenModule from "@/api/calls/fetchToken";
import { useToken } from "./useToken";

describe(useToken, () => {
  const mockFetchToken = vi.spyOn(fetchTokenModule, "fetchToken");

  beforeEach(() => {
    vi.resetAllMocks();
    window.sessionStorage.clear();
    delete (window as any).location;
    Object.defineProperty(window, "location", {
      value: {
        search: "",
        pathname: "/",
        href: "/"
      } as unknown as Location,
      writable: true,
      configurable: true
    });
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe("when token exists in sessionStorage", () => {
    beforeEach(() => {
      window.sessionStorage.setItem("token", "existing-token");
    });

    it("returns existing token", () => {
      const { result } = renderHook(() => useToken());
      expect(result.current.token).toBe("existing-token");
    });

    it("does not call fetchToken", () => {
      renderHook(() => useToken());
      expect(mockFetchToken).not.toHaveBeenCalled();
    });
  });

  describe("when no token exists in sessionStorage", () => {
    describe("when no code in URL", () => {
      it("returns empty token", () => {
        const { result } = renderHook(() => useToken());
        expect(result.current.token).toBe("");
      });

      it("does not call fetchToken", () => {
        renderHook(() => useToken());
        expect(mockFetchToken).not.toHaveBeenCalled();
      });
    });

    describe("when code exists in URL but no code_verifier", () => {
      beforeEach(() => {
        window.location.search = "?code=auth-code-123";
      });

      it("cleans up URL", async () => {
        renderHook(() => useToken());

        await waitFor(() => {
          expect(window.history.replaceState).toHaveBeenCalledWith({}, expect.any(String), "/");
        });
      });

      it("does not call fetchToken", () => {
        renderHook(() => useToken());
        expect(mockFetchToken).not.toHaveBeenCalled();
      });
    });

    describe("when code and code_verifier exist", () => {
      beforeEach(() => {
        window.location.search = "?code=auth-code-123";
        window.sessionStorage.setItem("code_verifier", "verifier-456");
      });

      describe("when fetchToken is successful", () => {
        beforeEach(() => {
          mockFetchToken.mockResolvedValue({
            data: {
              access_token: "new-access-token",
              refresh_token: "new-refresh-token",
              token_type: "Bearer",
              expires_in: 3600,
              scope: "playlist-read-private"
            },
            errorResponse: null
          });
        });

        it("fetches token with correct parameters", async () => {
          renderHook(() => useToken());

          await waitFor(() => {
            expect(mockFetchToken).toHaveBeenCalledWith({
              code: "auth-code-123",
              codeVerifier: "verifier-456"
            });
          });
        });

        it("stores access token in sessionStorage", async () => {
          renderHook(() => useToken());

          await waitFor(() => {
            expect(window.sessionStorage.getItem("token")).toBe("new-access-token");
          });
        });

        it("stores refresh token in sessionStorage", async () => {
          renderHook(() => useToken());

          await waitFor(() => {
            expect(window.sessionStorage.getItem("refresh_token")).toBe("new-refresh-token");
          });
        });

        it("updates token state", async () => {
          const { result } = renderHook(() => useToken());

          await waitFor(() => {
            expect(result.current.token).toBe("new-access-token");
          });
        });

        it("removes code_verifier from sessionStorage", async () => {
          renderHook(() => useToken());

          await waitFor(() => {
            expect(window.sessionStorage.getItem("code_verifier")).toBeNull();
          });
        });

        it("cleans up URL", async () => {
          renderHook(() => useToken());

          await waitFor(() => {
            expect(window.history.replaceState).toHaveBeenCalledWith({}, expect.any(String), "/");
          });
        });
      });

      describe("when fetchToken fails", () => {
        beforeEach(() => {
          mockFetchToken.mockResolvedValue({
            data: null,
            errorResponse: {
              error: {
                status: 400,
                message: "Invalid code"
              }
            }
          });
          vi.spyOn(console, "error").mockImplementation(() => {});
        });

        it("does not store token", async () => {
          renderHook(() => useToken());

          await waitFor(() => {
            expect(mockFetchToken).toHaveBeenCalled();
          });

          expect(window.sessionStorage.getItem("token")).toBeNull();
        });

        it("token remains empty", async () => {
          const { result } = renderHook(() => useToken());

          await waitFor(() => {
            expect(mockFetchToken).toHaveBeenCalled();
          });

          expect(result.current.token).toBe("");
        });

        it("logs error to console", async () => {
          renderHook(() => useToken());

          await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Error fetching token:", expect.any(Object));
          });
        });
      });
    });
  });

  describe("removeToken", () => {
    beforeEach(() => {
      window.sessionStorage.setItem("token", "test-token");
      window.sessionStorage.setItem("refresh_token", "test-refresh-token");

      Object.defineProperty(window, "location", {
        value: { href: "/dashboard" } as unknown as Location,
        writable: true,
        configurable: true
      });
    });

    it("removes token from sessionStorage", () => {
      const { result } = renderHook(() => useToken());

      result.current.removeToken();

      expect(window.sessionStorage.getItem("token")).toBeNull();
    });

    it("removes refresh_token from sessionStorage", () => {
      const { result } = renderHook(() => useToken());

      result.current.removeToken();

      expect(window.sessionStorage.getItem("refresh_token")).toBeNull();
    });

    it("redirects to home page", () => {
      const { result } = renderHook(() => useToken());

      result.current.removeToken();

      expect(window.location.href).toBe("/");
    });
  });
});
