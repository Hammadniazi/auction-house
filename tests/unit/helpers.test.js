import { describe, it, expect } from "vitest";
import {
  validateEmail,
  getTimeRemaining,
  formatTimeRemaining,
  getHighestBid,
  truncateText,
  formatDate,
} from "../../src/js/utils/helpers.js";

describe("helpers.js - Utility Functions", () => {
  describe("validateEmail", () => {
    it("should return true for valid @stud.noroff.no email", () => {
      expect(validateEmail("test@stud.noroff.no")).toBe(true);
      expect(validateEmail("student123@stud.noroff.no")).toBe(true);
    });

    it("should return false for invalid email domains", () => {
      expect(validateEmail("test@gmail.com")).toBe(false);
      expect(validateEmail("test@noroff.no")).toBe(false);
      expect(validateEmail("test@stud.example.com")).toBe(false);
    });

    it("should return false for empty or malformed emails", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("notanemail")).toBe(false);
    });
  });

  describe("getTimeRemaining", () => {
    it("should calculate time remaining correctly for future date", () => {
      const futureDate = new Date(Date.now() + 86400000); // 1 day from now
      const result = getTimeRemaining(futureDate);

      expect(result.isExpired).toBe(false);
      expect(result.days).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it("should mark as expired for past date", () => {
      const pastDate = new Date(Date.now() - 86400000); // 1 day ago
      const result = getTimeRemaining(pastDate);

      expect(result.isExpired).toBe(true);
      expect(result.total).toBeLessThanOrEqual(0);
    });

    it("should return correct structure", () => {
      const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
      const result = getTimeRemaining(futureDate);

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("days");
      expect(result).toHaveProperty("hours");
      expect(result).toHaveProperty("minutes");
      expect(result).toHaveProperty("seconds");
      expect(result).toHaveProperty("isExpired");
    });
  });

  describe("formatTimeRemaining", () => {
    it("should return 'Aution Ended' for past dates", () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(formatTimeRemaining(pastDate)).toBe("Aution Ended");
    });

    it("should format days and hours for dates > 1 day away", () => {
      const futureDate = new Date(Date.now() + 86400000 * 2); // 2 days from now
      const result = formatTimeRemaining(futureDate);
      expect(result).toMatch(/\d+d \d+h/);
    });

    it("should format hours and minutes for dates < 1 day away", () => {
      const futureDate = new Date(Date.now() + 3600000 * 2); // 2 hours from now
      const result = formatTimeRemaining(futureDate);
      expect(result).toMatch(/\d+h \d+m/);
    });
  });

  describe("getHighestBid", () => {
    it("should return the highest bid amount", () => {
      const bids = [
        { amount: 100 },
        { amount: 250 },
        { amount: 150 },
        { amount: 300 },
      ];
      expect(getHighestBid(bids)).toBe(300);
    });

    it("should return 0 for empty bids array", () => {
      expect(getHighestBid([])).toBe(0);
    });

    it("should return 0 for null or undefined bids", () => {
      expect(getHighestBid(null)).toBe(0);
      expect(getHighestBid(undefined)).toBe(0);
    });

    it("should handle single bid", () => {
      const bids = [{ amount: 500 }];
      expect(getHighestBid(bids)).toBe(500);
    });
  });

  describe("truncateText", () => {
    it("should truncate text longer than maxLength", () => {
      const longText = "This is a very long text that should be truncated";
      const result = truncateText(longText, 20);
      expect(result).toBe("This is a very long ...");
      expect(result.length).toBe(23); // 20 chars + "..."
    });

    it("should not truncate text shorter than maxLength", () => {
      const shortText = "Short text";
      expect(truncateText(shortText, 20)).toBe("Short text");
    });

    it("should use default maxLength of 100", () => {
      const text = "a".repeat(150);
      const result = truncateText(text);
      expect(result.length).toBe(103); // 100 + "..."
    });

    it("should return empty string for null or undefined", () => {
      expect(truncateText(null)).toBe("");
      expect(truncateText(undefined)).toBe("");
    });
  });

  describe("formatDate", () => {
    it("should format date string correctly", () => {
      const dateString = "2024-12-25T10:30:00Z";
      const result = formatDate(dateString);

      expect(result).toContain("December");
      expect(result).toContain("25");
      expect(result).toContain("2024");
    });

    it("should include time in formatted output", () => {
      const dateString = "2024-01-15T14:45:00Z";
      const result = formatDate(dateString);

      // Should contain time components
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });
});
