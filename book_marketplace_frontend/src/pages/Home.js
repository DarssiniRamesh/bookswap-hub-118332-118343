import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container" style={{ margin: "2rem auto", maxWidth: 700 }}>
      <h1 style={{ color: "var(--brand-primary)", fontWeight: 700 }}>
        Welcome to BookSwap Hub!
      </h1>
      <p>Your trusted platform to swap, discover, and love new books. List your book, find swapping partners, or browse the latest arrivals.</p>
      <div className="home-actions">
        <Link to="/books" className="btn btn-primary">Browse Books</Link>{" "}
        <Link to="/login" className="btn btn-secondary">Sign In</Link>
      </div>
    </div>
  );
}

export default Home;
