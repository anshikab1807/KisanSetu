"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getProducts } from "../redux/slices/productSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { FaFilter, FaSearch, FaLeaf } from "react-icons/fa";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { products, loading } = useSelector((state) => state.products);
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.categories
  );

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sort: "newest",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getCategories());

    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam) setFilters((prev) => ({ ...prev, category: categoryParam }));
  }, [dispatch, location.search]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      dispatch(getProducts(params));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [dispatch, filters.category, filters.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const sortedProducts = [...products].sort((a, b) => {
    if (filters.sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (filters.sort === "price-low") return a.price - b.price;
    if (filters.sort === "price-high") return b.price - a.price;
    return 0;
  });

  if (loading || categoryLoading) return <Loader />;

  return (
    <div className="min-h-screen relative py-8 px-4 bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-green-900">

      <h1 className="text-3xl font-bold mb-8 text-center">Browse Products</h1>

      {/* Filters and search */}
      <div className="mb-8 glass p-4 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-green-400" />
            </div>
          </div>

          {/* Sort */}
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* Toggle filters */}
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-green-900 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Category filter */}
        {showFilters && (
          <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50 shadow-inner">
            <label className="block text-sm font-medium text-green-900 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-100"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} greenTheme />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-green-50 rounded-xl shadow-md mx-auto max-w-md glass p-6">
          <FaLeaf className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-green-700">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
