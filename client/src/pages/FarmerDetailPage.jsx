"use client";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerProfile, clearFarmerProfile } from "../redux/slices/farmerSlice";
import { getProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { FaLeaf, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const FarmerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { farmerProfile, loading } = useSelector((state) => state.farmers);
  const { products, loading: productsLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFarmerProfile(id));
    dispatch(getProducts({ farmer: id }));

    return () => {
      dispatch(clearFarmerProfile());
    };
  }, [dispatch, id]);

  if (loading || productsLoading) return <Loader />;

  if (!farmerProfile) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Farmer not found
        </div>
        <Link to="/farmers" className="text-green-700 hover:text-green-900 font-semibold">
          Back to Farmers
        </Link>
      </div>
    );
  }

  const { farmer, profile } = farmerProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8">
      <Link to="/farmers" className="flex items-center text-green-700 hover:text-green-900 mb-6 font-semibold">
        <FaArrowLeft className="mr-2" />
        Back to Farmers
      </Link>

      <div className="glass p-6 rounded-3xl mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center shadow-md">
              <FaLeaf className="text-green-500 text-4xl" />
            </div>
          </div>
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-2 text-green-800">{profile?.farmName || farmer.name}</h1>

            <div className="flex flex-wrap items-center text-green-700 mb-4">
              {farmer.address && (
                <div className="flex items-center mr-6 mb-2">
                  <FaMapMarkerAlt className="text-green-500 mr-2" />
                  <span>{farmer.address.city}, {farmer.address.state}</span>
                </div>
              )}
              {farmer.phone && (
                <div className="flex items-center mr-6 mb-2">
                  <FaPhone className="text-green-500 mr-2" />
                  <span>{farmer.phone}</span>
                </div>
              )}
              <div className="flex items-center mb-2">
                <FaEnvelope className="text-green-500 mr-2" />
                <span>{farmer.email}</span>
              </div>
            </div>

            {profile?.description && <p className="text-green-700 mb-4">{profile.description}</p>}
          </div>
        </div>
      </div>

      {/* Farming Practices */}
      {profile?.farmingPractices?.length > 0 && (
        <div className="glass p-6 rounded-3xl mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Farming Practices</h2>
          <ul className="space-y-2 text-green-700">
            {profile.farmingPractices.map((practice, index) => (
              <li key={index} className="flex items-start">
                <FaLeaf className="text-green-500 mt-1 mr-2" />
                <span>{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800">Available Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 glass rounded-3xl shadow-lg bg-green-50">
            <FaLeaf className="text-green-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-green-800">No Products Available</h3>
            <p className="text-green-700">This farmer doesn't have any products listed at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDetailPage;
