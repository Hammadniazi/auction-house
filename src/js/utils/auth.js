import { STORTAGE_KEYS } from "../config/constants";

export function setToken(token) {
  localStorage.setItem(STORTAGE_KEYS.TOKEN, token);
}

export function getToken() {
  return localStorage.getItem(STORTAGE_KEYS.TOKEN);
}

export function removeToken() {
  localStorage.removeItem(STORTAGE_KEYS.TOKEN);
}
export function setUser(user) {
  localStorage.setItem(STORTAGE_KEYS.USER, JSON.stringify(user));
}
export function getUser() {
  const userJson = localStorage.getItem(STORTAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
}
export function removeUser() {
  localStorage.removeItem(STORTAGE_KEYS.USER);
}
// Check if the user is authenticated
export function isAuthenticated() {
  return !!getToken();
}
// Get the API from the local storage
export function getApiKey() {
  return localStorage.getItem(STORTAGE_KEYS.API_KEY);
}
// Set the API key in the local storage
export function setApiKey(apiKey) {
  localStorage.setItem(STORTAGE_KEYS.API_KEY, apiKey);
}
// Remove the API key from the local storage
export function removeApiKey() {
  localStorage.removeItem(STORTAGE_KEYS.API_KEY);
}

// Log out the user

export function logout() {
  removeToken();
  removeUser();
  removeApiKey();
  window.location.href = "/index.html";
}

// Redirect to login if not authenticated

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "/pages/login.html";
    return false;
  }
  return true;
}
