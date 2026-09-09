"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../redux/slices/cartSlice";
import { createOrder, resetOrderSuccess } from "../redux/slices/orderSlice";
import { FaArrowLeft, FaLeaf, FaTrash } from "react-icons/fa";
import Loader from "../components/Loader";
import { placeholder } from "../assets";

const CheckoutPage = () => {
  const [orderType, setOrderType] = useState("pickup");
  const [orderDetails, setOrderDetails] = useState({
    pickupDetails: { date: "", time: "", location: "" },
    deliveryDetails: { address: { street: "", city: "", state: "", zipCode: "" }, date: "", time: "" },
    paymentMethod: "cash",
    notes: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, farmerId, farmerName } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);
  const { loading, success, order } = useSelector((state) => state.orders);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    dispatch(resetOrderSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (success && order) {
      const newOrderId = order._id;
      dispatch(resetOrderSuccess());
      navigate(`/orders/${newOrderId}`);
    }
  }, [success, order, navigate, dispatch]);

  useEffect(() => {
    if (user && user.address) {
      setOrderDetails((prev) => ({
        ...prev,
        deliveryDetails: { ...prev.deliveryDetails, address: { ...user.address } },
      }));
    }
  }, [user]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRemoveItem = (productId) => dispatch(removeFromCart(productId));
  const handleQuantityChange = (productId, quantity) => dispatch(updateCartQuantity({ productId, quantity }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      setOrderDetails({
        ...orderDetails,
        [parent]: grandchild
          ? { ...orderDetails[parent], [child]: { ...orderDetails[parent][child], [grandchild]: value } }
          : { ...orderDetails[parent], [child]: value },
      });
    } else {
      setOrderDetails({ ...orderDetails, [name]: value });
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return;

    const API_URL = import.meta.env.VITE_API_URL;
    const totalAmount = calculateTotal();

    const orderData = {
      farmer: farmerId,
      items: cartItems.map((item) => ({ product: item.productId, quantity: item.quantity, price: item.price })),
      notes: orderDetails.notes,
      paymentMethod: orderDetails.paymentMethod,
      ...(orderType === "pickup" ? { pickupDetails: orderDetails.pickupDetails } : { deliveryDetails: orderDetails.deliveryDetails }),
    };

    if (orderDetails.paymentMethod === "online") {
      setIsProcessingPayment(true);
      try {
        const res = await loadRazorpayScript();
        if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          setIsProcessingPayment(false);
          return;
        }

        const { data } = await axios.post(
          `${API_URL}/payment/create-order`,
          { amount: totalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!data.success) {
          alert("Could not create Razorpay order");
          setIsProcessingPayment(false);
          return;
        }

        const currentKey = data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

        // If using placeholder key or simulated order, complete test payment directly
        if (currentKey === "rzp_test_KisanSetu1234" || data.order.id.startsWith("order_sim_")) {
          const simPaymentId = `pay_sim_${Date.now()}`;
          const simSignature = `sig_sim_${Date.now()}`;

          const verifyRes = await axios.post(
            `${API_URL}/payment/verify`,
            {
              razorpay_order_id: data.order.id,
              razorpay_payment_id: simPaymentId,
              razorpay_signature: simSignature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            dispatch(
              createOrder({
                ...orderData,
                isPaid: true,
                paidAt: new Date().toISOString(),
                paymentInfo: {
                  razorpayOrderId: data.order.id,
                  razorpayPaymentId: simPaymentId,
                  razorpaySignature: simSignature,
                  status: "captured",
                },
              })
            );
          }
          setIsProcessingPayment(false);
          return;
        }

        const options = {
          key: currentKey,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Kisan Setu",
          description: `Payment for fresh produce from ${farmerName || "Farmer"}`,
          order_id: data.order.id,
          handler: async (response) => {
            try {
              const verifyRes = await axios.post(
                `${API_URL}/payment/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (verifyRes.data.success) {
                dispatch(
                  createOrder({
                    ...orderData,
                    isPaid: true,
                    paidAt: new Date().toISOString(),
                    paymentInfo: {
                      razorpayOrderId: response.razorpay_order_id,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpaySignature: response.razorpay_signature,
                      status: "captured",
                    },
                  })
                );
              }
            } catch (err) {
              console.error("Verification error", err);
              alert("Payment verification failed");
            } finally {
              setIsProcessingPayment(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          theme: {
            color: "#4f7942",
          },
          modal: {
            ondismiss: () => {
              setIsProcessingPayment(false);
            },
          },
        };

        const razorpayWindow = new window.Razorpay(options);
        razorpayWindow.open();
      } catch (err) {
        console.error("Payment Error:", err);
        alert("Failed to initiate online payment: " + (err.response?.data?.message || err.message));
        setIsProcessingPayment(false);
      }
    } else {
      dispatch(createOrder(orderData));
    }
  };

  const handleImageError = (e) => { e.target.onerror = null; e.target.src = placeholder; };

  if (loading || isProcessingPayment) return <Loader />;

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4">
        <FaLeaf className="text-yellow-400 text-6xl mb-4 drop-shadow-lg animate-bounce" />
        <h2 className="text-3xl font-extrabold text-green-900 mb-4">Your Cart is Empty</h2>
        <p className="text-green-700 mb-6 text-center">Looks like you haven't added any products yet.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-yellow-400 text-green-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 shadow-lg transition-all"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-green-800 hover:text-green-700 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Continue Shopping
      </button>

      <h1 className="text-4xl font-extrabold text-green-900 mb-12 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Cart Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-green-900">Your Cart</h2>
          <div className="mb-4 text-green-900 font-medium flex items-center mb-6">
            <FaLeaf className="mr-2 text-yellow-400" /> Ordering from: {farmerName}
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-4">
                    <img
                      src={item.image || placeholder}
                      alt={item.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">{item.name}</h3>
                    <p className="text-green-700 font-medium">
                      ₨{Number(item.price).toFixed(2)} {item.unit ? `/ ${item.unit}` : ""}
                    </p>
                    {item.quantityAvailable !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        Stock: <span className="font-semibold text-green-800">{item.quantityAvailable} available</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1 border-2 border-yellow-400 rounded-full px-2 py-1 bg-yellow-50">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className={`w-7 h-7 rounded-full font-bold flex items-center justify-center transition-colors shadow-sm ${
                        item.quantity <= 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-400 text-green-900 hover:bg-yellow-300"
                      }`}
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.quantityAvailable ?? 0}
                      value={item.quantity}
                      onChange={(e) => {
                        let val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) {
                          const maxStock = Number(item.quantityAvailable ?? 0);
                          if (maxStock > 0 && val > maxStock) val = maxStock;
                          handleQuantityChange(item.productId, val);
                        }
                      }}
                      className="w-12 text-center font-bold text-green-900 bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={
                        item.quantityAvailable !== undefined &&
                        item.quantityAvailable !== null &&
                        item.quantity >= item.quantityAvailable
                      }
                      className={`w-7 h-7 rounded-full font-bold flex items-center justify-center transition-colors shadow-sm ${
                        item.quantityAvailable !== undefined &&
                        item.quantityAvailable !== null &&
                        item.quantity >= item.quantityAvailable
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-400 text-green-900 hover:bg-yellow-300"
                      }`}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-900">₨{(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 hover:text-red-700 flex items-center mt-1 text-sm font-medium"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => dispatch(clearCart())}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Clear Cart
            </button>
            <div className="text-2xl font-extrabold text-green-900">Total: ₨{calculateTotal().toFixed(2)}</div>
          </div>
        </div>

        {/* Order Details Section */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-green-900">Order Details</h2>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            {/* Order Type */}
            <div>
              <label className="block font-semibold text-green-800 mb-2">Order Type</label>
              <div className="flex gap-6 text-green-900">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={orderType === "pickup"}
                    onChange={() => setOrderType("pickup")}
                  />
                  Pickup
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={orderType === "delivery"}
                    onChange={() => setOrderType("delivery")}
                  />
                  Delivery
                </label>
              </div>
            </div>

            {/* Pickup/Delivery Details */}
            {orderType === "pickup" ? (
              <div className="space-y-4">
                <input
                  type="date"
                  name="pickupDetails.date"
                  value={orderDetails.pickupDetails.date}
                  onChange={handleInputChange}
                  className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="time"
                  name="pickupDetails.time"
                  value={orderDetails.pickupDetails.time}
                  onChange={handleInputChange}
                  className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="text"
                  name="pickupDetails.location"
                  value={orderDetails.pickupDetails.location}
                  onChange={handleInputChange}
                  placeholder="Pickup location"
                  className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  name="deliveryDetails.address.street"
                  value={orderDetails.deliveryDetails.address.street}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="deliveryDetails.address.city"
                    value={orderDetails.deliveryDetails.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <input
                    type="text"
                    name="deliveryDetails.address.state"
                    value={orderDetails.deliveryDetails.address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="deliveryDetails.address.zipCode"
                  value={orderDetails.deliveryDetails.address.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP Code"
                  className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="date"
                  name="deliveryDetails.date"
                  value={orderDetails.deliveryDetails.date}
                  onChange={handleInputChange}
                  className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="time"
                  name="deliveryDetails.time"
                  value={orderDetails.deliveryDetails.time}
                  onChange={handleInputChange}
                  className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            )}

            {/* Payment Method */}
            <select
              name="paymentMethod"
              value={orderDetails.paymentMethod}
              onChange={handleInputChange}
              className="form-input w-full pl-3 py-2 rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400 font-medium text-green-900"
              required
            >
              <option value="cash">Cash on Pickup/Delivery</option>
              <option value="online">Online Payment (UPI, Cards, NetBanking)</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>

            {/* Notes */}
            <textarea
              name="notes"
              rows="3"
              value={orderDetails.notes}
              onChange={handleInputChange}
              placeholder="Special instructions..."
              className="form-input w-full pl-3 py-2 rounded-xl border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-green-900 font-bold py-3 rounded-full hover:bg-yellow-300 shadow-lg mt-4 transition-all"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
