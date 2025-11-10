import React, { useState, useEffect, useContext, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import './styles.css';


/*
  App.jsx
  Enkel, selvstendig React-app (JSX) med:
   - AuthContext (fake/auth-localStorage)
   - Login-side
   - Forside (beskyttet)
   - Enkel klient-side routing
   - Tailwind-klasser for rask styling

  For å bruke: sett opp et React-prosjekt (vite/create-react-app), installer react-router-dom og framer-motion, og inkluder Tailwind.
  npm install react-router-dom framer-motion
*/

/* ---------------------- AuthContext ---------------------- */
const AuthContext = createContext(null);

function Stil() {
    return (
        <div className ="stil">
            hei verden!
        </div>
    );
}

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("app_user");
      return raw ? JSON.parse(raw) : null;
    // eslint-disable-next-line no-unused-vars
    } catch (Error) {
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
    // Her kan du bytte ut mot et ekte API-kall.
    await new Promise((r) => setTimeout(r, 600));

    // enkel validering (bare demonstrasjon)
    if (!email.includes("@") || password.length < 8) {
      setLoading(false);
      throw new Error("Ugyldig e-post eller passord");
    }

    const fakeUser = { id: Date.now(), email, name: email.split("@")[0] };
    setUser(fakeUser);
    setLoading(false);
    return fakeUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------------- ProtectedRoute ---------------------- */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* ---------------------- Login-side ---------------------- */
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Logg inn</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="din@epost.no"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Passord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="••••••••"
              required
              minLength={4}
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-sky-600 text-white font-medium disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logger inn…" : "Logg inn"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <span>Har du ikke konto? </span>
          <Link to="/signup" className="text-sky-600 underline">
            Opprett en
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Signup (enkelt) ---------------------- */
function SignupPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Opprett konto</h2>
        <p className="text-sm text-slate-600 mb-6">Dette er bare et demo-skjema. Ved opprettelse blir du automatisk logget inn via login-siden.</p>
        <button className="w-full py-2 rounded-lg bg-sky-600 text-white" onClick={() => navigate('/login')}>
          Gå til login
        </button>
      </div>
    </div>
  );
}

/* ---------------------- Forside (protected) ---------------------- */
function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <header className="flex items-center justify-between max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Min App</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-700">Hei, {user?.name}</span>
          <button onClick={logout} className="px-3 py-1 rounded-md border">Logg ut</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Forside</h2>
          <p className="text-slate-600">Velkommen til forsiden — dette innholdet er beskyttet og synlig kun når du er logget inn.</p>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Profil" body={`E-post: ${user?.email}`} />
          <Card title="Snarveier" body={"Legg til favorittfunksjoner her."} />
        </section>
      </main>
    </div>
  );
}

function Card({ title, body }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="text-sm text-slate-600">{body}</div>
    </div>
  );
}

/* ---------------------- App (routing + eksport) ---------------------- */
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

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
