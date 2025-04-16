"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  AcademicCapIcon,
  StarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function FindDoctorPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // List of medical specialties
  const specialties = [
    'Cardiologist',
    'Dermatologist',
    'Endocrinologist',
    'Gastroenterologist',
    'General Physician',
    'Neurologist',
    'Obstetrician/Gynecologist',
    'Ophthalmologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Psychiatrist',
    'Urologist'
  ];

  // List of locations
  const locations = [
    'Islamabad',
    'Lahore',
    'Karachi',
    'Peshawar',
    'Quetta',
    'Multan',
    'Faisalabad',
    'Rawalpindi'
  ];

  // Sample doctor data
  const sampleDoctors = [
    {
      id: 1,
      name: 'Dr. Fatima Ali',
      image: '/images/doctors/doctor1.jpg',
      specialty: 'Cardiologist',
      location: 'Islamabad',
      hospital: 'ShifaAI Medical Center',
      experience: '12 years',
      rating: 4.8,
      reviews: 124,
      nextAvailable: '2023-07-15',
      availableTimeSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
      about: 'Dr. Fatima Ali is a board-certified cardiologist with extensive experience in diagnosing and treating heart conditions. She specializes in preventive cardiology and heart disease management.',
      education: 'MBBS from King Edward Medical University, Fellowship in Cardiology from Agha Khan University Hospital',
      consultationFee: 3000,
    },
    {
      id: 2,
      name: 'Dr. Ahmed Khan',
      image: '/images/doctors/doctor2.jpg',
      specialty: 'Neurologist',
      location: 'Lahore',
      hospital: 'City Medical Complex',
      experience: '15 years',
      rating: 4.9,
      reviews: 156,
      nextAvailable: '2023-07-17',
      availableTimeSlots: ['10:00 AM', '01:30 PM', '03:00 PM', '05:30 PM'],
      about: 'Dr. Ahmed Khan is a leading neurologist specializing in the diagnosis and treatment of neurological disorders, including headaches, epilepsy, stroke, and multiple sclerosis.',
      education: 'MBBS from Allama Iqbal Medical College, MD in Neurology from Johns Hopkins University',
      consultationFee: 3500,
    },
    {
      id: 3,
      name: 'Dr. Ayesha Malik',
      image: '/images/doctors/doctor3.jpg',
      specialty: 'Dermatologist',
      location: 'Karachi',
      hospital: 'Skin & Wellness Clinic',
      experience: '8 years',
      rating: 4.7,
      reviews: 98,
      nextAvailable: '2023-07-14',
      availableTimeSlots: ['09:30 AM', '12:00 PM', '02:30 PM', '04:00 PM'],
      about: 'Dr. Ayesha Malik is a skilled dermatologist specializing in medical and cosmetic dermatology. She provides comprehensive care for various skin conditions including acne, eczema, and psoriasis.',
      education: 'MBBS from Dow Medical College, Diploma in Dermatology from London School of Hygiene & Tropical Medicine',
      consultationFee: 2500,
    },
    {
      id: 4,
      name: 'Dr. Imran Hussain',
      image: '/images/doctors/doctor4.jpg',
      specialty: 'Orthopedic Surgeon',
      location: 'Islamabad',
      hospital: 'Bone & Joint Institute',
      experience: '20 years',
      rating: 4.9,
      reviews: 210,
      nextAvailable: '2023-07-19',
      availableTimeSlots: ['08:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'],
      about: 'Dr. Imran Hussain is a highly experienced orthopedic surgeon specializing in joint replacement, sports injuries, and spinal disorders. He has performed over 1,000 successful surgeries.',
      education: 'MBBS from Rawalpindi Medical College, MS in Orthopedic Surgery from Mayo Clinic',
      consultationFee: 4000,
    },
    {
      id: 5,
      name: 'Dr. Sana Riaz',
      image: '/images/doctors/doctor5.jpg',
      specialty: 'Pediatrician',
      location: 'Lahore',
      hospital: 'Children\'s Health Center',
      experience: '10 years',
      rating: 4.8,
      reviews: 175,
      nextAvailable: '2023-07-16',
      availableTimeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      about: 'Dr. Sana Riaz is a compassionate pediatrician dedicated to providing quality healthcare for children from infancy through adolescence. She specializes in developmental pediatrics and childhood nutrition.',
      education: 'MBBS from Fatima Jinnah Medical University, Fellowship in Pediatrics from Children\'s Hospital Boston',
      consultationFee: 2000,
    },
    {
      id: 6,
      name: 'Dr. Khalid Omar',
      image: '/images/doctors/doctor6.jpg',
      specialty: 'Gastroenterologist',
      location: 'Karachi',
      hospital: 'Digestive Health Institute',
      experience: '14 years',
      rating: 4.6,
      reviews: 132,
      nextAvailable: '2023-07-18',
      availableTimeSlots: ['10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
      about: 'Dr. Khalid Omar is a gastroenterologist with expertise in diagnosing and treating disorders of the digestive system. He specializes in endoscopic procedures and management of inflammatory bowel diseases.',
      education: 'MBBS from Aga Khan University, Fellowship in Gastroenterology from Cleveland Clinic',
      consultationFee: 3200,
    },
  ];

  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      setDoctors(sampleDoctors);
      setFilteredDoctors(sampleDoctors);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter doctors based on search, specialty, and location
  useEffect(() => {
    let results = doctors;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(doctor => 
        doctor.name.toLowerCase().includes(query) || 
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.hospital.toLowerCase().includes(query)
      );
    }
    
    if (selectedSpecialty) {
      results = results.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    
    if (selectedLocation) {
      results = results.filter(doctor => doctor.location === selectedLocation);
    }
    
    setFilteredDoctors(results);
  }, [searchQuery, selectedSpecialty, selectedLocation, doctors]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Find a Doctor</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
              placeholder="Search by name, specialty, or hospital"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Specialty Filter */}
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          
          {/* Location Filter */}
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Doctor Listing */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-primary-100">
          <h2 className="text-xl font-bold text-primary-800">Available Doctors</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="space-y-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="border rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row">
                    {/* Doctor Image and Basic Info */}
                    <div className="md:w-1/4 flex flex-col items-center md:items-start mb-4 md:mb-0">
                      <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mb-4">
                        {doctor.image ? (
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Doctor';
                            }}
                          />
                        ) : (
                          <UserIcon className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(doctor.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          ({doctor.reviews} reviews)
                        </span>
                      </div>
                      
                      <a 
                        href={`/dashboard/patient/doctor/${doctor.id}`}
                        className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition text-center w-full"
                      >
                        View Profile
                      </a>
                    </div>
                    
                    {/* Doctor Details */}
                    <div className="md:w-2/4 md:pl-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{doctor.name}</h3>
                      <p className="text-gray-600 mb-4">{doctor.specialty}</p>
                      
                      <div className="mb-2 flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-primary-600" />
                        <span className="text-gray-600">{doctor.location} - {doctor.hospital}</span>
                      </div>
                      
                      <div className="mb-2 flex items-center">
                        <AcademicCapIcon className="h-5 w-5 mr-2 text-primary-600" />
                        <span className="text-gray-600">{doctor.experience} experience</span>
                      </div>
                      
                      <div className="mb-4 flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary-600" />
                        <span className="text-gray-600">
                          Next Available: {new Date(doctor.nextAvailable).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 line-clamp-3">{doctor.about}</p>
                    </div>
                    
                    {/* Booking Section */}
                    <div className="md:w-1/4 mt-4 md:mt-0 md:pl-6 border-l">
                      <p className="text-lg font-bold text-gray-800 mb-2">
                        Rs. {doctor.consultationFee}
                        <span className="text-sm font-normal text-gray-500"> per visit</span>
                      </p>
                      
                      <p className="text-sm text-gray-600 mb-3">Available Time Slots:</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {doctor.availableTimeSlots.slice(0, 4).map((slot, index) => (
                          <div 
                            key={index}
                            className="px-2 py-1 text-xs border border-primary-200 rounded text-primary-600 bg-primary-50 text-center"
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                      
                      <a 
                        href={`/dashboard/patient/appointments?doctor=${doctor.id}`}
                        className="block w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition text-center"
                      >
                        Book Appointment
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No doctors found matching your criteria. Please try different filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 