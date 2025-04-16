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
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function ConsultationsPage() {
  const { user, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [filter, setFilter] = useState('all'); // all, recent, past
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchConsultations() {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        const userId = user._id || user.id;
        
        const response = await fetch(`/api/patient/consultations?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch consultations');
        }
        
        const data = await response.json();
        setConsultations(data.consultations || []);
      } catch (err) {
        console.error('Error fetching consultations:', err);
        setError('Failed to load your consultations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchConsultations();
  }, [user, getToken]);

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
    } else if (filter === 'past' && new Date(consultation.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (consultation.doctor && consultation.doctor.toLowerCase().includes(searchLower)) ||
        (consultation.specialty && consultation.specialty.toLowerCase().includes(searchLower)) ||
        (consultation.diagnosis && consultation.diagnosis.toLowerCase().includes(searchLower))
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
          ) : error ? (
            <div className="p-8 text-center">
              <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          ) : filteredConsultations.length > 0 ? (
            <div className="p-6">
              <div className="space-y-4">
                {filteredConsultations.map((consultation) => (
                  <div
                    key={consultation._id}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleViewDetails(consultation)}
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-800">{consultation.doctor || 'Unknown Doctor'}</h3>
                        </div>
                        <p className="text-gray-600 ml-7">{consultation.specialty || 'General'}</p>
                        <p className="text-gray-600 ml-7 mt-1">{consultation.diagnosis || 'Consultation'}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-gray-600">
                          <CalendarDaysIcon className="h-5 w-5 text-primary-600 mr-2" />
                          <span>{new Date(consultation.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="h-5 w-5 text-primary-600 mr-2" />
                          <span>{consultation.time || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No consultations found</h3>
              <p className="text-gray-500 mt-2">
                {searchTerm || filter !== 'all' ? 
                  'Try adjusting your search or filters to find what you\'re looking for.' : 
                  'You don\'t have any consultations recorded yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Consultation details modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-primary-100 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-primary-800">Consultation Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Content based on actual data structure */}
              <div className="space-y-6">
                {/* Doctor and date info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <UserIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="font-medium">Doctor</h3>
                    </div>
                    <p className="ml-7">{selectedConsultation.doctor || 'Unknown Doctor'}</p>
                    <p className="ml-7 text-gray-600">{selectedConsultation.specialty || 'General'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CalendarDaysIcon className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="font-medium">Date & Time</h3>
                    </div>
                    <p className="ml-7">{new Date(selectedConsultation.date).toLocaleDateString()}</p>
                    <p className="ml-7 text-gray-600">{selectedConsultation.time || 'Not specified'}</p>
                    <p className="ml-7 text-gray-600">Type: {selectedConsultation.type || 'Not specified'}</p>
                  </div>
                </div>
                
                {/* Diagnosis and treatment */}
                {(selectedConsultation.diagnosis || selectedConsultation.notes) && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-lg mb-2">Diagnosis & Notes</h3>
                    {selectedConsultation.diagnosis && (
                      <div className="mb-3">
                        <h4 className="font-medium text-primary-700">Diagnosis</h4>
                        <p className="text-gray-700">{selectedConsultation.diagnosis}</p>
                      </div>
                    )}
                    {selectedConsultation.notes && (
                      <div>
                        <h4 className="font-medium text-primary-700">Notes</h4>
                        <p className="text-gray-700 whitespace-pre-line">{selectedConsultation.notes}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Prescription */}
                {selectedConsultation.prescription && selectedConsultation.prescription.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-lg mb-2">Prescription</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <ul className="space-y-3">
                        {selectedConsultation.prescription.map((med, index) => (
                          <li key={index} className="pb-2 border-b border-gray-200 last:border-0">
                            <div className="font-medium">{med.name}</div>
                            <div className="text-sm text-gray-600">
                              Dosage: {med.dosage}, {med.frequency} for {med.duration}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Follow-up */}
                {selectedConsultation.followUp && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-lg mb-2">Follow-up</h3>
                    <p className="text-gray-700">
                      Scheduled for {new Date(selectedConsultation.followUp).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {/* Attachments */}
                {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-lg mb-2">Attachments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedConsultation.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5 text-primary-600 mr-2" />
                          <span>{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 