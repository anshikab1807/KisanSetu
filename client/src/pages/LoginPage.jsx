"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());

    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4">
      <div className="max-w-md w-full glass p-12 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <FaLeaf className="text-green-600 text-5xl mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800">
            Welcome Back!
          </h2>
          <p className="mt-2 text-green-700 text-lg">
            Sign in to explore fresh produce from local farmers
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            role="alert"
          >
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-green-700 font-semibold mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-green-600" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 py-3 rounded-full border border-green-400 focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-900 bg-green-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-green-700 font-semibold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-green-600" />
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 py-3 rounded-full border border-green-400 focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-900 bg-green-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-green-700 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-green-400" />
              Remember me
            </label>
            <Link to="#" className="hover:text-green-900 font-semibold">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-yellow-50 font-extrabold py-3 rounded-full text-xl hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-green-700">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-green-800 hover:text-green-900">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
