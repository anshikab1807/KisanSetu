"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice";
import OrderItem from "../../components/OrderItem";
import Loader from "../../components/Loader";
import { FaSearch, FaFilter, FaShoppingBasket } from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders, loading } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (adminOrders) {
      let filtered = [...adminOrders];

      if (filter !== "all") {
        filtered = filtered.filter((order) => order.status === filter);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (order) =>
            order._id.includes(searchTerm) ||
            order.consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredOrders(filtered);
    }
  }, [adminOrders, filter, searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      dispatch(updateOrderStatus({ id: selectedOrder._id, status: newStatus }));
      setShowStatusModal(false);
    }
  };

  if (loading && adminOrders.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8 relative overflow-hidden">

      {/* Floating icons */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20 pointer-events-none">🍎</div>
      <div className="absolute top-1/3 right-1/4 text-5xl animate-pulse opacity-10 pointer-events-none">🍃</div>
      <div className="absolute bottom-10 right-10 text-6xl animate-bounce-slow opacity-20 pointer-events-none">🌾</div>

      <div className="max-w-5xl mx-auto text-center mb-8">
        <FaShoppingBasket className="text-yellow-400 text-6xl mx-auto mb-4 drop-shadow-lg" />
        <h1 className="text-4xl font-extrabold text-green-800 mb-2 drop-shadow-lg">All Orders</h1>
        <p className="text-green-700 text-lg">
          Manage and update order statuses from farmers and consumers
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-5xl mx-auto">
        <div className="md:w-1/2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by order ID, customer, or farmer..."
            className="w-full px-4 py-2 pl-10 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-green-400" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <FaFilter className="text-green-400" />
          {["all","pending","accepted","completed","rejected","cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                filter === status
                  ? status === "rejected" || status === "cancelled"
                    ? "bg-red-400 text-white"
                    : "bg-yellow-400 text-green-800"
                  : "bg-white text-green-800 border border-green-200 hover:bg-green-50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4 max-w-5xl mx-auto">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white/80 rounded-xl p-4 shadow-lg glass">
              <OrderItem order={order} />
              <div className="mt-4 border-t border-green-100 pt-4 flex justify-end">
                <button
                  onClick={() => handleUpdateStatus(order)}
                  className="px-4 py-2 bg-yellow-400 text-green-800 font-bold rounded-lg hover:bg-yellow-500 transition"
                  disabled={order.status === "completed" || order.status === "cancelled"}
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/80 rounded-xl shadow-lg glass max-w-md mx-auto">
          <FaShoppingBasket className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">No Orders Found</h3>
          <p className="text-green-700">
            {filter === "all" && !searchTerm
              ? "There are no orders in the system yet."
              : "No orders match your search criteria."}
          </p>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-800">Update Order Status</h3>
            <p className="mb-4 text-green-700">
              Order #{selectedOrder._id.substring(0, 8)} for {selectedOrder.consumer.name}
            </p>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-green-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-green-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
              >
                {["pending","accepted","rejected","completed","cancelled"].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-green-200 rounded-lg text-green-800 hover:bg-green-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-4 py-2 bg-yellow-400 text-green-800 rounded-lg font-bold hover:bg-yellow-500 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
