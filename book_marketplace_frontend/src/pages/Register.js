import React, { useState } from "react";
import { useApp } from "../context";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const { register, authLoading } = useApp();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    // Backend expects username, email, and password, optional full_name.
    const res = await register(form);
    if (res.ok) navigate("/login");
    else setErr(res.error);
  }
  return (
    <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Name</label>
        <input type="text" required value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
        <label>Email</label>
        <input type="email" required value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} />
        <label>Password</label>
        <input type="password" required value={form.password} onChange={e => setForm(v => ({ ...v, password: e.target.value }))} />
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary" type="submit" disabled={authLoading}>
          {authLoading ? "..." : "Create Account"}
        </button>
      </form>
      <p style={{ fontSize: 14, marginTop: 20 }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
export default Register;
