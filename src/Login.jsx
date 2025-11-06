import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const STORAGE_KEY = "teacher_resources_v1";

function App() {
    const [resources, setResources] = useState([]);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("Alle");
    const titleRef = useRef();
    const descRef = useRef();
    const fileRef = useRef();
    const categoryRef = useRef();

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            setResources(JSON.parse(raw));
        } else {
            const sample = [
                {
                    id: Date.now(),
                    title: "Regneark: Brøk-øvelser",
                    description: "Oppgaver om brøk med fasit og sjekkliste.",
                    category: "Matematikk",
                    filename: "brok-ovelser.pdf",
                    dataUrl: "",
                    createdAt: new Date().toISOString(),
                },
            ];
            setResources(sample);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    }, [resources]);

    function handleUpload(e) {
        e.preventDefault();
        const file = fileRef.current.files[0];
        const title = titleRef.current.value.trim() || (file ? file.name : "Uten tittel");
        const description = descRef.current.value.trim();
        const cat = categoryRef.current.value;

        if (!file) {
            alert("Velg en fil å laste opp.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            const item = {
                id: Date.now() + Math.random(),
                title,
                description,
                category: cat,
                filename: file.name,
                dataUrl,
                createdAt: new Date().toISOString(),
            };
            setResources((prev) => [item, ...prev]);
            titleRef.current.value = "";
            descRef.current.value = "";
            fileRef.current.value = "";
            categoryRef.current.value = "Matematikk";
        };
        reader.readAsDataURL(file);
    }

    function handleDelete(id) {
        if (!confirm("Slette denne ressursen permanent?")) return;
        setResources((prev) => prev.filter((r) => r.id !== id));
    }

    function filtered() {
        return resources.filter((r) => {
            const matchesQuery =
                query === "" ||
                r.title.toLowerCase().includes(query.toLowerCase()) ||
                r.description.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = category === "Alle" || r.category === category;
            return matchesQuery && matchesCategory;
        });
    }

    const categories = Array.from(new Set(["Alle", ...resources.map((r) => r.category || "Uspesifisert")]));

    // 👉 knapp som går til main.jsx
    function goToMain() {
        window.location.href = "/src/mainPage.jsx";
    }

    return (
        <div className="page">
            <header className="header">
                <h1>Del & Last ned Oppgaver</h1>
                <p className="subtitle">Et enkelt sted for lærere å dele og finne oppgaver andre har brukt.</p>
            </header>
            <main className="container">
                <section className="left">
                    <div className="card">
                        <h2>Last opp en oppgave</h2>
                        <form onSubmit={handleUpload} className="form">
                            <input ref={titleRef} placeholder="Tittel (valgfri)" className="input" />
                            <input ref={categoryRef} defaultValue="Matematikk" className="input" list="catlist" />
                            <datalist id="catlist">
                                <option>Matematikk</option>
                                <option>Norsk</option>
                                <option>Engelsk</option>
                                <option>Naturfag</option>
                            </datalist>
                            <textarea ref={descRef} placeholder="Kort beskrivelse" rows={3} className="textarea" />
                            <input ref={fileRef} type="file" className="input-file" />
                            <div className="row space-x">
                                <button type="submit" className="btn-primary">Last opp</button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        titleRef.current.value = "";
                                        descRef.current.value = "";
                                        fileRef.current.value = "";
                                    }}
                                    className="btn"
                                >
                                    Tilbakestill
                                </button>
                            </div>
                        </form>
                        <p className="note">
                            Oppgaver lagres lokalt i nettleseren (eksempel). For produksjon: koble til backend/lagringsløsning.
                        </p>
                    </div>
                    <div className="card">
                        <h2>Søk i oppgaver</h2>
                        <div className="row space-x" style={{ marginBottom: 12 }}>
                            <input placeholder="Søk tittel eller beskrivelse..." value={query} onChange={(e) => setQuery(e.target.value)} className="input" />
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="select">
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            {filtered().length === 0 ? (
                                <p className="muted">Ingen ressurser funnet.</p>
                            ) : (
                                filtered().map((r) => (
                                    <div key={r.id} className="resource">
                                        <div>
                                            <strong>{r.title}</strong>
                                            <div className="meta">{r.category} — {new Date(r.createdAt).toLocaleString()}</div>
                                            {r.description && <div className="desc">{r.description}</div>}
                                        </div>
                                        <div className="row actions">
                                            {r.dataUrl ? (
                                                <a href={r.dataUrl} download={r.filename} className="link-btn">Last ned</a>
                                            ) : (
                                                <button disabled className="link-btn disabled">Ingen fil</button>
                                            )}
                                            <button onClick={() => handleDelete(r.id)} className="delete-btn">Slett</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
                <aside className="right">
                    <div className="card">
                        <h3>Hvordan fungerer dette?</h3>
                        <ul className="list">
                            <li>Last opp filer med tittel og beskrivelse.</li>
                            <li>Andre lærere kan søke og laste ned filene.</li>
                            <li>Eksempel bruker localStorage. I produksjon: lag backend + lagring (S3, SharePoint, osv.).</li>
                        </ul>
                    </div>
                    <div className="card">
                        <h3>Tips</h3>
                        <ol className="list">
                            <li>Bruk tydelig tittel og fag/kategori.</li>
                            <li>Legg ved læringsmål i beskrivelsen.</li>
                            <li>Merk filer med klassetrinn og varighet.</li>
                            <li>Dersom det er videregående oppgaver, merk studie/yrkes linje, å trinn.</li>
                        </ol>

                        {/* 👇 Knappen som går til main.jsx */}
                        <button onClick={goToMain} className="btn-primary" style={{ marginTop: 10 }}>
                            Gå til hovedsiden
                        </button>
                    </div>
                </aside>
            </main>
            <footer className="footer">
                <small>Privat demo — lagringsmetode: localStorage. Bytt til server for deling mellom brukere.</small>
            </footer>
        </div>
    );
}

// Render
const rootEl = document.getElementById("root") || document.body.appendChild(document.createElement("div"));
rootEl.id = "root";
createRoot(rootEl).render(<App />);

export default App;
