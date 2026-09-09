"use client";

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-green-50 via-green-100 to-green-200 min-h-screen">
      <div className="glass p-6 rounded-xl max-w-lg mx-auto shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-green-500 text-6xl" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.role}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="text-gray-900">{user.phone || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="text-gray-900">{user.address || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Joined:</span>
            <span className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-6 text-right">
          <Link
            to="/profile/edit"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
