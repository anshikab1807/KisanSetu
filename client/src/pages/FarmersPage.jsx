"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaSearch, FaLeaf } from "react-icons/fa";

const FarmersPage = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);

  useEffect(() => {
    dispatch(getAllFarmers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredFarmers(
      farmers?.filter((farmer) =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [farmers, searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <FaLeaf className="text-green-600 text-6xl mx-auto mb-4 drop-shadow-lg" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-800 mb-4 drop-shadow-lg">
          Meet Our Farmers
        </h1>
        <p className="text-green-700 text-lg sm:text-xl">
          Connect with local farmers and explore fresh, organic produce.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-12 max-w-md mx-auto relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search farmers..."
          className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 text-lg shadow-md bg-green-50"
        />
        <FaSearch className="absolute left-4 top-3.5 text-green-500 text-xl" />
      </div>

      {/* Farmers Grid */}
      {filteredFarmers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFarmers.map((farmer) => (
            <FarmerCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-3xl shadow-lg p-12 max-w-lg mx-auto bg-green-50">
          <FaLeaf className="text-green-600 text-6xl mx-auto mb-4" />
          <h3 className="text-3xl font-extrabold text-green-800 mb-2">
            No Farmers Found
          </h3>
          <p className="text-green-700 text-lg">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmersPage;
