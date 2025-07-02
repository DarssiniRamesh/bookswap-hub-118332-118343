import React, { useState } from "react";
import { useApp } from "../context";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login, authLoading } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    // email could be username or email for backend login
    const res = await login(email, password);
    if (res.ok) navigate("/books");
    else setErr(res.error);
  }

  return (
    <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Email</label>
        <input type="email" value={email} autoFocus required onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} required onChange={e => setPassword(e.target.value)} />
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary" type="submit" disabled={authLoading}>
          {authLoading ? "..." : "Login"}
        </button>
      </form>
      <p style={{ fontSize: 14, marginTop: 20 }}>New user? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
export default Login;
