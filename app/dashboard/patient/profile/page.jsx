"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { UserIcon, HeartIcon, BeakerIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

export default function PatientProfilePage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    // New health metrics fields
    height: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    glucoseLevel: '',
  });

  useEffect(() => {
    if (user) {
      // Try to get the most up-to-date data from localStorage
      let userData = user;
      const storedUserData = localStorage.getItem('shifaai_user');
      
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          // Use localStorage data if it's for the current user
          if (parsedData.email === user.email && parsedData.id === user.id) {
            userData = parsedData;
          }
        } catch (e) {
          console.error("Error parsing stored user data", e);
        }
      }
      
      // Set initial form data from user data
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        bloodType: userData.bloodType || '',
        allergies: userData.allergies || '',
        medicalConditions: userData.medicalConditions || '',
        medications: userData.medications || '',
        height: userData.height || '',
        weight: userData.weight || '',
        bloodPressure: userData.bloodPressure || '',
        heartRate: userData.heartRate || '',
        glucoseLevel: userData.glucoseLevel || '',
      });
      
      // Fetch the latest health metrics from the API
      const fetchHealthMetrics = async () => {
        try {
          const response = await fetch(`/api/patient/get-health-metrics?userId=${userData.id}`);
          
          if (response.ok) {
            const { data } = await response.json();
            
            if (data && data.current) {
              // Update form data with the latest metrics
              setFormData(prev => ({
                ...prev,
                height: data.current.height || prev.height,
                weight: data.current.weight || prev.weight,
                bloodPressure: data.current.bloodPressure || prev.bloodPressure,
                heartRate: data.current.heartRate || prev.heartRate,
                glucoseLevel: data.current.glucoseLevel || prev.glucoseLevel,
                lastMetricsUpdate: data.current.timestamp
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching health metrics:', error);
        }
      };
      
      fetchHealthMetrics();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First, update the user profile in localStorage
      const profileUpdated = updateProfile({
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodType: formData.bloodType,
        allergies: formData.allergies,
        medicalConditions: formData.medicalConditions,
        medications: formData.medications,
        // Include basic health metrics in the user profile
        height: formData.height,
        weight: formData.weight,
        bloodPressure: formData.bloodPressure,
        heartRate: formData.heartRate,
        glucoseLevel: formData.glucoseLevel,
        lastMetricsUpdate: new Date().toISOString()
      });
      
      if (profileUpdated && user) {
        // Extract health metrics for the dedicated health metrics API
        const healthMetrics = {
          height: formData.height,
          weight: formData.weight,
          bloodPressure: formData.bloodPressure,
          heartRate: formData.heartRate,
          glucoseLevel: formData.glucoseLevel,
          bmi: calculateBMI(),
          bmiStatus: bmi ? getBMIStatus(Number(bmi)) : null
        };
        
        // Save health metrics to the dedicated API endpoint
        const response = await fetch('/api/patient/update-health-metrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            metrics: healthMetrics
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update health metrics');
        }
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile and metrics:', error);
      // You could add error handling UI here
    } finally {
      setLoading(false);
    }
  };

  // Calculate BMI if height and weight are provided
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = Number(formData.height) / 100;
      const weightInKg = Number(formData.weight);
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  // Get BMI status
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Calculate BMI and status
  const bmi = calculateBMI();
  const bmiStatus = bmi ? getBMIStatus(Number(bmi)) : null;

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-800">Patient Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-8 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <UserIcon className="h-16 w-16" />
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Blood Type</option>
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
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    <div className="flex items-center">
                      <HeartIcon className="h-5 w-5 text-primary-600 mr-2" />
                      Health Metrics
                    </div>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Enter your height in centimeters"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Enter your weight in kilograms"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {formData.height && formData.weight && (
                      <div className="md:col-span-2">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500">
                            BMI: <span className="font-medium">{bmi}</span> - {bmiStatus}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (systolic/diastolic)</label>
                      <input
                        type="text"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        placeholder="e.g., 120/80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        name="heartRate"
                        value={formData.heartRate}
                        onChange={handleChange}
                        placeholder="Beats per minute"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Glucose Level (mg/dL)</label>
                      <input
                        type="number"
                        name="glucoseLevel"
                        value={formData.glucoseLevel}
                        onChange={handleChange}
                        placeholder="Blood glucose level"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Medical History</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="List any allergies you have"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                      <textarea
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="List any medical conditions you have"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                      <textarea
                        name="medications"
                        value={formData.medications}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="List any medications you are currently taking"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:opacity-75"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-8 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <UserIcon className="h-16 w-16" />
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-sm text-gray-900">{formData.name || 'Not provided'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-sm text-gray-900">{formData.email}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1 text-sm text-gray-900">{formData.phone || 'Not provided'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                      <p className="mt-1 text-sm text-gray-900">{formData.dateOfBirth || 'Not provided'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formData.gender 
                          ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) 
                          : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Blood Type</h3>
                      <p className="mt-1 text-sm text-gray-900">{formData.bloodType || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    <div className="flex items-center">
                      <HeartIcon className="h-5 w-5 text-primary-600 mr-2" />
                      Health Metrics
                    </div>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Height</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formData.height ? `${formData.height} cm` : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formData.weight ? `${formData.weight} kg` : 'Not provided'}
                      </p>
                    </div>

                    {bmi && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">BMI</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {bmi} - {bmiStatus}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Blood Pressure</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formData.bloodPressure || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Heart Rate</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formData.heartRate ? `${formData.heartRate} bpm` : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Glucose Level</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formData.glucoseLevel ? `${formData.glucoseLevel} mg/dL` : 'Not provided'}
                      </p>
                    </div>

                    {user.lastMetricsUpdate && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">
                          Last updated: {new Date(user.lastMetricsUpdate).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Medical History</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {formData.allergies || 'None reported'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Medical Conditions</h3>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {formData.medicalConditions || 'None reported'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Current Medications</h3>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {formData.medications || 'None reported'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 