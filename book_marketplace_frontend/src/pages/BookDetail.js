import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useApp();
  const [book, setBook] = useState(null);
  const [err, setErr] = useState("");
  const [swapOk, setSwapOk] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBook(id, token).then(setBook).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="container"><div>Loading...</div></div>;
  if (err) return <div className="container"><div className="error">{err}</div></div>;
  if (!book) return <div className="container"><div>Book not found.</div></div>;

  async function handleSwap() {
    setSwapOk("");
    try {
      await api.createSwap({ book_id: Number(id) }, token);
      setSwapOk("Swap request sent!");
    } catch (e) {
      setSwapOk(e.message || "Unable to request swap.");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <img src={'https://via.placeholder.com/128x180?text=No+Cover'} alt={book.title} width={130} height={180} />
        <div style={{ flex: 1 }}>
          <h2>{book.title}</h2>
          <p>by <strong>{book.author}</strong></p>
          <p><b>Description:</b> {book.description || <em>-</em>}</p>
          <p><b>Owner:</b> <span>{book.owner_id}</span></p>
          {user && user.id !== book.owner_id && (
            <button className="btn btn-primary" onClick={handleSwap}>Request Swap</button>
          )}
          {swapOk && <div className={`${swapOk.startsWith("Swap") ? "success" : "error"}`}>{swapOk}</div>}
        </div>
      </div>
    </div>
  );
}
export default BookDetail;
