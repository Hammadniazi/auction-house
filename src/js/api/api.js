import { API_AUTH_URL } from "../config/constants.js";
import { getToken } from "../utils/auth.js";

/**
 * Base API request handler
 */

async function apiRequest(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.errors?.[0]?.message || data.message || "Request failed",
      );
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Authentication API calls
 */

export const authAPI = {
  register: async (userData) => {
    return apiRequest(`${API_AUTH_URL}/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest(`${API_AUTH_URL}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};
