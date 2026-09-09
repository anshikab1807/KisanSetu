"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../redux/slices/orderSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import {
  FaArrowLeft,
  FaLeaf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaComment,
} from "react-icons/fa";

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { order, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const receiverId =
      user.role === "consumer" ? order.farmer._id : order.consumer._id;

    dispatch(
      sendMessage({
        receiver: receiverId,
        content: message,
        relatedOrder: id,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "accepted":
      case "completed":
        return "bg-green-200 text-green-800";
      case "rejected":
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading || !order) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8 min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Back Button */}
      <Link
        to={`/${user.role === "farmer" ? "farmer/" : ""}orders`}
        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
      >
        <FaArrowLeft className="mr-2" />
        Back to Orders
      </Link>

      {/* Order Summary */}
      <div className="glass shadow-lg rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md">
        <div className="p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Order #{order._id.slice(-6)}
              </h1>
              <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold shadow ${getStatusBadgeClass(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Order & Pickup/Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Info */}
            <div className="glass p-6 rounded-xl space-y-4 bg-white/70 backdrop-blur-md">
              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
              <div className="flex justify-between text-gray-700">
                <span>Total Amount:</span>
                <span className="font-bold">₨{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 capitalize">
                <span>Payment Method:</span>
                <span className="font-semibold text-green-900">{order.paymentMethod ? order.paymentMethod.replace("_", " ") : "cash"}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Payment Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.isPaid ? "bg-green-200 text-green-900" : "bg-yellow-200 text-yellow-900"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending Payment"}
                </span>
              </div>
              {order.paymentInfo?.razorpayPaymentId && (
                <div className="text-xs text-gray-600 bg-green-50 p-2 rounded-lg border border-green-200">
                  <span className="font-semibold">Razorpay Payment ID:</span> {order.paymentInfo.razorpayPaymentId}
                </div>
              )}
              {order.notes && (
                <div>
                  <span className="text-gray-600 block mb-2">Notes:</span>
                  <p className="bg-white p-3 rounded-lg border border-gray-200">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Pickup/Delivery Info */}
            <div className="glass p-6 rounded-xl space-y-4 bg-white/70 backdrop-blur-md">
              <h2 className="text-xl font-semibold text-gray-800">
                {order.pickupDetails?.location ? "Pickup Details" : "Delivery Details"}
              </h2>
              {order.pickupDetails?.location ? (
                <div className="space-y-3">
                  <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                    <FaMapMarkerAlt className="text-green-500 mr-3" />
                    <span className="text-gray-700">{order.pickupDetails.location}</span>
                  </div>
                  {order.pickupDetails.date && (
                    <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                      <FaCalendarAlt className="text-green-500 mr-3" />
                      <span className="text-gray-700">{formatDate(order.pickupDetails.date)}</span>
                    </div>
                  )}
                  {order.pickupDetails.time && (
                    <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                      <FaClock className="text-green-500 mr-3" />
                      <span className="text-gray-700">{order.pickupDetails.time}</span>
                    </div>
                  )}
                </div>
              ) : order.deliveryDetails?.address ? (
                <div className="space-y-3">
                  <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                    <FaMapMarkerAlt className="text-green-500 mt-1 mr-3" />
                    <div className="text-gray-700">
                      <p>{order.deliveryDetails.address.street}</p>
                      <p>
                        {order.deliveryDetails.address.city},{" "}
                        {order.deliveryDetails.address.state}{" "}
                        {order.deliveryDetails.address.zipCode}
                      </p>
                    </div>
                  </div>
                  {order.deliveryDetails.date && (
                    <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                      <FaCalendarAlt className="text-green-500 mr-3" />
                      <span className="text-gray-700">{formatDate(order.deliveryDetails.date)}</span>
                    </div>
                  )}
                  {order.deliveryDetails.time && (
                    <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                      <FaClock className="text-green-500 mr-3" />
                      <span className="text-gray-700">{order.deliveryDetails.time}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No delivery/pickup details provided</p>
              )}
            </div>
          </div>

          {/* Customer & Farmer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {["consumer", "farmer"].map((role) => (
              <div key={role} className="glass p-6 rounded-xl space-y-2 bg-white/70 backdrop-blur-md">
                <h2 className="text-xl font-semibold text-gray-800">
                  {role === "consumer" ? "Customer" : "Farmer"} Information
                </h2>
                <p className="font-medium text-gray-800">{order[role].name}</p>
                <p className="text-gray-600">{order[role].email}</p>
                {order[role].phone && <p className="text-gray-600">{order[role].phone}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="glass shadow-lg rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Product", "Price", "Quantity", "Total"].map((title) => (
                    <th key={title} className="text-left py-4 px-4 text-gray-600 font-semibold">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex items-center justify-center">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaLeaf className="text-green-500 text-2xl" />
                          )}
                        </div>
                        <span className="text-gray-800 font-medium">{item.product.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-gray-700">₨{item.price.toFixed(2)}</td>
                    <td className="text-center py-4 px-4 text-gray-700">{item.quantity}</td>
                    <td className="text-right py-4 px-4 text-gray-800 font-medium">
                      ₨{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right py-4 px-4 font-bold text-gray-800">
                    Total:
                  </td>
                  <td className="text-right py-4 px-4 font-bold text-gray-800">
                    ₨{order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="glass shadow-lg rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md">
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Contact {user.role === "consumer" ? "Farmer" : "Customer"}
          </h2>

          {showMessageForm ? (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Write your message to the ${user.role === "consumer" ? "farmer" : "customer"}...`}
                className="w-full px-4 py-3 rounded-lg border border-green-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                rows={4}
                required
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowMessageForm(true)}
              className="flex items-center space-x-3 text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
            >
              <FaComment className="text-xl" />
              <span>Send a message about this order to the {user.role === "consumer" ? "farmer" : "customer"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
