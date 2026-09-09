"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  clearProductDetails,
} from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import {
  FaLeaf,
  FaShoppingCart,
  FaComment,
  FaArrowLeft,
} from "react-icons/fa";
import { placeholder } from "../assets";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems, farmerId } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getProductDetails(id));
    return () => dispatch(clearProductDetails());
  }, [dispatch, id]);

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    const maxStock = Number(product?.quantityAvailable ?? 0);
    if (val > maxStock) val = maxStock;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate("/login");
    if (user.role === "farmer") return alert("Farmers cannot place orders.");

    const maxStock = Number(product?.quantityAvailable ?? 0);
    if (maxStock <= 0) {
      alert("This product is sold out.");
      return;
    }

    const existItem = cartItems.find((item) => item.productId === product._id);
    const currentInCart = existItem ? Number(existItem.quantity) : 0;

    if (currentInCart + Number(quantity) > maxStock) {
      alert(
        `Cannot add ${quantity} more. You already have ${currentInCart} in your cart, and only ${maxStock} is available in stock.`
      );
      return;
    }

    const pFarmerId = typeof product.farmer === "object" ? product.farmer?._id || product.farmer?.id : product.farmer;

    if (cartItems.length > 0 && farmerId && String(farmerId) !== String(pFarmerId)) {
      if (
        !confirm(
          "Your cart contains items from a different farm. Clear cart and add this item?"
        )
      )
        return;
    }

    dispatch(addToCart({ product, quantity: Number(quantity) }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    if (!message.trim()) return;

    dispatch(
      sendMessage({
        receiver: product.farmer._id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          to="/products"
          className="inline-block text-green-500 hover:text-green-700"
        >
          Back to Products
        </Link>
      </div>
    );

  if (!product) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Link
        to="/products"
        className="flex items-center text-green-500 hover:text-green-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg mb-4 h-80 flex items-center justify-center">
          <img
            src={product.images?.[activeImage] || placeholder}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail Images */}
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`cursor-pointer rounded-lg overflow-hidden h-20 ${
                  activeImage === idx
                    ? "ring-2 ring-green-500"
                    : "ring-1 ring-gray-200"
                }`}
              >
                <img
                  src={img || placeholder}
                  alt={`${product.name}-${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Product Details */}
        <div className="glass p-6 rounded-2xl shadow-lg space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Category: {product.category?.name || "General"}
            </span>
            {product.isOrganic && (
              <span className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded shadow">
                Organic
              </span>
            )}
          </div>

          <div className="text-2xl font-bold text-green-600 mb-4">
            ₨{product.price.toFixed(2)} / {product.unit}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Quantity & Add to Cart */}
          {user?.role !== "farmer" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                min="1"
                max={product.quantityAvailable}
                value={quantity}
                onChange={handleQuantityChange}
                className="form-input pl-3 border border-gray-300 rounded w-full sm:w-1/3"
              />
              <button
                onClick={handleAddToCart}
                disabled={product.quantityAvailable === 0}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all shadow-md ${
                  product.quantityAvailable === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                <FaShoppingCart />
                {product.quantityAvailable === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          )}

          {/* Message Farmer */}
          {isAuthenticated && user?.role !== "farmer" && (
            <div className="mt-4">
              {showMessageForm ? (
                <div className="glass p-4 rounded-xl shadow-md">
                  <textarea
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 mb-2 focus:ring-2 focus:ring-green-500"
                    placeholder="Ask a question about this product..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendMessage}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors shadow"
                    >
                      Send Message
                    </button>
                    <button
                      onClick={() => setShowMessageForm(false)}
                      className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowMessageForm(true)}
                  className="flex items-center gap-2 text-green-500 hover:text-green-700 mt-2 font-medium transition-colors"
                >
                  <FaComment />
                  Message Farmer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
