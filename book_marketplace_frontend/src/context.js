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

  // Swaps
  const [swaps, setSwaps] = useState([]);
  const [swapLoading, setSwapLoading] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // Load user on token change or init
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
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const resp = await api.login({ email, password });
      setToken(resp.access_token);
      localStorage.setItem("jwt", resp.access_token);
      setUser(resp.user || null);
      setAuthLoading(false);
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
      await api.register(data);
      setAuthLoading(false);
      return { ok: true };
    } catch (error) {
      setAuthLoading(false);
      return { ok: false, error: error.message };
    }
  };

  // Book methods
  const fetchBooks = async (q = "") => {
    setBookLoading(true);
    try {
      const items = await api.listBooks(q, token);
      setBooks(items);
      setBookLoading(false);
    } catch (e) {
      setBookLoading(false);
    }
  };

  // Swap methods
  const fetchSwaps = async () => {
    setSwapLoading(true);
    try {
      const items = await api.listSwaps(token);
      setSwaps(items);
      setSwapLoading(false);
    } catch (e) {
      setSwapLoading(false);
    }
  };

  // Notification methods
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
