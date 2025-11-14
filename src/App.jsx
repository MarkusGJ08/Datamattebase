// App.jsx (oppdatert routing for å bruke DashboardPage)
import React, { useState, useEffect, useContext, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import "./styles.css";
import PublishPage from './PublishPage';
import PublishForm from './PublishForm';
import DashboardPage from './DashboardPage'; // ny side

/* ---------------------- AuthContext ---------------------- */
const AuthContext = createContext(null);

export function useAuth() {
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
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/"); // Hvis allerede innlogget
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <h2>Logg inn</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passord (minst 8 tegn)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Logger inn..." : "Logg inn"}
        </button>
      </form>
    </div>
  );
}

/* ---------------------- App (root) ---------------------- */
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
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                {/* Dashboard receives posts, setPosts and auth helpers */}
                <DashboardPageWrapper posts={posts} setPosts={setPosts} />
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

/* Small wrapper so we can pass auth context into DashboardPage as a prop */
function DashboardPageWrapper({ posts, setPosts }) {
  const auth = useContext(AuthContext);
  return <DashboardPage posts={posts} setPosts={setPosts} auth={auth} />;
}
