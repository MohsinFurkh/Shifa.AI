"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function ConsultationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [filter, setFilter] = useState('all'); // all, recent, past
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for demo purposes
  const sampleConsultations = [
    {
      id: 1,
      doctor: 'Dr. Sarah Ahmed',
      specialty: 'General Physician',
      date: '2023-07-15',
      time: '10:00 AM',
      type: 'In-person',
      status: 'completed',
      diagnosis: 'Upper respiratory infection',
      prescription: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' },
        { name: 'Acetaminophen', dosage: '500mg', frequency: 'As needed for fever', duration: '5 days' }
      ],
      notes: 'Patient presented with symptoms of cough, sore throat, and mild fever for the past 3 days. No significant medical history. Recommended rest, increased fluid intake, and prescribed antibiotics.',
      followUp: '2023-07-22',
      attachments: [
        { name: 'Lab Results', type: 'pdf', url: '#' },
        { name: 'Prescription', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 2,
      doctor: 'Dr. Khalid Khan',
      specialty: 'Cardiologist',
      date: '2023-06-30',
      time: '02:30 PM',
      type: 'Telemedicine',
      status: 'completed',
      diagnosis: 'Hypertension',
      prescription: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }
      ],
      notes: 'Follow-up consultation for hypertension management. Blood pressure readings have improved with current medication. Recommended lifestyle changes including reduced salt intake and regular exercise.',
      followUp: '2023-07-28',
      attachments: [
        { name: 'Blood Pressure Log', type: 'pdf', url: '#' },
        { name: 'ECG Report', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 3,
      doctor: 'Dr. Ayesha Malik',
      specialty: 'Dermatologist',
      date: '2023-06-22',
      time: '11:15 AM',
      type: 'In-person',
      status: 'completed',
      diagnosis: 'Eczema',
      prescription: [
        { name: 'Hydrocortisone', dosage: '1%', frequency: 'Twice daily', duration: '14 days' },
        { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '14 days' }
      ],
      notes: 'Patient presented with itchy, red patches on arms and legs. Diagnosed with mild eczema. Recommended moisturizing routine and prescribed topical steroid and antihistamine.',
      followUp: '2023-07-06',
      attachments: [
        { name: 'Skin Assessment', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 4,
      doctor: 'Dr. Imran Ali',
      specialty: 'Pediatrician',
      date: '2023-05-15',
      time: '09:00 AM',
      type: 'In-person',
      status: 'completed',
      diagnosis: 'Viral fever',
      prescription: [
        { name: 'Acetaminophen', dosage: '15mg/kg', frequency: 'Every 6 hours', duration: '5 days' },
        { name: 'Ibuprofen', dosage: '10mg/kg', frequency: 'Every 8 hours', duration: '5 days' }
      ],
      notes: 'Child presented with high fever (39.2°C) and mild cough. No other significant symptoms. Recommended supportive care and prescribed fever reducers.',
      followUp: '2023-05-22',
      attachments: [
        { name: 'Temperature Chart', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 5,
      doctor: 'Dr. Fatima Zaidi',
      specialty: 'Neurologist',
      date: '2023-04-10',
      time: '03:45 PM',
      type: 'Telemedicine',
      status: 'completed',
      diagnosis: 'Migraine',
      prescription: [
        { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days' },
        { name: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '30 days' }
      ],
      notes: 'Patient reported severe headaches with sensitivity to light and sound. Diagnosed with migraine. Recommended keeping a headache diary and prescribed abortive and preventive medications.',
      followUp: '2023-05-08',
      attachments: [
        { name: 'Headache Diary', type: 'pdf', url: '#' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setConsultations(sampleConsultations);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
  };

  const handleCloseDetails = () => {
    setSelectedConsultation(null);
  };

  const filteredConsultations = consultations.filter(consultation => {
    // Filter by status
    if (filter === 'recent' && new Date(consultation.date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        consultation.doctor.toLowerCase().includes(searchLower) ||
        consultation.specialty.toLowerCase().includes(searchLower) ||
        consultation.diagnosis.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100 flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-2xl font-bold text-primary-800 mb-4 md:mb-0">My Consultations</h1>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search consultations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('recent')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'recent'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setFilter('past')}
                  className={`px-3 py-1 rounded-md ${
                    filter === 'past'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading consultations...</p>
            </div>
          ) : (
            <div className="p-6">
              {filteredConsultations.length > 0 ? (
                <div className="space-y-4">
                  {filteredConsultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => handleViewDetails(consultation)}
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <h3 className="text-lg font-medium text-gray-800">{consultation.doctor}</h3>
                          </div>
                          <p className="text-gray-600 ml-7">{consultation.specialty}</p>
                          <p className="text-gray-600 ml-7 mt-1">{consultation.diagnosis}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-gray-600">
                            <CalendarDaysIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <span>{new Date(consultation.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <span>{consultation.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <span>{consultation.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="text-primary-600 hover:text-primary-700 flex items-center">
                          <span>View Details</span>
                          <ChevronDownIcon className="h-5 w-5 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-4 text-gray-500">No consultations found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Consultation Details Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-primary-100 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-primary-800">Consultation Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Doctor Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 font-medium">{selectedConsultation.doctor}</p>
                    <p className="text-gray-600">{selectedConsultation.specialty}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Consultation Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CalendarDaysIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="text-gray-800">{new Date(selectedConsultation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="text-gray-800">{selectedConsultation.time}</span>
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="text-gray-800">{selectedConsultation.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Diagnosis</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedConsultation.diagnosis}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Doctor's Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{selectedConsultation.notes}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Prescription</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedConsultation.prescription.map((medication, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <p className="text-gray-800 font-medium">{medication.name}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                        <p className="text-gray-600"><span className="font-medium">Dosage:</span> {medication.dosage}</p>
                        <p className="text-gray-600"><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                        <p className="text-gray-600"><span className="font-medium">Duration:</span> {medication.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Follow-up</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">Next appointment: {new Date(selectedConsultation.followUp).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Attachments</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {selectedConsultation.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DocumentArrowDownIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <span className="text-gray-800">{attachment.name}</span>
                          </div>
                          <button className="text-primary-600 hover:text-primary-700 text-sm">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 