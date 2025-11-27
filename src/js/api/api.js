import { API_AUTH_URL, API_AUCTION_URL } from "../config/constants.js";
import { getToken, getApiKey } from "../utils/auth.js";

/**
 * Base API request handler
 */

async function apiRequest(url, options = {}) {
  const token = getToken();
  const apiKey = getApiKey();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (apiKey) {
    headers["X-Noroff-API-Key"] = apiKey;
  }

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

  createApiKey: async (name = "Auction App Key") => {
    return apiRequest(`${API_AUTH_URL}/create-api-key`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },
};

//  Listing API calls

export const listingAPI = {
  getAllListings: async (params = {}) => {
    const queryParams = new URLSearchParams({ ...params });
    return apiRequest(`${API_AUCTION_URL}/listings?${queryParams}`);
  },

  createListing: async (listingData) => {
    return apiRequest(`${API_AUCTION_URL}/listings`, {
      method: "POST",
      body: JSON.stringify(listingData),
    });
  },
  getListing: async (id) => {
    return apiRequest(
      `${API_AUCTION_URL}/listings/${id}?_seller=true&_bids=true`,
    );
  },
};

//  Profile API call
export const profileAPI = {
  getProfile: async (username) => {
    return apiRequest(`${API_AUCTION_URL}/profiles/${username}`);
  },
  updateProfile: async (username, data) => {
    return apiRequest(`${API_AUCTION_URL}/profiles/${username}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  getProfileListings: async (username) => {
    return apiRequest(
      `${API_AUCTION_URL}/profiles/${username}/listings?_bids=true&_seller=true`,
    );
  },
};
