"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { CalendarDaysIcon, ClockIcon, UserIcon, XMarkIcon, ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function PatientAppointmentsPage() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
  });

  // Sample data for demo purposes
  const sampleDoctors = [
    { id: 1, name: 'Dr. Sarah Ahmed', specialty: 'General Physician' },
    { id: 2, name: 'Dr. Khalid Khan', specialty: 'Cardiologist' },
    { id: 3, name: 'Dr. Ayesha Malik', specialty: 'Dermatologist' },
    { id: 4, name: 'Dr. Imran Ali', specialty: 'Pediatrician' },
    { id: 5, name: 'Dr. Fatima Zaidi', specialty: 'Neurologist' },
  ];

  useEffect(() => {
    // Load appointments from API
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        if (auth && auth.user) {
          // Get the MongoDB ID (could be in _id or id field)
          const userId = auth.user._id || auth.user.id;
          
          // Fetch appointments from the server
          const response = await fetch(`/api/patient/appointments?userId=${userId}`);
          
          if (response.ok) {
            const { data } = await response.json();
            setAppointments(data || []);
          } else {
            // Fallback to localStorage if API call fails
            let userData = auth.user;
            const storedUserData = localStorage.getItem('shifaai_user');
            
            if (storedUserData) {
              try {
                const parsedData = JSON.parse(storedUserData);
                if (parsedData.email === auth.user.email && parsedData.id === auth.user.id) {
                  userData = parsedData;
                }
              } catch (e) {
                console.error("Error parsing stored user data", e);
              }
            }
            
            setAppointments(userData.appointments || []);
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Fallback to localStorage
        if (auth && auth.user) {
          const storedUserData = localStorage.getItem('shifaai_user');
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              setAppointments(userData.appointments || []);
            } catch (e) {
              console.error("Error parsing stored user data", e);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRescheduleChange = (e) => {
    const { name, value } = e.target;
    setRescheduleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get doctor details
      const selectedDoctor = sampleDoctors.find(doc => doc.id === parseInt(formData.doctorId));

      // Get the MongoDB ID (could be in _id or id field)
      const userId = auth.user._id || auth.user.id;

      // Create new appointment data
      const appointmentData = {
        patientId: userId,
        patientName: auth.user.name,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        date: formData.date,
        time: formData.time,
        status: 'upcoming',
        reason: formData.reason,
        createdAt: new Date().toISOString()
      };

      // Save appointment to server
      const response = await fetch('/api/patient/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const { data: newAppointment } = await response.json();

      // Update local state
      setAppointments(prev => [...prev, newAppointment]);
      
      // Also update in user profile for backward compatibility
      const updatedAppointments = [...appointments, newAppointment];
      auth.updateProfile({ appointments: updatedAppointments });

      // Reset form
      setShowBookingForm(false);
      setFormData({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      // Handle error (show message to user)
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: appointment.date,
      time: appointment.time,
    });
    setShowRescheduleModal(true);
  };

  const confirmCancelAppointment = async () => {
    setLoading(true);
    
    try {
      // Update appointment status via API
      const response = await fetch('/api/patient/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      const { data: updatedAppointment } = await response.json();
      
      // Update local state
      const updatedAppointments = appointments.map(app => 
        app.id === selectedAppointment.id ? updatedAppointment : app
      );
      
      setAppointments(updatedAppointments);
      
      // Also update in user profile for backward compatibility
      auth.updateProfile({ appointments: updatedAppointments });
      
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Handle error (show message to user)
    } finally {
      setLoading(false);
    }
  };

  const confirmRescheduleAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update appointment with new date and time via API
      const response = await fetch('/api/patient/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          date: rescheduleData.date,
          time: rescheduleData.time,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule appointment');
      }

      const { data: updatedAppointment } = await response.json();
      
      // Update local state
      const updatedAppointments = appointments.map(app => 
        app.id === selectedAppointment.id ? updatedAppointment : app
      );
      
      setAppointments(updatedAppointments);
      
      // Also update in user profile for backward compatibility
      auth.updateProfile({ appointments: updatedAppointments });
      
      setShowRescheduleModal(false);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      // Handle error (show message to user)
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  if (!auth || !auth.user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-800">My Appointments</h1>
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              {showBookingForm ? 'Cancel Booking' : 'Book Appointment'}
            </button>
          </div>

          {showBookingForm ? (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Book a New Appointment</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a doctor</option>
                      {sampleDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Please describe your symptoms or reason for the appointment"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 ${
                    activeTab === 'upcoming'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-4 py-2 ${
                    activeTab === 'past'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500'
                  }`}
                >
                  Past
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`px-4 py-2 ${
                    activeTab === 'cancelled'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500'
                  }`}
                >
                  Cancelled
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600"></div>
                  <p className="mt-2 text-gray-500">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-medium text-gray-800">{appointment.doctor}</h3>
                          <p className="text-gray-600">{appointment.specialty}</p>
                          <p className="text-gray-600 mt-2">{appointment.reason}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-gray-600">
                            <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-600" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <ClockIcon className="h-5 w-5 mr-2 text-primary-600" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      {activeTab === 'upcoming' && (
                        <div className="mt-4 flex justify-end space-x-2">
                          <button 
                            onClick={() => handleCancelAppointment(appointment)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleRescheduleAppointment(appointment)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary active:bg-primary-700 transition ease-in-out duration-150"
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Reschedule
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
                  <p className="mt-1 text-gray-500">
                    {activeTab === 'upcoming' 
                      ? "You don't have any upcoming appointments scheduled." 
                      : activeTab === 'past' 
                        ? "You don't have any past appointments." 
                        : "You don't have any cancelled appointments."}
                  </p>
                  {activeTab === 'upcoming' && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowBookingForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <CalendarDaysIcon className="h-5 w-5 mr-2" />
                        Book New Appointment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Appointment</h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to cancel your appointment with {selectedAppointment.doctor} on{' '}
              {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reschedule Appointment</h3>
            <p className="text-gray-500 mb-4">
              Please select a new date and time for your appointment with {selectedAppointment.doctor}.
            </p>
            <form onSubmit={confirmRescheduleAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                  <input
                    type="date"
                    name="date"
                    value={rescheduleData.date}
                    onChange={handleRescheduleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                  <select
                    name="time"
                    value={rescheduleData.time}
                    onChange={handleRescheduleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  disabled={loading}
                >
                  {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 