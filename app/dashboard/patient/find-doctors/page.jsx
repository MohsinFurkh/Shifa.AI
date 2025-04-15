"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { MagnifyingGlassIcon, StarIcon, CalendarDaysIcon, MapPinIcon, AcademicCapIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function FindDoctorsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  // Specialties data
  const specialties = [
    { id: 'all', name: 'All Specialties' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'neurology', name: 'Neurology' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'psychiatry', name: 'Psychiatry' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'gynecology', name: 'Gynecology' },
    { id: 'ophthalmology', name: 'Ophthalmology' },
    { id: 'endocrinology', name: 'Endocrinology' },
  ];

  // Sample doctors data - in a real app, this would come from an API
  const sampleDoctors = [
    {
      id: 'd1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      experience: '15 years',
      education: 'Harvard Medical School',
      location: 'Main Hospital, North Wing',
      rating: 4.8,
      totalReviews: 124,
      consultationFee: 150,
      available: true,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
      about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management.'
    },
    {
      id: 'd2',
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      experience: '12 years',
      education: 'Johns Hopkins University',
      location: 'Neuroscience Center, 3rd Floor',
      rating: 4.7,
      totalReviews: 98,
      consultationFee: 180,
      available: true,
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      availableSlots: ['10:00 AM', '01:00 PM', '03:30 PM'],
      about: 'Dr. Michael Chen is a neurologist specializing in stroke prevention and treatment. His research focuses on innovative approaches to neurological disorders and he has published extensively in the field.'
    },
    {
      id: 'd3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      experience: '8 years',
      education: 'Stanford Medical School',
      location: 'Dermatology Clinic, East Wing',
      rating: 4.9,
      totalReviews: 156,
      consultationFee: 140,
      available: true,
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      availableSlots: ['09:30 AM', '12:00 PM', '02:30 PM', '05:00 PM'],
      about: 'Dr. Emily Rodriguez is a dermatologist with expertise in both medical and cosmetic dermatology. She is particularly interested in skin cancer prevention and treatment of complex skin conditions.'
    },
    {
      id: 'd4',
      name: 'Dr. Robert Williams',
      specialty: 'Orthopedics',
      experience: '20 years',
      education: 'Yale School of Medicine',
      location: 'Orthopedic Center, 2nd Floor',
      rating: 4.6,
      totalReviews: 210,
      consultationFee: 160,
      available: false,
      availableDays: ['Wednesday', 'Friday'],
      availableSlots: ['11:00 AM', '02:00 PM', '04:00 PM'],
      about: 'Dr. Robert Williams is an orthopedic surgeon specializing in sports injuries and joint replacement. With 20 years of experience, he has treated numerous professional athletes and developed innovative surgical techniques.'
    },
    {
      id: 'd5',
      name: 'Dr. Jasmine Patel',
      specialty: 'Psychiatry',
      experience: '10 years',
      education: 'University of California',
      location: 'Mental Health Building, Room 305',
      rating: 4.9,
      totalReviews: 87,
      consultationFee: 170,
      available: true,
      availableDays: ['Monday', 'Wednesday', 'Thursday'],
      availableSlots: ['10:00 AM', '12:30 PM', '03:00 PM', '05:30 PM'],
      about: 'Dr. Jasmine Patel is a psychiatrist who specializes in mood disorders and anxiety. She takes a holistic approach to mental health, incorporating lifestyle modifications alongside traditional treatments.'
    },
    {
      id: 'd6',
      name: 'Dr. James Wilson',
      specialty: 'Pediatrics',
      experience: '14 years',
      education: 'Columbia University',
      location: 'Children\'s Wing, 1st Floor',
      rating: 4.8,
      totalReviews: 176,
      consultationFee: 130,
      available: true,
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
      about: 'Dr. James Wilson is a pediatrician with special interest in childhood development and preventative care. He is known for his gentle approach with children and comprehensive family education.'
    },
  ];

  useEffect(() => {
    // In a real app, fetch doctors from API
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // Simulate API request
        setTimeout(() => {
          setDoctors(sampleDoctors);
          setFilteredDoctors(sampleDoctors);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    // Filter doctors based on search query and filters
    let result = [...doctors];

    // Filter by search query (name or specialty)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        doctor => 
          doctor.name.toLowerCase().includes(query) || 
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.location.toLowerCase().includes(query)
      );
    }

    // Filter by specialty
    if (selectedSpecialty && selectedSpecialty !== 'all') {
      result = result.filter(
        doctor => doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    // Filter by availability
    if (availabilityFilter) {
      result = result.filter(doctor => doctor.available);
    }

    setFilteredDoctors(result);
  }, [searchQuery, selectedSpecialty, availabilityFilter, doctors]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would be an API call
      console.log('Booking appointment with:', bookingDoctor);
      console.log('Booking data:', bookingData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form and close modal
      setBookingData({
        date: '',
        time: '',
        reason: ''
      });
      setBookingDoctor(null);
      
      // You would typically navigate to appointments page or show confirmation
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        // In a real app, you might want to use a half star icon here
        stars.push(<StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />);
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Doctors</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search Box */}
            <div className="col-span-3 md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search by name, specialty or location
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Specialty Filter */}
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <select
                id="specialty"
                name="specialty"
                className="block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Availability Filter */}
            <div className="flex items-end">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  checked={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">Available now</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              {loading ? 'Loading doctors...' : `Found ${filteredDoctors.length} doctors`}
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No doctors found matching your criteria.</p>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <li key={doctor.id} className="p-6">
                  <div className="flex flex-col md:flex-row">
                    {/* Doctor Profile Photo/Avatar */}
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                      <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                        {doctor.name.split(' ')[1][0]}
                      </div>
                    </div>
                    
                    {/* Doctor Information */}
                    <div className="md:ml-6 flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                          <p className="text-primary-600">{doctor.specialty}</p>
                          <div className="mt-1 flex items-center">
                            {renderRating(doctor.rating)}
                            <span className="ml-2 text-sm text-gray-500">({doctor.totalReviews} reviews)</span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
                          <div className="flex items-center text-gray-700">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">{doctor.location}</span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-700">
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">{doctor.experience} experience</span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-700">
                            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">${doctor.consultationFee} per consultation</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Available Status */}
                      <div className="mt-4 flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${doctor.available ? 'text-green-700' : 'text-red-700'}`}>
                          {doctor.available ? 'Available for appointments' : 'Currently unavailable'}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDetails(doctor.id === showDetails ? null : doctor.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                        >
                          {doctor.id === showDetails ? 'Hide Details' : 'View Details'}
                        </button>
                        {doctor.available && (
                          <button
                            type="button"
                            onClick={() => setBookingDoctor(doctor)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-primary active:bg-primary-700 transition ease-in-out duration-150"
                          >
                            <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            Book Appointment
                          </button>
                        )}
                      </div>
                      
                      {/* Doctor Details (conditionally displayed) */}
                      {doctor.id === showDetails && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <h4 className="font-medium text-gray-900 mb-2">About</h4>
                          <p className="text-gray-700 mb-4">{doctor.about}</p>
                          
                          <h4 className="font-medium text-gray-900 mb-2">Available Days</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {doctor.availableDays.map((day) => (
                              <span key={day} className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-md">
                                {day}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-2">Available Time Slots</h4>
                          <div className="flex flex-wrap gap-2">
                            {doctor.availableSlots.map((slot) => (
                              <span key={slot} className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-md">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Book Appointment with {bookingDoctor.name}</h2>
              <button
                type="button"
                onClick={() => setBookingDoctor(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    value={bookingData.time}
                    onChange={handleBookingChange}
                  >
                    <option value="">Select a time</option>
                    {bookingDoctor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="Please describe your symptoms or reason for appointment"
                    value={bookingData.reason}
                    onChange={handleBookingChange}
                  ></textarea>
                </div>
                
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingDoctor(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition"
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 