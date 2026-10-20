import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { authApi } from "../../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Already logged in — redirect to admin
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Was a raw fetch("/api/admin/login") -- a relative URL resolves
      // against the dev server origin (localhost:5173), not the backend
      // (localhost:3001 / VITE_API_URL). authApi.login already knows the
      // right base URL and handles JSON/error parsing consistently with
      // every other authenticated call in the app.
      const data = await authApi.login(email, password);

      const token = data?.token;
      const user = data?.user || data?.data?.user || { id: 1, name: "Admin", email, role: "admin" };

      if (!token) {
        // Was previously just a console.warn -- login proceeded anyway,
        // navigated to /admin with no token stored, the first
        // authenticated request 401'd, and api.js's handler hard-
        // redirected back to /login via window.location.href. That's a
        // full page reload, not a React state update, so the error
        // state below never got a chance to render -- looked exactly
        // like a silent login loop with no error message.
        console.error("Login response missing expected token field. Raw response:", data);
        throw new Error("Login succeeded but no session token was returned. Check the backend response shape.");
      }

      // AuthContext.login() is the single place that writes to
      // localStorage["awi_admin_user"] -- pass it the token-inclusive
      // object directly rather than writing here too. Writing in both
      // places meant AuthContext's own setItem (storing just `user`,
      // no token) silently overwrote this file's write right after,
      // wiping the token every single login.
      login({ ...user, token });
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">

        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <img
            src="../../../public/awi-logo.png"
            alt="AWI Logo"
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-white text-xl font-bold">
            Africa Web3 Institute
          </h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white text-lg font-semibold mb-1">Sign in</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your credentials to access the admin dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@africaweb3institute.org"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D4A017" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = "#b8891a")}
              onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = "#D4A017")}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Restricted access. Authorised personnel only.
          </p>
        </div>

        <div className="text-center mt-6">
         <a 
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Africa Web3 Institute
          </a>
        </div>
      </div>
    </div>
  );
}
