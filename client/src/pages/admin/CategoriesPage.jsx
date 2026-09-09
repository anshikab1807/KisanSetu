/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaPlus, FaEdit, FaTrash, FaLeaf } from "react-icons/fa";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, success } = useSelector(
    (state) => state.categories
  );

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success && showModal) {
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        icon: "",
      });
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddClick = () => {
    setModalMode("add");
    setFormData({
      name: "",
      description: "",
      icon: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (category) => {
    setModalMode("edit");
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      dispatch(createCategory(formData));
    } else {
      dispatch(
        updateCategory({ id: currentCategory._id, categoryData: formData })
      );
    }
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  if (loading && categories.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8 relative overflow-hidden">

      {/* Decorative floating icons */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20 pointer-events-none">🍎</div>
      <div className="absolute top-1/3 right-1/4 text-5xl animate-pulse opacity-10 pointer-events-none">🍃</div>
      <div className="absolute bottom-10 right-10 text-6xl animate-bounce-slow opacity-20 pointer-events-none">🌾</div>

      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-900">Manage Categories</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 bg-yellow-400 text-green-900 font-bold px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories List */}
      {categories.length > 0 ? (
        <div className="bg-white/70 glass rounded-xl overflow-hidden shadow-lg max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-green-800 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-green-800 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-green-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          {category.icon ? (
                            <span className="text-green-600">{category.icon}</span>
                          ) : (
                            <FaLeaf className="text-green-500" />
                          )}
                        </div>
                        <div className="font-medium text-green-900">{category.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-green-700 max-w-md">
                        {category.description || "No description provided"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl max-w-md mx-auto shadow-lg">
          <FaLeaf className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-green-900 mb-2">No Categories Found</h3>
          <p className="text-green-700 mb-6">Add your first category to get started.</p>
          <button
            onClick={handleAddClick}
            className="bg-yellow-400 text-green-900 font-bold px-4 py-2 rounded-lg shadow hover:bg-yellow-500 transition"
          >
            Add Category
          </button>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {modalMode === "add" ? "Add New Category" : "Edit Category"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-green-900 mb-1"
                >
                  Category Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-green-900 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Optional description"
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="icon"
                  className="block text-sm font-medium text-green-900 mb-1"
                >
                  Icon (emoji or symbol)
                </label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Optional icon"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-green-300 rounded-lg text-green-900 hover:bg-green-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : modalMode === "add"
                    ? "Add Category"
                    : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-green-900">
              Are you sure you want to delete the category{" "}
              <span className="font-medium">{categoryToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-green-300 rounded-lg text-green-900 hover:bg-green-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
