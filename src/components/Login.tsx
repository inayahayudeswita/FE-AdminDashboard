import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoCMS from "../assets/images/logoCMS.jpg";
import login1 from "../assets/images/login1.jpg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    error: authError,
    loading: authLoading,
    isAuthenticated,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/home";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (authError) setError(authError);
  }, [authError]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    clearError();

    try {
      await login(email.trim(), password);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials or try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Image */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-50 justify-center items-center p-10">
          <img src={login1} alt="Login Illustration" className="w-4/5 object-contain" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 md:p-12 bg-white flex flex-col">
          <div className="flex justify-center mb-6">
            <img src={logoCMS} alt="CMS Logo" className="w-24 h-auto" />
          </div>

          <h2 className="text-center text-2xl font-extrabold text-gray-800 mb-8 select-none">
            Welcome Back, Please Login
          </h2>

          {error && (
            <div className="mb-5 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col space-y-6">
            <label className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700 mb-2 select-none">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="username"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                aria-label="Email Address"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700 mb-2 select-none">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                aria-label="Password"
              />
            </label>

            <div className="flex justify-between items-center text-sm">
              <a href="#" className="text-indigo-600 hover:text-indigo-800 transition">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                authLoading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              aria-busy={authLoading}
            >
              {authLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
