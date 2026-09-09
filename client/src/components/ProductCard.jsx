import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { FaShoppingCart, FaLeaf } from "react-icons/fa";
import { placeholder } from "../assets";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems, farmerId } = useSelector((state) => state.cart);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    if (user?.role === "farmer") return alert("Farmers cannot place orders.");

    const stock = Number(product.quantityAvailable ?? 0);
    if (stock <= 0) {
      toast.error("This product is sold out.");
      return;
    }

    const existItem = cartItems.find((item) => item.productId === product._id);
    if (existItem && existItem.quantity >= stock) {
      toast.error(`Cannot add more than available stock (${stock} available).`);
      return;
    }

    const pFarmerId =
      typeof product.farmer === "object"
        ? product.farmer?._id || product.farmer?.id
        : product.farmer;

    if (cartItems.length > 0 && farmerId && String(farmerId) !== String(pFarmerId)) {
      if (
        !confirm(
          "Your cart contains items from a different farm. Clear cart and add this item?"
        )
      )
        return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
  };

  const farmerName =
    typeof product.farmer === "object" ? product.farmer?.name : null;

  return (
    <div className="card transition-all duration-300 hover:shadow-xl flex flex-col justify-between bg-white rounded-2xl overflow-hidden border border-green-100">
      <div>
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <img
              src={placeholder}
              alt="placeholder"
              className="w-full h-full object-cover"
            />
          )}
          {product.isOrganic && (
            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Organic
            </span>
          )}
        </div>
        <div className="p-5 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-green-900 truncate">{product.name}</h3>
          </div>
          <p className="text-xs text-green-700 font-medium">
            {product.category?.name || "General"}
          </p>

          {farmerName && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaLeaf className="text-yellow-500 text-xs" />
              <span>Farm: <strong className="text-green-800">{farmerName}</strong></span>
            </p>
          )}

          <div className="pt-2 flex justify-between items-center">
            <span className="text-green-800 font-extrabold text-lg">
              ₨{Number(product.price).toFixed(2)} <span className="text-xs font-normal text-gray-500">/ {product.unit}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 flex gap-2">
        <Link
          to={`/products/${product._id}`}
          className="flex-1 text-center py-2 px-3 border border-green-600 text-green-700 hover:bg-green-50 rounded-xl text-sm font-semibold transition-colors"
        >
          Details
        </Link>
        {user?.role !== "farmer" && (
          <button
            onClick={handleQuickAdd}
            disabled={product.quantityAvailable === 0}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
              product.quantityAvailable === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 text-green-900 hover:bg-yellow-300"
            }`}
          >
            <FaShoppingCart className="text-xs" />
            {product.quantityAvailable === 0 ? "Sold Out" : "+ Add"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
