import { describe, it, expect, vi, beforeEach } from "vitest";
import { axiosInstance } from "@/api";
import { SpotifyResponseError } from "@/types";
import { FetchNextRecursiveData, fetchNextRecursive } from "./fetchNextRecursive";

describe(fetchNextRecursive, () => {
  const mockGet = vi.spyOn(axiosInstance, "get");

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

    const { data, errorResponse } = await fetchNextRecursive("", []);

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

  describe("when fetch is successful with no next page", async () => {
    const mockedItems = [1, 2, 3];
    let result: Awaited<ReturnType<typeof fetchNextRecursive>>;

    beforeEach(async () => {
      mockGet.mockResolvedValue({
        data: {
          href: "",
          limit: 0,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
          items: mockedItems
        } as unknown as FetchNextRecursiveData
      });

      result = await fetchNextRecursive("test-url", []);
    });

    it("axiosInstance.get is called once", () => {
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it("axiosInstance.get is called with correct url", () => {
      expect(mockGet).toHaveBeenCalledWith("test-url", {
        headers: {
          "Content-Type": "application/json"
        }
      });
    });

    it("errorResponse is null", () => {
      expect(result.errorResponse).toBeNull();
    });

    it("data is non-null", () => {
      expect(result.data).not.toBeNull();
    });

    it("data contains items from response", () => {
      expect(result.data).toEqual(mockedItems);
    });
  });

  describe("when fetch is successful with next page", async () => {
    const firstPageItems = [1, 2, 3];
    const secondPageItems = [4, 5, 6];
    let result: Awaited<ReturnType<typeof fetchNextRecursive>>;

    beforeEach(async () => {
      mockGet
        .mockResolvedValueOnce({
          data: {
            href: "page-1",
            limit: 3,
            next: "page-2",
            offset: 0,
            previous: null,
            total: 6,
            items: firstPageItems
          } as unknown as FetchNextRecursiveData
        })
        .mockResolvedValueOnce({
          data: {
            href: "page-2",
            limit: 3,
            next: null,
            offset: 3,
            previous: "page-1",
            total: 6,
            items: secondPageItems
          } as unknown as FetchNextRecursiveData
        });

      result = await fetchNextRecursive("page-1", []);
    });

    it("axiosInstance.get is called twice", () => {
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    it("first call uses initial url", () => {
      expect(mockGet).toHaveBeenNthCalledWith(1, "page-1", {
        headers: {
          "Content-Type": "application/json"
        }
      });
    });

    it("second call uses next url", () => {
      expect(mockGet).toHaveBeenNthCalledWith(2, "page-2", {
        headers: {
          "Content-Type": "application/json"
        }
      });
    });

    it("errorResponse is null", () => {
      expect(result.errorResponse).toBeNull();
    });

    it("data is non-null", () => {
      expect(result.data).not.toBeNull();
    });

    it("data contains items from all pages", () => {
      expect(result.data).toEqual([...firstPageItems, ...secondPageItems]);
    });
  });

  describe("when accumulating to existing array", async () => {
    const newItems = [1, 2, 3];
    let result: Awaited<ReturnType<typeof fetchNextRecursive>>;

    beforeEach(async () => {
      mockGet.mockResolvedValue({
        data: {
          href: "page-1",
          limit: 0,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
          items: newItems
        } as unknown as FetchNextRecursiveData
      });

      const existingItems = [0];
      result = await fetchNextRecursive("page-1", existingItems);
    });

    it("data contains both existing and new items", () => {
      expect(result.data).toEqual([0, ...newItems]);
    });
  });
});
