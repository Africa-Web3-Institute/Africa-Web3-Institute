import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

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
      // TODO: replace with real API call
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      //   credentials: "include",
      // });
      // if (!res.ok) throw new Error("Invalid credentials");
      // const data = await res.json();
      // login(data.user);

      // Mock login — remove when backend is ready
      await new Promise(r => setTimeout(r, 800));

      if (
        email === "admin@africaweb3institute.org" &&
        password === "admin123"
      ) {
        login({
          id: 1,
          name: "Admin User",
          email,
          role: "admin",
          avatar: null,
        });
        navigate("/admin");
      } else {
        setError("Invalid email or password. Please try again.");
      }
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