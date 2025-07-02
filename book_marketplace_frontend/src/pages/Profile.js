import React, { useEffect, useState } from "react";
import { useApp } from "../context";
import { api } from "../api";

function Profile() {
  const { user, token, setUser } = useApp();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const updated = await api.updateProfile(form, token);
      setUser(updated);
      setMsg("Profile updated.");
    } catch (e) {
      setMsg("Could not update profile.");
    }
  }

  if (!form) return null;
  return (
    <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Profile</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
        <label>Email</label>
        <input value={form.email} disabled style={{ background: "#eee" }} />
        <button type="submit" className="btn btn-primary">Save</button>
        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </form>
    </div>
  );
}
export default Profile;
