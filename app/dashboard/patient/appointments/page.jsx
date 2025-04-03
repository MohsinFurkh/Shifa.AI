"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { CalendarDaysIcon, ClockIcon, UserIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const sampleAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Ahmed',
      specialty: 'General Physician',
      date: '2023-07-15',
      time: '10:00 AM',
      status: 'upcoming',
      reason: 'Annual check-up',
    },
    {
      id: 2,
      doctor: 'Dr. Khalid Khan',
      specialty: 'Cardiologist',
      date: '2023-06-30',
      time: '02:30 PM',
      status: 'past',
      reason: 'Heart palpitations',
    },
    {
      id: 3,
      doctor: 'Dr. Ayesha Malik',
      specialty: 'Dermatologist',
      date: '2023-06-22',
      time: '11:15 AM',
      status: 'past',
      reason: 'Skin rash',
    },
  ];

  useEffect(() => {
    // Simulating API fetch
    setAppointments(sampleAppointments);
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Get doctor details
    const selectedDoctor = sampleDoctors.find(doc => doc.id === parseInt(formData.doctorId));

    // Create new appointment
    const newAppointment = {
      id: appointments.length + 1,
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: formData.date,
      time: formData.time,
      status: 'upcoming',
      reason: formData.reason,
    };

    // Simulate API call
    setTimeout(() => {
      setAppointments([...appointments, newAppointment]);
      setShowBookingForm(false);
      setLoading(false);
      setFormData({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
      });
    }, 1000);
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

  const confirmCancelAppointment = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAppointments(appointments.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, status: 'cancelled' } 
          : app
      ));
      setShowCancelModal(false);
      setLoading(false);
    }, 1000);
  };

  const confirmRescheduleAppointment = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAppointments(appointments.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, date: rescheduleData.date, time: rescheduleData.time } 
          : app
      ));
      setShowRescheduleModal(false);
      setLoading(false);
    }, 1000);
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  if (!user) {
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

          {!showBookingForm ? (
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

              {filteredAppointments.length > 0 ? (
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
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={() => handleCancelAppointment(appointment)}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition mr-2 flex items-center"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" /> Cancel
                          </button>
                          <button 
                            onClick={() => handleRescheduleAppointment(appointment)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition flex items-center"
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1" /> Reschedule
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No {activeTab} appointments found.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Book New Appointment</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Doctor
                    </label>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Briefly describe your symptoms or reason for the appointment"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:bg-gray-400"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Appointment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your appointment with {selectedAppointment.doctor} on {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancelAppointment}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reschedule Appointment</h3>
            <p className="text-gray-600 mb-4">
              Reschedule your appointment with {selectedAppointment.doctor}
            </p>
            <form onSubmit={confirmRescheduleAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={rescheduleData.date}
                    onChange={handleRescheduleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Time
                  </label>
                  <select
                    name="time"
                    value={rescheduleData.time}
                    onChange={handleRescheduleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
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
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:bg-gray-400"
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