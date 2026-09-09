"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsumerOrders } from "../redux/slices/orderSlice";
import OrderItem from "../components/OrderItem";
import Loader from "../components/Loader";
import { FaShoppingBasket, FaAppleAlt, FaSeedling, FaSun } from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getConsumerOrders());
  }, [dispatch]);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const getButtonClass = (status) =>
    `px-4 py-2 rounded-full transition-colors font-medium shadow-md ${
      filter === status
        ? status === "rejected" || status === "cancelled"
          ? "bg-red-400 text-white"
          : status === "pending"
          ? "bg-yellow-400 text-green-900"
          : "bg-green-500 text-white"
        : "bg-white text-green-900 hover:bg-green-100"
    }`;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-12 relative overflow-hidden">

      {/* Floating decorative icons */}
      <div className="absolute top-10 left-10 text-5xl animate-bounce opacity-20 pointer-events-none">🍎</div>
      <div className="absolute bottom-20 right-10 text-6xl animate-bounce-slow opacity-20 pointer-events-none">🌾</div>
      <div className="absolute top-1/2 left-1/4 text-5xl animate-pulse opacity-10 pointer-events-none">🍃</div>
      <div className="absolute top-1/3 right-1/3 text-5xl animate-pulse opacity-10 pointer-events-none">🌻</div>

      <div className="max-w-4xl mx-auto text-center mb-12">
        <FaShoppingBasket className="text-green-900 text-6xl mx-auto mb-4 drop-shadow-lg" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-900 mb-4 drop-shadow-lg">
          My Orders
        </h1>
        <p className="text-green-700 text-lg sm:text-xl">
          Track and manage your orders from local farmers
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {["all", "pending", "accepted", "completed", "rejected", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={getButtonClass(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredOrders.map((order) => (
            <OrderItem key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/70 rounded-3xl p-8 shadow-lg max-w-md mx-auto">
          <FaShoppingBasket className="text-green-900 text-5xl mx-auto mb-4 drop-shadow-lg" />
          <h3 className="text-2xl font-extrabold text-green-900 mb-2">
            No Orders Found
          </h3>
          <p className="text-green-700 text-lg">
            {filter === "all"
              ? "You haven't placed any orders yet."
              : `You don't have any ${filter} orders.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
