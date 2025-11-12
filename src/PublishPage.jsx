import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PublishPage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <div className="mark">DM</div>
          <div className="title">DataMattebase</div>
        </Link>
      </header>

      <div className="hero" style={{ flexDirection: "column", alignItems: "center" }}>
        <h1>Utforsk og Publiser</h1>
        <p>Her kan du se hva andre har publisert — eller dele noe selv.</p>
        <div className="actions" style={{ marginTop: "20px" }}>
          <button className="btn btn-primary" onClick={() => alert("Publiseringsfunksjon kommer snart!")}>
            Publiser noe
          </button>
          <button className="btn btn-ghost" style={{ marginLeft: "10px" }} onClick={() => navigate("/")}>
            Se andres innlegg
          </button>
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} DataMattebase — By Markus
      </footer>
    </div>
  );
}
