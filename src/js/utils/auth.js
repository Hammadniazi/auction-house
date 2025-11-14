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
export function isAuthenticated() {
  return !!getToken();
}
