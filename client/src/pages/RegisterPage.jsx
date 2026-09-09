"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../redux/slices/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
} from "react-icons/fa";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "consumer",
    phone: "",
    address: { street: "", city: "", state: "", zipCode: "" },
  });

  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      if (user?.role === "admin") navigate("/admin/dashboard");
      else if (user?.role === "farmer") navigate("/farmer/dashboard");
      else navigate("/");
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    dispatch(register(formData));
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-green-50 via-green-100 to-green-200
                    py-12 px-4 relative">

      {/* Floating icons */}
      <div className="absolute top-10 left-10 text-5xl animate-bounce opacity-20 pointer-events-none">🍃</div>
      <div className="absolute bottom-10 right-10 text-6xl animate-bounce-slow opacity-20 pointer-events-none">🌾</div>
      <div className="absolute top-1/2 left-1/4 text-5xl animate-pulse opacity-10 pointer-events-none">🍎</div>
      <div className="absolute top-1/3 right-1/3 text-5xl animate-pulse opacity-10 pointer-events-none">🌻</div>

      <div className="max-w-md w-full glass p-10 rounded-2xl shadow-lg space-y-8">
        <div className="text-center">
          <FaLeaf className="text-green-500 text-4xl mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-green-900">Create your account</h2>
          <p className="mt-2 text-sm text-green-700">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-green-900 hover:text-green-800"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {passwordError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {passwordError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-green-900 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-green-700" />
              </div>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full pl-10 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-green-900 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-green-700" />
              </div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-10 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-green-900 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-green-700" />
              </div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                minLength="6"
                className="w-full pl-10 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-green-900 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-green-700" />
              </div>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                minLength="6"
                className="w-full pl-10 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">I am a:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-2 px-3 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
              required
            >
              <option value="consumer">Consumer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          {/* Conditional Farmer Fields */}
          {formData.role === "farmer" && (
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-green-900 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-green-700" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full pl-10 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Address</label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-green-700" />
                    </div>
                    <input
                      name="address.street"
                      type="text"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full pl-10 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="address.city"
                      type="text"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-3 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
                    />
                    <input
                      name="address.state"
                      type="text"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-3 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
                    />
                  </div>

                  <input
                    name="address.zipCode"
                    type="text"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP / Postal code"
                    className="w-full px-3 py-2 rounded-lg bg-green-100 text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg bg-yellow-400 text-green-900 font-bold hover:bg-yellow-500 transition shadow"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
