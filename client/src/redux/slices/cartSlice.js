import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Helper to save cart state to localStorage
const saveCartToStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// Get cart from localStorage
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const calculateTotals = (cartItems) => {
  const totalQuantity = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );
  return { totalQuantity, totalPrice };
};

const initialTotals = calculateTotals(cartItemsFromStorage);

const initialState = {
  cartItems: cartItemsFromStorage,
  farmerId: cartItemsFromStorage.length > 0 ? cartItemsFromStorage[0].farmerId : null,
  farmerName: cartItemsFromStorage.length > 0 ? cartItemsFromStorage[0].farmerName : null,
  totalQuantity: initialTotals.totalQuantity,
  totalPrice: initialTotals.totalPrice,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const numQuantity = Number(quantity);

      if (isNaN(numQuantity) || numQuantity <= 0) {
        toast.error("Quantity must be at least 1");
        return;
      }

      const stockAvailable = Number(
        product.quantityAvailable !== undefined && product.quantityAvailable !== null
          ? product.quantityAvailable
          : 0
      );

      const itemFarmerId =
        typeof product.farmer === "object"
          ? product.farmer?._id || product.farmer?.id
          : product.farmer;
      const itemFarmerName =
        typeof product.farmer === "object"
          ? product.farmer?.name || "Farmer"
          : "Farmer";

      if (state.cartItems.length === 0 || String(itemFarmerId) === String(state.farmerId)) {
        const existItem = state.cartItems.find((item) => item.productId === product._id);

        if (existItem) {
          const desiredQuantity = Number(existItem.quantity) + numQuantity;
          if (desiredQuantity > stockAvailable) {
            toast.error(
              `Cannot add more than available stock (${stockAvailable} available). You have ${existItem.quantity} in cart.`
            );
            return;
          }

          state.cartItems = state.cartItems.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: desiredQuantity, quantityAvailable: stockAvailable }
              : item
          );
          toast.info(`Updated ${product.name} quantity in your cart`);
        } else {
          if (numQuantity > stockAvailable) {
            toast.error(
              `Cannot add more than available stock (${stockAvailable} available)`
            );
            return;
          }

          state.cartItems.push({
            productId: product._id,
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            price: Number(product.price),
            quantity: numQuantity,
            quantityAvailable: stockAvailable,
            unit: product.unit || "kg",
            farmerId: itemFarmerId,
            farmerName: itemFarmerName,
          });

          if (state.farmerId === null || state.farmerName === "Farmer") {
            state.farmerId = String(itemFarmerId);
            if (itemFarmerName !== "Farmer") {
              state.farmerName = itemFarmerName;
            }
          }

          toast.success(`Added ${product.name} to your cart`);
        }
      } else {
        toast.error(
          "You can only order from one farm at a time. Please clear your cart first."
        );
        return;
      }

      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;

      saveCartToStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.productId !== productId);

      if (state.cartItems.length === 0) {
        state.farmerId = null;
        state.farmerName = null;
      }

      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;

      saveCartToStorage(state.cartItems);
      toast.info("Item removed from cart");
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      let parsedQuantity = parseInt(quantity, 10);

      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        return;
      }

      const targetItem = state.cartItems.find((i) => i.productId === productId);
      if (targetItem) {
        const maxStock = Number(
          targetItem.quantityAvailable !== undefined && targetItem.quantityAvailable !== null
            ? targetItem.quantityAvailable
            : 0
        );
        if (maxStock <= 0) {
          toast.error("This item is currently out of stock.");
          state.cartItems = state.cartItems.filter((i) => i.productId !== productId);
          if (state.cartItems.length === 0) {
            state.farmerId = null;
            state.farmerName = null;
          }
          const totals = calculateTotals(state.cartItems);
          state.totalQuantity = totals.totalQuantity;
          state.totalPrice = totals.totalPrice;
          saveCartToStorage(state.cartItems);
          return;
        }

        if (parsedQuantity > maxStock) {
          toast.error(`Only ${maxStock} available in stock`);
          parsedQuantity = maxStock;
        }
      }

      state.cartItems = state.cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: parsedQuantity } : item
      );

      const totals = calculateTotals(state.cartItems);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;

      saveCartToStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.farmerId = null;
      state.farmerName = null;
      state.totalQuantity = 0;
      state.totalPrice = 0;

      localStorage.removeItem("cartItems");
      toast.info("Cart cleared");
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
