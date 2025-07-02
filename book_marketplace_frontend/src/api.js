//
// API layer for interacting with the book marketplace backend.
//
const API_BASE = "https://vscode-internal-1-beta.beta01.cloud.kavia.ai:3001"; // CORS/tunnel needed for local dev if required

// Helper for authenticated fetch
async function request(endpoint, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
    credentials: "include",
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(json.detail || json.message || resp.statusText);
  return json;
}

// PUBLIC_INTERFACE
export const api = {
  // Auth
  login: (data) => request("/auth/login", "POST", data),
  register: (data) => request("/auth/register", "POST", data),
  me: (token) => request("/users/me", "GET", null, token),

  // Books
  listBooks: (query = "", token) => request(`/books${query ? "?q=" + encodeURIComponent(query) : ""}`, "GET", null, token),
  getBook: (id, token) => request(`/books/${id}`, "GET", null, token),
  createBook: (data, token) => request("/books", "POST", data, token),
  updateBook: (id, data, token) => request(`/books/${id}`, "PUT", data, token),
  deleteBook: (id, token) => request(`/books/${id}`, "DELETE", null, token),

  // Swap
  listSwaps: (token) => request("/swaps", "GET", null, token),
  getSwap: (id, token) => request(`/swaps/${id}`, "GET", null, token),
  createSwap: (data, token) => request("/swaps", "POST", data, token),
  respondSwap: (id, action, token) => request(`/swaps/${id}/${action}`, "POST", null, token),

  // User + profile
  getUser: (id, token) => request(`/users/${id}`, "GET", null, token),
  updateProfile: (data, token) => request("/users/me", "PUT", data, token),

  // Notifications
  listNotifications: (token) => request("/notifications", "GET", null, token),
  markNotificationRead: (id, token) => request(`/notifications/${id}/read`, "POST", null, token),
};
