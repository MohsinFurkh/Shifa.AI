"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Link from 'next/link';
import {
  MapPinIcon,
  AcademicCapIcon,
  StarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  BriefcaseIcon,
  AcademicCapIcon as EducationIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Sample doctor data - in a real app, this would come from an API call
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
      certifications: [
        'American Board of Internal Medicine - Cardiovascular Disease',
        'Advanced Cardiac Life Support (ACLS)',
        'Pakistan Cardiac Society - Fellow'
      ],
      languages: ['English', 'Urdu', 'Punjabi'],
      consultationFee: 3000,
      services: [
        'Cardiac Consultation and Evaluation',
        'Electrocardiogram (ECG/EKG) Interpretation',
        'Echocardiography',
        'Stress Testing',
        'Holter Monitoring',
        'Heart Disease Risk Assessment',
        'Preventive Cardiology',
        'Management of Hypertension',
        'Coronary Artery Disease Management',
        'Heart Failure Management'
      ],
      workingHours: {
        'Monday to Friday': '9:00 AM - 5:00 PM',
        'Saturday': '9:00 AM - 1:00 PM',
        'Sunday': 'Closed'
      },
      patientReviews: [
        {
          id: 1,
          name: 'Ahmed Hassan',
          date: '2023-05-18',
          rating: 5,
          comment: 'Dr. Fatima is an excellent cardiologist. She took the time to listen to my concerns and explain everything in detail. Highly recommend her services.'
        },
        {
          id: 2,
          name: 'Saima Khan',
          date: '2023-04-22',
          rating: 4,
          comment: 'Very professional and knowledgeable. The staff was also very helpful. I felt well cared for during my visit.'
        },
        {
          id: 3,
          name: 'Muhammad Ali',
          date: '2023-03-15',
          rating: 5,
          comment: 'Dr. Fatima Ali provided exceptional care for my heart condition. She is compassionate and thorough in her approach.'
        }
      ],
      availableDates: [
        '2023-07-15',
        '2023-07-16',
        '2023-07-17',
        '2023-07-18',
        '2023-07-19',
      ]
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
      certifications: [
        'Board Certified in Neurology',
        'Pakistan Society of Neurology - Senior Member',
        'International Headache Society - Member'
      ],
      languages: ['English', 'Urdu', 'Punjabi', 'Arabic'],
      consultationFee: 3500,
      services: [
        'Neurological Consultation and Evaluation',
        'Headache Diagnosis and Management',
        'Epilepsy Treatment',
        'Multiple Sclerosis Management',
        'Stroke Prevention and Recovery',
        'Movement Disorders Treatment',
        'Neuromuscular Disorders',
        'Sleep Disorders',
        'EEG Interpretation',
        'Botox Treatment for Migraines'
      ],
      workingHours: {
        'Monday to Thursday': '9:00 AM - 6:00 PM',
        'Friday': '2:00 PM - 6:00 PM',
        'Saturday': '10:00 AM - 2:00 PM',
        'Sunday': 'Closed'
      },
      patientReviews: [
        {
          id: 1,
          name: 'Sara Ahmed',
          date: '2023-06-10',
          rating: 5,
          comment: 'Dr. Ahmed Khan is an excellent neurologist. His diagnosis and treatment plan for my migraines has significantly improved my quality of life.'
        },
        {
          id: 2,
          name: 'Imran Sheikh',
          date: '2023-05-05',
          rating: 5,
          comment: 'Very thorough and detailed in his approach. Explains everything clearly and takes time to answer all questions.'
        },
        {
          id: 3,
          name: 'Ayesha Malik',
          date: '2023-04-12',
          rating: 4,
          comment: 'Great doctor with excellent bedside manner. The wait time was a bit long, but the quality of care made up for it.'
        }
      ],
      availableDates: [
        '2023-07-17',
        '2023-07-18',
        '2023-07-19',
        '2023-07-20',
        '2023-07-21',
      ]
    },
    // Add data for rest of the doctors similar to what's in find-doctor/page.jsx
  ];

  useEffect(() => {
    // Simulate API fetch - in a real app, you would fetch the doctor by ID from an API
    setLoading(true);
    setTimeout(() => {
      const doctorData = sampleDoctors.find(d => d.id.toString() === params.id);
      setDoctor(doctorData || null);
      setLoading(false);
      
      // Set first available date as default
      if (doctorData && doctorData.availableDates && doctorData.availableDates.length > 0) {
        setSelectedDate(doctorData.availableDates[0]);
      }
    }, 1000);
  }, [params.id]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-16">
          <p className="text-xl text-gray-700 mb-4">Doctor not found</p>
          <Link 
            href="/dashboard/patient/find-doctor" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> 
            Back to Find a Doctor
          </Link>
        </div>
      </div>
    );
  }

  // Format date to display in a user-friendly way
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/dashboard/patient/find-doctor" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> 
          Back to Find a Doctor
        </Link>
      </div>

      {/* Doctor Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-6 md:mb-0 md:mr-8">
            <div className="w-40 h-40 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
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
                <UserIcon className="h-20 w-20 text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
            <p className="text-xl text-primary-600 mb-4">{doctor.specialty}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-primary-600" />
                <span className="text-gray-600">{doctor.location}</span>
              </div>
              
              <div className="flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-primary-600" />
                <span className="text-gray-600">{doctor.hospital}</span>
              </div>
              
              <div className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-primary-600" />
                <span className="text-gray-600">{doctor.experience} experience</span>
              </div>
              
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-primary-600" />
                <span className="text-gray-600">Rs. {doctor.consultationFee} per visit</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="flex items-center mr-4">
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
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <a 
                href={`/dashboard/patient/appointments?doctor=${doctor.id}`}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition inline-flex items-center"
              >
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                Book Appointment
              </a>
              
              <a 
                href={`/dashboard/patient/chat?doctor=${doctor.id}`}
                className="px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition inline-flex items-center"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Chat Now
              </a>
              
              <a 
                href={`/dashboard/patient/call?doctor=${doctor.id}`}
                className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition inline-flex items-center"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Call Doctor
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Doctor Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About {doctor.name}</h2>
            <p className="text-gray-700 mb-4">{doctor.about}</p>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Education</h3>
              <div className="flex items-start">
                <EducationIcon className="h-5 w-5 text-primary-600 mr-2 mt-1" />
                <p className="text-gray-700">{doctor.education}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Certifications</h3>
              <ul className="space-y-2">
                {doctor.certifications && doctor.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600 mr-2 mt-1" />
                    <span className="text-gray-700">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages && doctor.languages.map((language, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Services</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctor.services && doctor.services.map((service, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Working Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Working Hours</h2>
            <div className="space-y-3">
              {doctor.workingHours && Object.entries(doctor.workingHours).map(([day, hours], index) => (
                <div key={index} className="flex justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">{day}</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Patient Reviews</h2>
              <span className="text-primary-600 font-medium">
                {doctor.rating.toFixed(1)}/5 ({doctor.reviews} reviews)
              </span>
            </div>
            
            <div className="space-y-6">
              {doctor.patientReviews && doctor.patientReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-gray-800 font-medium">{review.name}</h4>
                        <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <a 
                href="#" 
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                View All Reviews
              </a>
            </div>
          </div>
        </div>
        
        {/* Right Column - Booking Widget */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Book an Appointment</h2>
            
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Select Date</label>
              <div className="grid grid-cols-1 gap-2">
                {doctor.availableDates && doctor.availableDates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    className={`flex justify-between items-center px-4 py-3 border rounded-md ${
                      selectedDate === date
                        ? 'bg-primary-50 border-primary-600 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <span>{formatDate(date)}</span>
                    {selectedDate === date && (
                      <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Select Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {doctor.availableTimeSlots && doctor.availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`px-4 py-2 border rounded-md text-center ${
                        selectedTimeSlot === slot
                          ? 'bg-primary-50 border-primary-600 text-primary-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Booking Button */}
            <div className="mt-6">
              <a 
                href={selectedDate && selectedTimeSlot 
                  ? `/dashboard/patient/appointments/book?doctor=${doctor.id}&date=${selectedDate}&time=${encodeURIComponent(selectedTimeSlot)}` 
                  : `/dashboard/patient/appointments?doctor=${doctor.id}`}
                className={`block w-full px-4 py-3 rounded-md text-white text-center ${
                  selectedDate && selectedTimeSlot
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-400 cursor-not-allowed'
                } transition`}
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Book Appointment
              </a>
              <p className="text-center mt-3 text-sm text-gray-500">
                Consultation Fee: Rs. {doctor.consultationFee}
              </p>
            </div>
            
            {/* Additional Contact Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-gray-700 font-medium mb-3">Need help?</h3>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href={`/dashboard/patient/chat?doctor=${doctor.id}`}
                  className="flex items-center justify-center px-4 py-2 border border-primary-600 rounded-md text-primary-600 hover:bg-primary-50"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Chat
                </a>
                <a 
                  href="#"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Call
                </a>
              </div>
            </div>
          </div>
          
          {/* Similar Doctors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Similar Doctors</h2>
            <div className="space-y-4">
              {sampleDoctors
                .filter(d => d.specialty === doctor.specialty && d.id !== doctor.id)
                .slice(0, 3)
                .map((doc) => (
                  <div key={doc.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mr-3">
                      {doc.image ? (
                        <img 
                          src={doc.image} 
                          alt={doc.name} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=Doctor';
                          }}
                        />
                      ) : (
                        <UserIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-medium">{doc.name}</h3>
                      <p className="text-gray-600 text-sm">{doc.specialty}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(doc.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">({doc.reviews})</span>
                      </div>
                      <a 
                        href={`/dashboard/patient/doctor/${doc.id}`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium mt-2 inline-block"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 