import React, { useEffect } from "react";
import { useApp } from "../context";
import { api } from "../api";

function Notifications() {
  const { notifications, notifLoading, fetchNotifications, token } = useApp();

  useEffect(() => { fetchNotifications(); }, [token]);

  async function markAsRead(id) {
    await api.markNotificationRead(id, token);
    fetchNotifications();
  }

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h2>Notifications</h2>
      {notifLoading ? <div>Loading...</div> : (
        <ul className="notification-list">
          {notifications.length === 0 && <li>No notifications.</li>}
          {notifications.map(n => (
            <li key={n.id} className={n.read ? "read" : "unread"}>
              <span>{n.message} <small style={{ color: "#888" }}>{new Date(n.created_at).toLocaleString()}</small></span>
              {!n.read && <button className="btn btn-accent" style={{ marginLeft: 10 }} onClick={() => markAsRead(n.id)}>Mark as read</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default Notifications;
