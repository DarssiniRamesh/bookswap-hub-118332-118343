import React, { useState } from "react";
import { useApp } from "../context";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function CreateBook() {
  const { token, fetchBooks } = useApp();
  const [form, setForm] = useState({ title: "", author: "", genre: "", description: "", cover_url: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.createBook(form, token);
      fetchBooks();
      navigate("/books");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>List a Book for Swap</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Title</label>
        <input required value={form.title} onChange={e => setForm(v => ({ ...v, title: e.target.value }))} />
        <label>Author</label>
        <input required value={form.author} onChange={e => setForm(v => ({ ...v, author: e.target.value }))} />
        <label>Genre</label>
        <input required value={form.genre} onChange={e => setForm(v => ({ ...v, genre: e.target.value }))} />
        <label>Description</label>
        <textarea value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))} />
        <label>Cover Image URL</label>
        <input value={form.cover_url} onChange={e => setForm(v => ({ ...v, cover_url: e.target.value }))} />
        {err && <div className="error">{err}</div>}
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateBook;
