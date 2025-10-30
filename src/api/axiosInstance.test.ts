/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fetchTokenModule from "./calls";
import { axiosInstance } from "./axiosInstance";

describe("axiosInstance interceptors", () => {
  const mockFetchToken = vi.spyOn(fetchTokenModule, "fetchToken");

  beforeEach(() => {
    vi.resetAllMocks();
    window.sessionStorage.clear();

    Object.defineProperty(window, "location", {
      value: { href: "/" },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe("request interceptor", () => {
    it("adds Authorization header when token exists", async () => {
      window.sessionStorage.setItem("token", "test-token");

      const mockAdapter = vi.fn().mockResolvedValue({ data: "success" });
      axiosInstance.defaults.adapter = mockAdapter;

      await axiosInstance.get("/test");

      const requestConfig = mockAdapter.mock.calls[0][0];
      expect(requestConfig.headers.Authorization).toBe("Bearer test-token");
    });

    it("does not add Authorization header when token does not exist", async () => {
      const mockAdapter = vi.fn().mockResolvedValue({ data: "success" });
      axiosInstance.defaults.adapter = mockAdapter;

      await axiosInstance.get("/test");

      const requestConfig = mockAdapter.mock.calls[0][0];
      expect(requestConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe("response interceptor", () => {
    describe("when response is successful", () => {
      it("returns response as-is", async () => {
        const mockAdapter = vi.fn().mockResolvedValue({
          data: "success",
          status: 200
        });
        axiosInstance.defaults.adapter = mockAdapter;

        const response = await axiosInstance.get("/test");

        expect(response.data).toBe("success");
      });
    });

    describe("when response is non-401 error", () => {
      it("rejects with error", async () => {
        const mockAdapter = vi.fn().mockRejectedValue({
          response: { status: 500 },
          config: {}
        });
        axiosInstance.defaults.adapter = mockAdapter;

        await expect(axiosInstance.get("/test")).rejects.toMatchObject({
          response: { status: 500 }
        });
      });
    });

    describe("when response is 401 error", () => {
      describe("when request has already been retried", () => {
        it("rejects without retrying", async () => {
          const mockAdapter = vi.fn().mockRejectedValue({
            response: { status: 401 },
            config: { _retry: true }
          });
          axiosInstance.defaults.adapter = mockAdapter;

          await expect(axiosInstance.get("/test")).rejects.toMatchObject({
            response: { status: 401 }
          });

          expect(mockFetchToken).not.toHaveBeenCalled();
        });
      });

      describe("when no refresh token exists", () => {
        it("removes token and redirects to home", async () => {
          const hrefSpy = vi.fn();
          Object.defineProperty(window.location, "href", {
            set: hrefSpy,
            configurable: true
          });

          window.sessionStorage.setItem("token", "old-token");

          const mockAdapter = vi.fn().mockRejectedValue({
            response: { status: 401 },
            config: {}
          });
          axiosInstance.defaults.adapter = mockAdapter;

          await expect(axiosInstance.get("/test")).rejects.toMatchObject({
            response: { status: 401 }
          });

          expect(window.sessionStorage.getItem("token")).toBeNull();
          expect(hrefSpy).toHaveBeenCalledWith("/");
          expect(mockFetchToken).not.toHaveBeenCalled();
        });
      });

      describe("when refresh token exists", () => {
        beforeEach(() => {
          window.sessionStorage.setItem("token", "old-token");
          window.sessionStorage.setItem("refresh_token", "refresh-token");
        });

        describe("when token refresh is successful", () => {
          it("refreshes token and retries request", async () => {
            mockFetchToken.mockResolvedValue({
              data: {
                access_token: "new-token",
                refresh_token: "refresh-token",
                token_type: "Bearer",
                expires_in: 3600,
                scope: "test"
              },
              errorResponse: null
            });

            let callCount = 0;
            const mockAdapter = vi.fn().mockImplementation(() => {
              callCount++;
              if (callCount === 1) {
                return Promise.reject({
                  response: { status: 401 },
                  config: { headers: {} }
                });
              }
              return Promise.resolve({ data: "success", status: 200 });
            });
            axiosInstance.defaults.adapter = mockAdapter;

            const response = await axiosInstance.get("/test");

            expect(mockFetchToken).toHaveBeenCalledWith({
              refreshToken: "refresh-token"
            });
            expect(window.sessionStorage.getItem("token")).toBe("new-token");
            expect(response.data).toBe("success");
            expect(mockAdapter).toHaveBeenCalledTimes(2);
          });

          it("sets new token in retry request headers", async () => {
            mockFetchToken.mockResolvedValue({
              data: {
                access_token: "new-token",
                refresh_token: "refresh-token",
                token_type: "Bearer",
                expires_in: 3600,
                scope: "test"
              },
              errorResponse: null
            });

            let callCount = 0;
            const mockAdapter = vi.fn().mockImplementation((config) => {
              callCount++;
              if (callCount === 1) {
                return Promise.reject({
                  response: { status: 401 },
                  config: { headers: {} }
                });
              }
              expect(config.headers.Authorization).toBe("Bearer new-token");
              return Promise.resolve({ data: "success", status: 200 });
            });
            axiosInstance.defaults.adapter = mockAdapter;

            await axiosInstance.get("/test");
          });
        });

        describe("when token refresh fails", () => {
          it("removes tokens and redirects to home", async () => {
            const hrefSpy = vi.fn();
            Object.defineProperty(window.location, "href", {
              set: hrefSpy,
              configurable: true
            });

            mockFetchToken.mockResolvedValue({
              data: null,
              errorResponse: {
                error: {
                  status: 400,
                  message: "Invalid refresh token"
                }
              }
            });

            const mockAdapter = vi.fn().mockRejectedValue({
              response: { status: 401 },
              config: {}
            });
            axiosInstance.defaults.adapter = mockAdapter;

            await expect(axiosInstance.get("/test")).rejects.toMatchObject({
              response: { status: 401 }
            });

            expect(window.sessionStorage.getItem("token")).toBeNull();
            expect(window.sessionStorage.getItem("refresh_token")).toBeNull();
            expect(hrefSpy).toHaveBeenCalledWith("/");
          });
        });
      });
    });
  });
});
