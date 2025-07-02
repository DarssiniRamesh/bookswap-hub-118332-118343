import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";

// PUBLIC_INTERFACE
export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem("jwt") || "");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Books
  const [books, setBooks] = useState([]);
  const [bookLoading, setBookLoading] = useState(false);

  // Swaps (merge sent and received)
  const [swaps, setSwaps] = useState([]);
  const [swapLoading, setSwapLoading] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // On token, fetch "me" user from backend
  useEffect(() => {
    if (token) {
      api.me(token)
        .then(setUser)
        .catch(() => {
          setUser(null);
          setToken("");
          localStorage.removeItem("jwt");
        });
    } else {
      setUser(null);
      setToken("");
      localStorage.removeItem("jwt");
    }
  }, [token]);

  // Auth methods
  // The backend expects login by "username" (which can be email or username in API)
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const resp = await api.login({ email, password });
      setToken(resp.access_token);
      localStorage.setItem("jwt", resp.access_token);
      setAuthLoading(false);
      // No user field, need to refetch user afterwards
      return { ok: true };
    } catch (error) {
      setAuthLoading(false);
      return { ok: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("jwt");
  };

  const register = async (data) => {
    setAuthLoading(true);
    try {
      await api.register({
        ...data,
        username: data.name || data.username,
        full_name: data.name || data.full_name || undefined,
      });
      setAuthLoading(false);
      return { ok: true };
    } catch (error) {
      setAuthLoading(false);
      return { ok: false, error: error.message };
    }
  };

  // Book methods
  const fetchBooks = async () => {
    setBookLoading(true);
    try {
      const items = await api.listBooks("", token);
      setBooks(items);
      setBookLoading(false);
    } catch (e) {
      setBookLoading(false);
    }
  };

  // Swap methods -- combine sent and received swaps for display
  const fetchSwaps = async () => {
    setSwapLoading(true);
    try {
      const sent = await api.listSentSwaps(token);
      const rec = await api.listReceivedSwaps(token);
      // Annotate ownership/sender for UI
      const merged =
        [
          ...(sent?.map(s => ({ ...s, direction: "sent" })) || []),
          ...(rec?.map(s => ({ ...s, direction: "received" })) || [])
        ].sort((b, a) => new Date(a.requested_at) - new Date(b.requested_at));
      setSwaps(merged);
      setSwapLoading(false);
    } catch (e) {
      setSwapLoading(false);
    }
  };

  // Notifications
  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const items = await api.listNotifications(token);
      setNotifications(items);
      setNotifLoading(false);
    } catch (e) {
      setNotifLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      token, user, authLoading, login, logout, register,
      books, bookLoading, fetchBooks,
      swaps, swapLoading, fetchSwaps,
      notifications, notifLoading, fetchNotifications,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
}
