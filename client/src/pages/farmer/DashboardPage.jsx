"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFarmerProducts } from "../../redux/slices/productSlice";
import { getFarmerOrders } from "../../redux/slices/orderSlice";
import { getConversations } from "../../redux/slices/messageSlice";
import Loader from "../../components/Loader";
import { FaBox, FaShoppingCart, FaComment, FaPlus, FaChartLine } from "react-icons/fa";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { farmerProducts, loading: productsLoading } = useSelector((state) => state.products);
  const { farmerOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { conversations, loading: messagesLoading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFarmerProducts());
    dispatch(getFarmerOrders());
    dispatch(getConversations());
  }, [dispatch]);

  const orderCounts = {
    pending: ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "pending").length,
    accepted: ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "accepted").length,
    completed: ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "completed").length,
    rejected: ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "rejected").length,
    cancelled: ordersLoading ? 0 : farmerOrders.filter((o) => o.status === "cancelled").length,
  };

  const unreadMessages = messagesLoading
    ? 0
    : conversations.reduce((total, convo) => total + convo.unreadCount, 0);

  const totalRevenue = ordersLoading
    ? 0
    : farmerOrders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.totalAmount, 0);

  if (productsLoading || ordersLoading || messagesLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-green-800">Farmer Dashboard</h1>
            <p className="text-green-700">Welcome back, {user?.name}!</p>
          </div>
          <Link
            to="/farmer/products/add"
            className="mt-4 md:mt-0 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 transition"
          >
            <FaPlus />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Products",
              icon: <FaBox className="text-green-600 text-xl" />,
              value: farmerProducts.length,
              link: "/farmer/products",
              linkText: "Manage Products",
            },
            {
              title: "Pending Orders",
              icon: <FaShoppingCart className="text-orange-400 text-xl" />,
              value: orderCounts.pending,
              link: "/farmer/orders",
              linkText: "View All Orders",
            },
            {
              title: "Unread Messages",
              icon: <FaComment className="text-blue-400 text-xl" />,
              value: unreadMessages,
              link: "/messages",
              linkText: "View Messages",
            },
            {
              title: "Total Revenue",
              icon: <FaChartLine className="text-green-600 text-xl" />,
              value: `₨${totalRevenue.toFixed(2)}`,
              linkText: "From completed orders",
            },
          ].map((card, idx) => (
            <div key={idx} className="glass bg-white/80 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-800">{card.title}</h3>
                {card.icon}
              </div>
              <p className="text-3xl font-bold text-green-800">{card.value}</p>
              {card.link && (
                <Link
                  to={card.link}
                  className="text-green-500 hover:text-green-700 text-sm mt-2 inline-block"
                >
                  {card.linkText}
                </Link>
              )}
              {!card.link && <span className="text-green-700 text-sm mt-2 inline-block">{card.linkText}</span>}
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="glass bg-white/80 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-800">Recent Orders</h2>
            <Link to="/farmer/orders" className="text-green-500 hover:text-green-700">
              View All
            </Link>
          </div>
          {farmerOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-center py-3 px-4">Date</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerOrders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b border-green-100">
                      <td className="py-3 px-4">
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-green-500 hover:text-green-700"
                        >
                          #{order._id.substring(0, 8)}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{order.consumer.name}</td>
                      <td className="text-center py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            order.status === "pending"
                              ? "bg-blue-200 text-blue-800"
                              : order.status === "accepted" || order.status === "completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ₨{order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-green-700 text-center py-4">No orders yet.</p>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="glass bg-white/80 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-800">Low Stock Products</h2>
            <Link to="/farmer/products" className="text-green-500 hover:text-green-700">
              Manage Inventory
            </Link>
          </div>
          {farmerProducts.filter((p) => p.quantityAvailable < 10).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-center py-3 px-4">Price</th>
                    <th className="text-center py-3 px-4">Quantity Left</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerProducts
                    .filter((p) => p.quantityAvailable < 10)
                    .slice(0, 5)
                    .map((product) => (
                      <tr key={product._id} className="border-b border-green-100">
                        <td className="py-3 px-4 flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden mr-3 flex items-center justify-center">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaBox className="text-green-500" />
                            )}
                          </div>
                          <span>{product.name}</span>
                        </td>
                        <td className="text-center py-3 px-4">₨{product.price.toFixed(2)}</td>
                        <td className="text-center py-3 px-4 font-medium"
                            style={{
                              color:
                                product.quantityAvailable === 0
                                  ? "#f56565"
                                  : product.quantityAvailable < 5
                                  ? "#ed8936"
                                  : "#ecc94b",
                            }}>
                          {product.quantityAvailable} {product.unit}
                        </td>
                        <td className="text-right py-3 px-4">
                          <Link
                            to={`/farmer/products/edit/${product._id}`}
                            className="text-green-500 hover:text-green-700"
                          >
                            Update Stock
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-green-700 text-center py-4">No low stock products.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
