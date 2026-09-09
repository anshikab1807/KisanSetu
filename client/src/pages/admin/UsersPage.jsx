"use client"

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers, deleteUser } from "../../redux/slices/userSlice"
import Loader from "../../components/Loader"
import { FaSearch, FaUserEdit, FaTrash, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"

const UsersPage = () => {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.users)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(null)

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  useEffect(() => {
    if (users) {
      let filtered = [...users]
      if (roleFilter !== "all") filtered = filtered.filter((user) => user.role === roleFilter)
      if (searchTerm) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      setFilteredUsers(filtered)
    }
  }, [users, searchTerm, roleFilter])

  const handleSearchChange = (e) => setSearchTerm(e.target.value)
  const handleRoleFilterChange = (e) => setRoleFilter(e.target.value)
  const handleDeleteClick = (user) => { setUserToDelete(user); setShowDeleteModal(true) }
  const confirmDelete = () => { if (userToDelete) { dispatch(deleteUser(userToDelete._id)); setShowDeleteModal(false); setUserToDelete(null) } }
  const toggleUserDetails = (userId) => setShowUserDetails(showUserDetails === userId ? null : userId)

  if (loading && users.length === 0) return <Loader />

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-4 py-8 relative overflow-hidden">

      {/* Floating icons */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20 pointer-events-none">🍎</div>
      <div className="absolute top-1/3 right-1/4 text-5xl animate-pulse opacity-10 pointer-events-none">🍃</div>
      <div className="absolute bottom-10 right-10 text-6xl animate-bounce-slow opacity-20 pointer-events-none">🌾</div>

      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-800 mb-2 drop-shadow-lg">Manage Users</h1>
        <p className="text-green-700 text-lg">View, filter, and manage all users in the system</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-5xl mx-auto">
        <div className="md:w-1/2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search users by name or email..."
            className="w-full px-4 py-2 pl-10 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-green-400" />
          </div>
        </div>

        <div className="md:w-1/4">
          <select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="consumer">Consumers</option>
            <option value="farmer">Farmers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white/80 glass rounded-xl overflow-hidden shadow-lg max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-green-800 uppercase tracking-wider">User</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-green-800 uppercase tracking-wider">Role</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-green-800 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-200">
                {filteredUsers.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr className="hover:bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <span className="text-green-600 font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-green-900">{user.name}</div>
                            <div className="text-green-700 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "farmer"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleUserDetails(user._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaUserEdit />
                          </button>
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {showUserDetails === user._id && (
                      <tr className="bg-green-50">
                        <td colSpan="4" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2 text-green-800">Contact Information</h4>
                              <div className="space-y-2 text-green-700">
                                <div className="flex items-center"><FaEnvelope className="text-green-400 mr-2" />{user.email}</div>
                                {user.phone && <div className="flex items-center"><FaPhone className="text-green-400 mr-2" />{user.phone}</div>}
                              </div>
                            </div>
                            {user.address && (
                              <div>
                                <h4 className="font-medium mb-2 text-green-800">Address</h4>
                                <div className="flex items-start text-green-700">
                                  <FaMapMarkerAlt className="text-green-400 mr-2 mt-1" />
                                  <div>
                                    {user.address.street && <p>{user.address.street}</p>}
                                    {user.address.city && user.address.state && <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/80 rounded-xl shadow-lg glass max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-green-800 mb-2">No Users Found</h3>
          <p className="text-green-700">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-800">Confirm Delete</h3>
            <p className="mb-6 text-green-700">
              Are you sure you want to delete <span className="font-medium">{userToDelete?.name}</span> ({userToDelete?.email})? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-green-200 rounded-lg text-green-800 hover:bg-green-50 transition">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
