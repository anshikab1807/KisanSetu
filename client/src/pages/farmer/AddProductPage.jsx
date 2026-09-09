"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  resetProductSuccess,
} from "../../redux/slices/productSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    unit: "lb",
    quantityAvailable: "",
    images: [],
    isOrganic: false,
    harvestDate: "",
    availableUntil: "",
    isActive: true,
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(resetProductSuccess());
      navigate("/farmer/products");
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    setFormData({
      ...formData,
      images: [...formData.images, ...newImagePreviewUrls],
    });
  };

  const removeImage = (index) => {
    const newImagePreviewUrls = [...imagePreviewUrls];
    const newImages = [...formData.images];
    newImagePreviewUrls.splice(index, 1);
    newImages.splice(index, 1);
    setImagePreviewUrls(newImagePreviewUrls);
    setFormData({ ...formData, images: newImages });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.quantityAvailable || formData.quantityAvailable < 0)
      newErrors.quantityAvailable = "Valid quantity is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) dispatch(createProduct(formData));
  };

  if (loading || categoriesLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8 relative overflow-hidden">

      {/* Optional floating icons */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20 pointer-events-none">🍏</div>
      <div className="absolute bottom-10 right-10 text-5xl animate-pulse opacity-20 pointer-events-none">🌾</div>

      <div className="max-w-4xl mx-auto">
        <Link to="/farmer/products" className="flex items-center text-green-600 hover:text-green-800 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>

        <div className="glass bg-white/80 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-green-800">Add New Product</h1>

          <form onSubmit={handleSubmit}>
            {/* Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Product Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input pl-3 ${errors.name ? "border-red-500" : ""}`}
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-input pl-3 ${errors.category ? "border-red-500" : ""}`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-green-700 mb-1">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your product..."
                className={`form-input pl-3 ${errors.description ? "border-red-500" : ""}`}
                required
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Price, Unit, Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Price*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600">₨</div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`form-input pl-7 ${errors.price ? "border-red-500" : ""}`}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Unit*</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`form-input ${errors.unit ? "border-red-500" : ""}`}
                  required
                >
                  <option value="lb">Pound (lb)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="oz">Ounce (oz)</option>
                  <option value="g">Gram (g)</option>
                  <option value="each">Each</option>
                  <option value="bunch">Bunch</option>
                  <option value="dozen">Dozen</option>
                  <option value="pint">Pint</option>
                  <option value="quart">Quart</option>
                  <option value="gallon">Gallon</option>
                </select>
                {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Quantity Available*</label>
                <input
                  type="number"
                  name="quantityAvailable"
                  value={formData.quantityAvailable}
                  onChange={handleChange}
                  className={`form-input ${errors.quantityAvailable ? "border-red-500" : ""}`}
                  min="0"
                  required
                />
                {errors.quantityAvailable && <p className="text-red-500 text-xs mt-1">{errors.quantityAvailable}</p>}
              </div>
            </div>

            {/* Dates & Flags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Harvest Date</label>
                <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className="form-input pl-3"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Available Until</label>
                <input type="date" name="availableUntil" value={formData.availableUntil} onChange={handleChange} className="form-input pl-3"/>
              </div>
              <div className="flex items-center space-x-6 mt-5 md:mt-0">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
                  <span className="text-green-800 text-sm">Organic</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
                  <span className="text-green-800 text-sm">Active</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-green-700 mb-1">Product Images</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-white border border-green-300 rounded-lg px-4 py-2 hover:bg-green-50 flex items-center space-x-2">
                  <FaUpload className="text-green-500"/>
                  <span>Upload Images</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden"/>
                </label>
                <span className="text-sm text-green-700">Upload up to 5 images</span>
              </div>
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img src={url} alt={`Preview ${index+1}`} className="w-full h-32 object-cover rounded-lg"/>
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <Link to="/farmer/products" className="px-6 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition">Cancel</Link>
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
