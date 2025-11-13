import React, { useState, useEffect, useContext, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import "./styles.css";
import PublishPage from './PublishPage';
import PublishForm from './PublishForm';

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

/* ---------------------- Home Page ---------------------- */
function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          <div className="mark">DM</div>
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
          <h1>Velkommen tilbake!</h1>
          <p>Du er nå logget inn og kan bruke Nettsidens funksjoner</p>
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => navigate("/publish")}>
            Utforsk & Publiser
          </button>
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} DataMattebase — Laget av Markus Gjerde 1IKA Sjøvegan VGS
      </footer>
    </div>
  );
}

/* ---------------------- App ---------------------- */
export default function App() {
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem("published_posts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("published_posts", JSON.stringify(posts));
  }, [posts]);

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
            path="/publish"
            element={
              <ProtectedRoute>
                <PublishPage posts={posts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publish/new"
            element={
              <ProtectedRoute>
                <PublishForm setPosts={setPosts} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

