import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  removeUser,
  isAuthenticated,
  getApiKey,
  setApiKey,
  removeApiKey,
} from "../../src/js/utils/auth.js";

// Mock the constants module
vi.mock("../../src/js/config/constants", () => ({
  STORAGE_KEYS: {
    TOKEN: "auction_token",
    USER: "auction_user",
    API_KEY: "auction_api_key",
  },
}));

describe("auth.js - Authentication Utilities", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Token management", () => {
    it("should set token in localStorage", () => {
      const token = "test-token-123";
      setToken(token);
      expect(localStorage.setItem).toHaveBeenCalledWith("auction_token", token);
    });

    it("should get token from localStorage", () => {
      localStorage.getItem.mockReturnValue("stored-token");
      const result = getToken();
      expect(localStorage.getItem).toHaveBeenCalledWith("auction_token");
      expect(result).toBe("stored-token");
    });

    it("should remove token from localStorage", () => {
      removeToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith("auction_token");
    });
  });

  describe("User management", () => {
    it("should set user object in localStorage as JSON", () => {
      const user = {
        name: "testuser",
        email: "test@stud.noroff.no",
        credits: 1000,
      };
      setUser(user);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "auction_user",
        JSON.stringify(user),
      );
    });

    it("should get and parse user from localStorage", () => {
      const user = { name: "testuser", email: "test@stud.noroff.no" };
      localStorage.getItem.mockReturnValue(JSON.stringify(user));

      const result = getUser();
      expect(localStorage.getItem).toHaveBeenCalledWith("auction_user");
      expect(result).toEqual(user);
    });

    it("should return null if no user in localStorage", () => {
      localStorage.getItem.mockReturnValue(null);
      const result = getUser();
      expect(result).toBeNull();
    });

    it("should remove user from localStorage", () => {
      removeUser();
      expect(localStorage.removeItem).toHaveBeenCalledWith("auction_user");
    });
  });

  describe("API Key management", () => {
    it("should set API key in localStorage", () => {
      const apiKey = "test-api-key-456";
      setApiKey(apiKey);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "auction_api_key",
        apiKey,
      );
    });

    it("should get API key from localStorage", () => {
      localStorage.getItem.mockReturnValue("stored-api-key");
      const result = getApiKey();
      expect(localStorage.getItem).toHaveBeenCalledWith("auction_api_key");
      expect(result).toBe("stored-api-key");
    });

    it("should remove API key from localStorage", () => {
      removeApiKey();
      expect(localStorage.removeItem).toHaveBeenCalledWith("auction_api_key");
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when token exists", () => {
      localStorage.getItem.mockReturnValue("some-token");
      expect(isAuthenticated()).toBe(true);
    });

    it("should return false when token is null", () => {
      localStorage.getItem.mockReturnValue(null);
      expect(isAuthenticated()).toBe(false);
    });

    it("should return false when token is empty string", () => {
      localStorage.getItem.mockReturnValue("");
      expect(isAuthenticated()).toBe(false);
    });
  });
});
