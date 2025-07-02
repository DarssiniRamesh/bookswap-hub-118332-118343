import React, { useEffect, useState } from "react";
import { useApp } from "../context";
import { Link } from "react-router-dom";

function BookList() {
  const { books, bookLoading, fetchBooks } = useApp();
  const [q, setQ] = useState("");

  useEffect(() => { fetchBooks(q); }, [q]);

  return (
    <div className="container">
      <h2>Available Books for Swap</h2>
      <input
        type="text"
        value={q}
        placeholder="Search books..."
        style={{ width: 240, marginBottom: 20 }}
        onChange={e => setQ(e.target.value)}
      />
      <div className="grid">
        {bookLoading ? <div>Loading...</div> : books.length === 0 ? <div>No books found.</div> : (
          books.map(book =>
            <Link to={`/books/${book.id}`} key={book.id} className="card book-card">
              <img src={'https://via.placeholder.com/128x180?text=No+Cover'} alt={book.title} width={100} height={140} />
              <div>
                <strong>{book.title}</strong>
                <div>{book.author}</div>
                <div style={{ fontSize: 12, color: "#888" }}>Owner ID: {book.owner_id}</div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
export default BookList;
