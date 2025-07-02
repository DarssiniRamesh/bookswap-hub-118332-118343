import React from "react";
import { useApp } from "../context";

function Profile() {
  const { user } = useApp();

  if (!user) return null;

  return (
    <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Profile</h2>
      <div className="form">
        <label>Name</label>
        <input value={user.full_name || user.username || ""} disabled style={{ background: "#eee" }} />
        <label>Email</label>
        <input value={user.email || ""} disabled style={{ background: "#eee" }} />
        <label>Member since</label>
        <input value={user.created_at ? new Date(user.created_at).toLocaleDateString() : ""} disabled style={{ background: "#eee" }} />
      </div>
    </div>
  );
}
export default Profile;
