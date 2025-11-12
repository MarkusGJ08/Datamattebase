import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PublishForm({ setPosts }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      title,
      description,
      file: file ? URL.createObjectURL(file) : null,
      date: new Date().toISOString(),
    };

    setPosts((prev) => [...prev, newPost]);
    navigate("/publish");
  };

  return (
    <div className="app">
      <header className="header">
        <Link to="/publish" className="logo">
          <div className="mark">M</div>
          <div className="title">Min Nettside</div>
        </Link>
      </header>

      <div className="hero" style={{ flexDirection: "column", alignItems: "flex-start", maxWidth: "600px" }}>
        <h1>Publiser noe</h1>
        <form onSubmit={handleSubmit} className="stack" style={{ width: "100%", marginTop: "20px" }}>
          <label>Tittel</label>
          <input
            className="input"
            type="text"
            placeholder="Skriv inn en tittel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Beskrivelse</label>
          <textarea
            className="input"
            placeholder="Skriv en kort beskrivelse"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />

          <label>Last opp fil</label>
          <input
            type="file"
            className="input"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" className="btn btn-primary" style={{ marginTop: "15px" }}>
            Publiser
          </button>
        </form>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Min Nettside — By Markus
      </footer>
    </div>
  );
}
