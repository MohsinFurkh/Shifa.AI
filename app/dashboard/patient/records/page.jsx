"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { 
  MagnifyingGlassIcon, 
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch records data from API
  useEffect(() => {
    async function fetchRecords() {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userId = user._id || user.id;
        const response = await fetch(`/api/patient/records?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch medical records');
        }
        
        const data = await response.json();
        setRecords(data.records || []);
      } catch (err) {
        console.error('Error fetching medical records:', err);
        setError('Failed to load your medical records. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecords();
  }, [user]);

  // Filter records based on search query and selected filter
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.findings && record.findings.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.doctor && record.doctor.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by type
    if (currentFilter !== 'all') {
      return matchesSearch && record.type.toLowerCase() === currentFilter.toLowerCase();
    }
    
    return matchesSearch;
  });

  // Define record types for filtering
  const recordTypes = ['all', 'lab', 'imaging', 'prescription', 'consultation', 'surgery', 'other'];

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-primary-800">Medical Records</h1>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <a
                href="/dashboard/patient/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                Upload
              </a>
            </div>
          </div>
          
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {recordTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setCurrentFilter(type)}
                  className={`px-3 py-1 text-sm rounded-full capitalize ${
                    currentFilter === type
                      ? 'bg-primary-100 text-primary-800 font-medium'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading medical records...</p>
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
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Record
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 rounded-full">
                            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{record.title}</div>
                            <div className="text-sm text-gray-500">
                              {record.doctor ? `Dr. ${record.doctor}` : 'Unknown provider'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.type === 'lab' ? 'bg-blue-100 text-blue-800' :
                          record.type === 'imaging' ? 'bg-purple-100 text-purple-800' :
                          record.type === 'prescription' ? 'bg-green-100 text-green-800' :
                          record.type === 'consultation' ? 'bg-yellow-100 text-yellow-800' :
                          record.type === 'surgery' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'new' ? 'bg-green-100 text-green-800' :
                          record.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={record.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 mr-3">
                          View
                        </a>
                        <button
                          onClick={() => {
                            // Handle download functionality
                            if (record.fileUrl) {
                              window.open(record.fileUrl, '_blank');
                            }
                          }}
                          className="text-gray-600 hover:text-gray-900"
                          disabled={!record.fileUrl}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || currentFilter !== 'all' ? 
                  'Try adjusting your search or filters to find what you\'re looking for.' : 
                  'You don\'t have any medical records yet. Upload your first record to get started.'}
              </p>
              <a
                href="/dashboard/patient/upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                Upload Record
              </a>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 