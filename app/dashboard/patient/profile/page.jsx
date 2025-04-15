"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { FaUserEdit, FaIdCard, FaPhone, FaEnvelope, FaBirthdayCake, FaTransgender, FaMapMarkerAlt, FaWeight, FaRulerVertical } from "react-icons/fa";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    height: "",
    weight: "",
    bloodGroup: "",
    allergies: []
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // First try to get the latest user data from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          // Initialize form with stored user data
          setFormData({
            name: parsedUser.name || "",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            gender: parsedUser.gender || "",
            dateOfBirth: parsedUser.dateOfBirth || "",
            address: parsedUser.address || "",
            height: parsedUser.height || "",
            weight: parsedUser.weight || "",
            bloodGroup: parsedUser.bloodGroup || "",
            allergies: parsedUser.allergies || []
          });
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
    }

    // Fallback to context user if localStorage fails
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || "",
        height: user.height || "",
        weight: user.weight || "",
        bloodGroup: user.bloodGroup || "",
        allergies: user.allergies || []
      });
    }
    setLoading(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergiesChange = (e) => {
    const allergiesText = e.target.value;
    const allergiesArray = allergiesText.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({ ...prev, allergies: allergiesArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update profile with form data
      await updateProfile({
        ...formData,
        // Ensure we keep any health metrics that might be stored
        bloodPressure: user?.bloodPressure,
        heartRate: user?.heartRate,
        glucoseLevel: user?.glucoseLevel,
        lastMetricsUpdate: user?.lastMetricsUpdate
      });
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <FaUserEdit /> {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (comma separated)</label>
              <textarea
                name="allergies"
                value={formData.allergies.join(', ')}
                onChange={handleAllergiesChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem icon={<FaIdCard className="text-blue-500" />} label="Full Name" value={formData.name} />
            <ProfileItem icon={<FaEnvelope className="text-blue-500" />} label="Email" value={formData.email} />
            <ProfileItem icon={<FaPhone className="text-blue-500" />} label="Phone" value={formData.phone} />
            <ProfileItem icon={<FaTransgender className="text-blue-500" />} label="Gender" value={formData.gender} />
            <ProfileItem icon={<FaBirthdayCake className="text-blue-500" />} label="Date of Birth" value={formData.dateOfBirth} />
            <ProfileItem icon={<FaMapMarkerAlt className="text-blue-500" />} label="Address" value={formData.address} />
            <ProfileItem icon={<FaRulerVertical className="text-blue-500" />} label="Height" value={formData.height ? `${formData.height} cm` : ""} />
            <ProfileItem icon={<FaWeight className="text-blue-500" />} label="Weight" value={formData.weight ? `${formData.weight} kg` : ""} />
            <ProfileItem label="Blood Group" value={formData.bloodGroup} />
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700">Allergies</h3>
              {formData.allergies.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-1">No allergies recorded</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium text-gray-700">{label}</h3>
      </div>
      {value ? (
        <p className="mt-1 text-gray-900">{value}</p>
      ) : (
        <p className="mt-1 text-gray-500">Not provided</p>
      )}
    </div>
  );
} 