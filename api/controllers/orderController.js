const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { farmer, items, pickupDetails, deliveryDetails, paymentMethod, isPaid, paidAt, paymentInfo, notes } = req.body;

    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      if (product.quantityAvailable < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough quantity available for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      item.price = product.price;

      // Atomically decrease quantity
      await Product.findByIdAndUpdate(item.product, { $inc: { quantityAvailable: -item.quantity } }, { new: true });
    }

    const order = await Order.create({
      consumer: req.user._id,
      farmer,
      items,
      totalAmount,
      pickupDetails,
      deliveryDetails,
      paymentMethod: paymentMethod || "cash",
      isPaid: isPaid || false,
      paidAt: paidAt || null,
      paymentInfo: paymentInfo || {},
      notes,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Consumer Orders
exports.getConsumerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate("farmer", "name")
      .populate({ path: "items.product", select: "name images" })
      .sort("-createdAt");
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Farmer Orders
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate("consumer", "name")
      .populate({ path: "items.product", select: "name images" })
      .sort("-createdAt");
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Single Order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("consumer", "name email phone")
      .populate("farmer", "name email phone")
      .populate({ path: "items.product", select: "name images" });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("consumer", "name")
      .populate("farmer", "name")
      .sort("-createdAt");
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
