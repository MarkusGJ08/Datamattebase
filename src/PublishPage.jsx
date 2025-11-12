import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PublishPage({ posts }) {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <div className="mark">M</div>
          <div className="title">Min Nettside</div>
        </Link>
      </header>

      <div className="hero" style={{ flexDirection: "column", alignItems: "center" }}>
        <h1>Utforsk og Publiser</h1>
        <p>Her kan du se hva andre har publisert — eller dele noe selv.</p>
        <div className="actions" style={{ marginTop: "20px" }}>
          <button className="btn btn-primary" onClick={() => navigate("/publish/new")}>
            Publiser noe
          </button>
          <button className="btn btn-ghost" style={{ marginLeft: "10px" }} onClick={() => navigate("/")}>
            Tilbake til Hjem
          </button>
        </div>
      </div>

      <div className="grid" style={{ marginTop: "30px" }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%", color: "gray" }}>
            Ingen innlegg publisert enda.
          </p>
        ) : (
          posts.map((post, i) => (
            <div key={i} className="card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              {post.file && (
                <a
                  href={post.file}
                  download
                  style={{ color: "blue", fontSize: "14px" }}
                >
                  Last ned fil
                </a>
              )}
            </div>
          ))
        )}
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Min Nettside — By Markus
      </footer>
    </div>
  );
}
