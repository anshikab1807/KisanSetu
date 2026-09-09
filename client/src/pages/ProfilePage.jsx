"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";
import { updateFarmerProfile } from "../redux/slices/farmerSlice";
import Loader from "../components/Loader";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLeaf, FaCheck } from "react-icons/fa";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { myFarmerProfile, loading: farmerLoading, success: farmerSuccess } = useSelector(
    (state) => state.farmers
  );

  const [userForm, setUserForm] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "", state: "", zipCode: "" },
  });

  const [farmerForm, setFarmerForm] = useState({
    farmName: "",
    description: "",
    farmingPractices: [],
    establishedYear: "",
    socialMedia: { facebook: "", instagram: "", twitter: "" },
    businessHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
    acceptsPickup: false,
    acceptsDelivery: false,
    deliveryRadius: 0,
  });

  const [farmingPractice, setFarmingPractice] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "farmer" && myFarmerProfile) {
      setFarmerForm({
        farmName: myFarmerProfile.farmName || "",
        description: myFarmerProfile.description || "",
        farmingPractices: myFarmerProfile.farmingPractices || [],
        establishedYear: myFarmerProfile.establishedYear || "",
        socialMedia: myFarmerProfile.socialMedia || { facebook: "", instagram: "", twitter: "" },
        businessHours: myFarmerProfile.businessHours || farmerForm.businessHours,
        acceptsPickup: myFarmerProfile.acceptsPickup || false,
        acceptsDelivery: myFarmerProfile.acceptsDelivery || false,
        deliveryRadius: myFarmerProfile.deliveryRadius || 0,
      });
    }
  }, [user, myFarmerProfile]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserForm({ ...userForm, [parent]: { ...userForm[parent], [child]: value } });
    } else {
      setUserForm({ ...userForm, [name]: value });
    }
  };

  const handleFarmerChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") return setFarmerForm({ ...farmerForm, [name]: checked });
    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      if (grandchild) {
        setFarmerForm({
          ...farmerForm,
          [parent]: { ...farmerForm[parent], [child]: { ...farmerForm[parent][child], [grandchild]: value } },
        });
      } else {
        setFarmerForm({
          ...farmerForm,
          [parent]: { ...farmerForm[parent], [child]: value },
        });
      }
    } else {
      setFarmerForm({ ...farmerForm, [name]: value });
    }
  };

  const handleAddFarmingPractice = () => {
    if (farmingPractice.trim() !== "") {
      setFarmerForm({ ...farmerForm, farmingPractices: [...farmerForm.farmingPractices, farmingPractice.trim()] });
      setFarmingPractice("");
    }
  };

  const handleRemoveFarmingPractice = (index) => {
    setFarmerForm({ ...farmerForm, farmingPractices: farmerForm.farmingPractices.filter((_, i) => i !== index) });
  };

  const handleUserSubmit = (e) => { e.preventDefault(); dispatch(updateProfile(userForm)); };
  const handleFarmerSubmit = (e) => { e.preventDefault(); dispatch(updateFarmerProfile(farmerForm)); };

  if (loading || farmerLoading) return <Loader />;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-green-900 via-green-700 to-green-800 text-white py-8 px-4">

      {/* Floating leaves for decoration */}
      <div className="absolute top-16 left-10 text-4xl opacity-20 animate-bounce pointer-events-none">🍃</div>
      <div className="absolute bottom-20 right-10 text-5xl opacity-20 animate-bounce-slow pointer-events-none">🌾</div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-yellow-400 text-center drop-shadow-lg">
        My Profile
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-yellow-400 mb-8 justify-center">
        <button
          className={`py-2 px-6 font-medium ${activeTab === "general" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-white hover:text-yellow-300"}`}
          onClick={() => setActiveTab("general")}
        >
          General Info
        </button>
        {user?.role === "farmer" && (
          <button
            className={`py-2 px-6 font-medium ${activeTab === "farm" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-white hover:text-yellow-300"}`}
            onClick={() => setActiveTab("farm")}
          >
            Farm Profile
          </button>
        )}
      </div>

      {/* General Info Form */}
      {activeTab === "general" && (
        <div className="glass p-6 rounded-2xl shadow-lg mb-8 max-w-4xl mx-auto">
          <form onSubmit={handleUserSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{ label: "Full Name", name: "name", icon: FaUser, type: "text" },
                { label: "Phone Number", name: "phone", icon: FaPhone, type: "tel" }].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-yellow-400 mb-1">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon className="text-yellow-400" />
                    </div>
                    <input
                      type={field.type}
                      name={field.name}
                      value={userForm[field.name]}
                      onChange={handleUserChange}
                      className="w-full px-10 py-2 rounded-lg bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                      required
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-yellow-400" />
                  </div>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full px-10 py-2 rounded-lg bg-green-700 text-white"
                    disabled
                  />
                </div>
                <p className="text-xs text-yellow-300 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Account Type</label>
                <input
                  type="text"
                  value={user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                  className="w-full px-3 py-2 rounded-lg bg-green-700 text-white"
                  disabled
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-6 grid grid-cols-1 gap-4">
              {["street","city","state","zipCode"].map((key) => (
                <div key={key} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-yellow-400" />
                  </div>
                  <input
                    type="text"
                    name={`address.${key}`}
                    value={userForm.address[key]}
                    onChange={handleUserChange}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="w-full px-10 py-2 rounded-lg bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="px-6 py-2 bg-yellow-400 text-green-900 font-bold rounded-lg hover:bg-yellow-500 transition shadow">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Farm Profile */}
      {activeTab === "farm" && user?.role === "farmer" && (
        <div className="glass p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <form onSubmit={handleFarmerSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Farm Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLeaf className="text-yellow-400" />
                  </div>
                  <input
                    type="text"
                    name="farmName"
                    value={farmerForm.farmName}
                    onChange={handleFarmerChange}
                    className="w-full px-10 py-2 rounded-lg bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">Established Year</label>
                <input
                  type="number"
                  name="establishedYear"
                  value={farmerForm.establishedYear}
                  onChange={handleFarmerChange}
                  className="w-full px-3 py-2 rounded-lg bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-yellow-400 mb-1">Farm Description</label>
              <textarea
                name="description"
                value={farmerForm.description}
                onChange={handleFarmerChange}
                rows="4"
                className="w-full px-3 py-2 rounded-lg bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                placeholder="Tell customers about your farm..."
                required
              />
            </div>

            {/* Farming Practices */}
            <div className="mb-6 p-4 rounded-2xl bg-green-700 shadow-inner">
              <label className="block text-sm font-medium text-yellow-400 mb-2">Farming Practices</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={farmingPractice}
                  onChange={(e) => setFarmingPractice(e.target.value)}
                  className="flex-grow px-3 py-2 rounded-lg bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                  placeholder="e.g., Organic, No-till, Permaculture"
                />
                <button type="button" onClick={handleAddFarmingPractice} className="px-4 py-2 bg-yellow-400 text-green-900 rounded-lg hover:bg-yellow-500 transition">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {farmerForm.farmingPractices.map((practice, idx) => (
                  <div key={idx} className="bg-yellow-400 text-green-900 px-3 py-1 rounded-full flex items-center shadow hover:shadow-md transition">
                    <span>{practice}</span>
                    <button type="button" onClick={() => handleRemoveFarmingPractice(idx)} className="ml-2 font-bold hover:text-green-700">&times;</button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="px-6 py-2 bg-yellow-400 text-green-900 font-bold rounded-lg hover:bg-yellow-500 transition shadow">
              Save Farm Profile
            </button>

            {farmerSuccess && (
              <div className="mt-4 flex items-center text-yellow-400 font-semibold">
                <FaCheck className="mr-2" /> Farm profile updated successfully!
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
