import React, { useState, useEffect, useContext, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import "./styles.css";

/* ---------------------- AuthContext ---------------------- */
const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("app_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("app_user", JSON.stringify(user));
    else localStorage.removeItem("app_user");
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (!email.includes("@") || password.length < 8) {
      setLoading(false);
      throw new Error("Ugyldig e-post eller passord");
    }

    const fakeUser = { id: Date.now(), email, name: email.split("@")[0] };
    setUser(fakeUser);
    setLoading(false);
    return fakeUser;
  };

  const logout = () => setUser(null);
  const updateUser = (updates) => setUser((prev) => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------------- Protected Route ---------------------- */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* ---------------------- Login Page ---------------------- */
function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Noe gikk galt");
    }
  };

  return (
    <div className="app" style={{ maxWidth: "400px", marginTop: "10%" }}>
      <div className="hero" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <h1 style={{ textAlign: "center", width: "100%" }}>Logg inn</h1>
        <form onSubmit={handleSubmit} className="stack">
          <input
            type="email"
            className="input"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
          Har du ikke konto?{" "}
          <Link to="/signup" className="btn-ghost">
            Opprett en
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------------------- Signup Page ---------------------- */
function SignupPage() {
  const navigate = useNavigate();
  return (
    <div className="app" style={{ maxWidth: "400px", marginTop: "10%" }}>
      <div className="hero" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <h1 style={{ textAlign: "center", width: "100%" }}>Opprett konto</h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", textAlign: "center" }}>
          Dette er bare et demo-skjema. Bruk login-siden etterpå.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Gå til login
        </button>
      </div>
    </div>
  );
}

/* ---------------------- Home Page ---------------------- */
function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <div className="mark">M</div>
          <div className="title">Min Nettside</div>
        </Link>
        <div className="controls">
          <span>Hei, {user?.name}</span>
          <button className="btn btn-ghost" onClick={() => navigate("/profile")}>
            Profil
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            Logg ut
          </button>
        </div>
      </header>

      <div className="hero">
        <div className="text">
          <h1>Velkommen tilbake</h1>
          <p>Du er nå logget inn og kan bruke Nettsidens funksjoner.</p>
        </div>
        <div className="actions">
          <button className="btn btn-primary">Utforsk</button>
        </div>
      </div>

      <div className="grid">
        <Card title="Snarveier" text="Legg til dine favorittfunksjoner her." />
        <Card title="Innstillinger" text="Tilpass Nettsiden etter dine behov." />
        <Card title="Oppdateringer" text="Hold deg oppdatert med ny funksjonalitet." />
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Min Nettside — By Markus
      </footer>
    </div>
  );
}

/* ---------------------- Profile Page ---------------------- */
function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <div className="mark">M</div>
          <div className="title">Min Nettside</div>
        </Link>
        <div className="controls">
          <button className="btn btn-ghost" onClick={() => navigate("/")}>
            Hjem
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            Logg ut
          </button>
        </div>
      </header>

      <div className="hero" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <h1>Profil</h1>
        <p>Se og rediger informasjonen din.</p>
      </div>

      <div className="card" style={{ marginTop: "20px", maxWidth: "500px" }}>
        <label>Navn</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label style={{ marginTop: "10px" }}>E-post</label>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary" style={{ marginTop: "15px" }} onClick={handleSave}>
          Lagre endringer
        </button>
        {saved && <p style={{ color: "green", marginTop: "10px" }}>Lagret!</p>}
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Min Nettside — By Markus
      </footer>
    </div>
  );
}

/* ---------------------- Card ---------------------- */
function Card({ title, text }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* ---------------------- App ---------------------- */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
