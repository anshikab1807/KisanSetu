"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerOrders,
  updateOrderStatus,
} from "../../redux/slices/orderSlice";
import OrderItem from "../../components/OrderItem";
import Loader from "../../components/Loader";
import { FaShoppingBasket } from "react-icons/fa";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { farmerOrders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    dispatch(getFarmerOrders());
  }, [dispatch]);

  const filteredOrders =
    filter === "all"
      ? farmerOrders
      : farmerOrders.filter((order) => order.status === filter);

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

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-green-50 via-green-100 to-green-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-green-800">Manage Orders</h1>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "accepted", "completed", "rejected", "cancelled"].map(
            (status) => {
              let bgClass = "bg-gray-100 text-gray-700 hover:bg-gray-200";
              if (filter === status) {
                if (["rejected", "cancelled"].includes(status))
                  bgClass = "bg-red-500 text-white";
                else if (status === "pending") bgClass = "bg-blue-500 text-white";
                else bgClass = "bg-green-500 text-white";
              }
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${bgClass}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="glass bg-white/80 shadow-lg rounded-xl p-4 hover:shadow-xl transition-shadow"
            >
              <OrderItem order={order} />
              <div className="mt-4 border-t border-green-200 pt-4 flex justify-end">
                <button
                  onClick={() => handleUpdateStatus(order)}
                  className="px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
                  disabled={
                    order.status === "completed" || order.status === "cancelled"
                  }
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass bg-white/70 shadow-lg rounded-xl">
          <FaShoppingBasket className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "You don't have any orders yet."
              : `You don't have any ${filter} orders.`}
          </p>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-800">Update Order Status</h3>
            <p className="mb-4 text-gray-700">
              Order #{selectedOrder._id.substring(0, 8)} for{" "}
              {selectedOrder.consumer.name}
            </p>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-green-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-input rounded-lg border border-green-300 px-3 py-2 w-full"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
