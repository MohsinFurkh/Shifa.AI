"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { ClockIcon, PlusIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function MedicationsPage() {
  const { user, getToken } = useAuth();
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    instructions: '',
    prescribedBy: '',
  });

  useEffect(() => {
    async function fetchMedications() {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        const userId = user._id || user.id;
        
        const response = await fetch(`/api/patient/medications?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch medications');
        }
        
        const data = await response.json();
        setMedications(data.medications || []);
      } catch (err) {
        console.error('Error fetching medications:', err);
        setError('Failed to load your medications. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMedications();
  }, [user, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      
      const response = await fetch('/api/patient/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add medication');
      }
      
      // Fetch updated medications list
      const updatedResponse = await fetch(`/api/patient/medications?userId=${user._id || user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setMedications(data.medications || []);
      }
      
      // Reset form and UI state
      setShowAddForm(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
        instructions: '',
        prescribedBy: '',
      });
    } catch (err) {
      console.error('Error adding medication:', err);
      setError(err.message || 'Failed to add medication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // This would be implemented with a DELETE API endpoint
    // For now, we'll just update the UI
    setMedications(medications.filter((med) => med._id !== id));
  };

  const activeMedications = medications.filter((med) => med.active);
  const pastMedications = medications.filter((med) => !med.active);

  // Reminder logic
  const getTodayReminders = () => {
    const today = new Date();
    
    return activeMedications.map(med => {
      const frequencyMap = {
        'Once daily': ['08:00 AM'],
        'Twice daily': ['08:00 AM', '08:00 PM'],
        'Every 8 hours': ['08:00 AM', '04:00 PM', '12:00 AM'],
        'Every 6 hours': ['06:00 AM', '12:00 PM', '06:00 PM', '12:00 AM'],
        'Every 12 hours': ['08:00 AM', '08:00 PM'],
        'Weekly': ['08:00 AM Monday'],
      };
      
      const times = frequencyMap[med.frequency] || ['08:00 AM'];
      
      return {
        name: med.name,
        dosage: med.dosage,
        times: times,
      };
    });
  };

  const todayReminders = getTodayReminders();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        {/* Today's Reminders */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 bg-primary-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary-800">Today's Medication Reminders</h2>
            <ClockIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="p-6">
            {todayReminders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayReminders.map((reminder, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-gray-800">{reminder.name}</h3>
                    <p className="text-gray-600 text-sm">{reminder.dosage}</p>
                    <div className="mt-3 space-y-2">
                      {reminder.times.map((time, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                          <span className="text-sm">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No medication reminders for today.
              </div>
            )}
          </div>
        </div>

        {/* Medications List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-800">My Medications</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition flex items-center"
            >
              {showAddForm ? (
                <>
                  <XMarkIcon className="h-5 w-5 mr-1" /> Cancel
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-1" /> Add Medication
                </>
              )}
            </button>
          </div>

          {showAddForm ? (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Medication</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medication Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleChange}
                      placeholder="e.g., 500mg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 12 hours">Every 12 hours</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prescribed By
                    </label>
                    <input
                      type="text"
                      name="prescribedBy"
                      value={formData.prescribedBy}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for ongoing medications</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Take with food, etc."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:bg-gray-400"
                  >
                    {loading ? 'Adding...' : 'Add Medication'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6">
              {/* Active Medications */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Current Medications</h2>
                {activeMedications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medication
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dosage & Frequency
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Range
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Instructions
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeMedications.map((medication) => (
                          <tr key={medication.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{medication.name}</div>
                              <div className="text-sm text-gray-500">
                                Prescribed by {medication.prescribedBy}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{medication.dosage}</div>
                              <div className="text-sm text-gray-500">{medication.frequency}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Started: {new Date(medication.startDate).toLocaleDateString()}
                              </div>
                              {medication.endDate && (
                                <div className="text-sm text-gray-500">
                                  Ends: {new Date(medication.endDate).toLocaleDateString()}
                                </div>
                              )}
                              {!medication.endDate && (
                                <div className="text-sm text-green-600">Ongoing</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {medication.instructions || 'No special instructions'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => handleDelete(medication.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No active medications found</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                    >
                      Add Medication
                    </button>
                  </div>
                )}
              </div>

              {/* Past Medications */}
              {pastMedications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Past Medications</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medication
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dosage & Frequency
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Range
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Instructions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pastMedications.map((medication) => (
                          <tr key={medication.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{medication.name}</div>
                              <div className="text-sm text-gray-500">
                                Prescribed by {medication.prescribedBy}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{medication.dosage}</div>
                              <div className="text-sm text-gray-500">{medication.frequency}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Started: {new Date(medication.startDate).toLocaleDateString()}
                              </div>
                              {medication.endDate && (
                                <div className="text-sm text-gray-500">
                                  Ended: {new Date(medication.endDate).toLocaleDateString()}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {medication.instructions || 'No special instructions'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 