//
// API layer for interacting with the book marketplace backend.
//
// API layer for interacting with the book marketplace backend.
//
const API_BASE = "https://vscode-internal-1-beta.beta01.cloud.kavia.ai:3001"; // Use actual backend URL

// Helper for authenticated fetch
async function request(endpoint, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let opts = {
    method,
    headers,
    credentials: "include",
  };
  if (body) opts.body = JSON.stringify(body);
  const resp = await fetch(`${API_BASE}${endpoint}`, opts);

  // Handle error/response shape regardless of ok status
  let json;
  try {
    json = await resp.json();
  } catch {
    json = {};
  }
  if (!resp.ok) throw new Error(json.detail || json.message || resp.statusText);
  return json;
}

// PUBLIC_INTERFACE
export const api = {
  // Auth
  // Login uses /auth/token with OAuth2PasswordRequestForm, expect { username, password }
  login: async ({ email, password }) => {
    // Backend expects "username" (which is username or email) and password via form-encoded
    const body = new URLSearchParams();
    // The backend uses OAuth2PasswordRequestForm's "username" field
    body.append("username", email); // can be username or email used in login
    body.append("password", password);

    const resp = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    let json;
    try {
      json = await resp.json();
    } catch {
      json = {};
    }
    if (!resp.ok) throw new Error(json.detail || json.message || resp.statusText);
    return json;
  },

  // Register user (expects { username, email, password })
  register: (data) => request("/auth/register", "POST", data),

  // Current user ("me") profile
  me: (token) => request("/users/me", "GET", null, token),

  // Books
  listBooks: (query = "", token) => request(`/books/`, "GET", null, token), // No search param in backend by default
  getBook: (id, token) => request(`/books/${id}`, "GET", null, token),
  createBook: (data, token) => request("/books/", "POST", data, token),
  updateBook: (id, data, token) => request(`/books/${id}`, "PATCH", data, token),
  deleteBook: (id, token) => request(`/books/${id}`, "DELETE", null, token),

  // Swaps
  // To fetch sent swaps: /swaps/sent; received: /swaps/received
  listSentSwaps: (token) => request("/swaps/sent", "GET", null, token),
  listReceivedSwaps: (token) => request("/swaps/received", "GET", null, token),
  createSwap: (data, token) => request("/swaps/", "POST", data, token),

  // Update swap: PATCH /swaps/{swap_id} with { status }
  respondSwap: (swapId, status, token) => request(`/swaps/${swapId}`, "PATCH", { status }, token),

  // User profile
  getUser: (id, token) => request(`/users/${id}`, "GET", null, token),
  // Profile update not directly supported; assuming not available

  // Notifications
  listNotifications: (token) => request("/notifications/", "GET", null, token),
  markNotificationRead: (id, token) => request(`/notifications/${id}/read`, "PATCH", null, token),
};
