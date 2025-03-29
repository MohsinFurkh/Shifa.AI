"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

// Mock data for medical records
const MOCK_RECORDS = [
  {
    id: 'rep-001',
    title: 'Chest X-ray',
    type: 'image',
    category: 'X-ray (Chest)',
    date: '2023-10-15',
    status: 'normal',
    findings: 'No significant abnormalities detected in the lung fields. Heart size is normal.',
  },
  {
    id: 'rep-002',
    title: 'Complete Blood Count',
    type: 'lab',
    category: 'CBC',
    date: '2023-09-28',
    status: 'abnormal',
    findings: 'Elevated white blood cell count (11.2 × 10^9/L)',
  },
  {
    id: 'rep-003',
    title: 'Brain MRI',
    type: 'image',
    category: 'MRI (Brain)',
    date: '2023-08-12',
    status: 'normal',
    findings: 'Normal brain parenchyma. No evidence of acute infarction, mass, or hemorrhage.',
  },
  {
    id: 'rep-004',
    title: 'Lipid Profile',
    type: 'lab',
    category: 'Lipid Profile',
    date: '2023-07-30',
    status: 'abnormal',
    findings: 'Elevated LDL cholesterol (145 mg/dL)',
  },
  {
    id: 'rep-005',
    title: 'Abdominal Ultrasound',
    type: 'image',
    category: 'Ultrasound (Abdomen)',
    date: '2023-06-14',
    status: 'normal',
    findings: 'Normal liver, gallbladder, pancreas, spleen, and kidneys. No abnormalities detected.',
  },
];

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'lab', 'normal', 'abnormal'
  const [records, setRecords] = useState(MOCK_RECORDS);

  // Filter records based on search query and filter
  const filteredRecords = records.filter(record => {
    // Filter by search query
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.findings.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by record type or status
    if (filter === 'all') return matchesSearch;
    if (filter === 'image' || filter === 'lab') return matchesSearch && record.type === filter;
    if (filter === 'normal' || filter === 'abnormal') return matchesSearch && record.status === filter;

    return matchesSearch;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    return status === 'normal' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  // Get record icon
  const getRecordIcon = (type) => {
    return type === 'image' ? PhotoIcon : DocumentTextIcon;
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-800">Medical Records</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage your medical reports and images
              </p>
            </div>
            <Link 
              href="/dashboard/patient/upload-report"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Upload New Report
            </Link>
          </div>

          <div className="p-6">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-grow max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search records by title, type, or findings"
                />
              </div>
              <div className="flex items-center">
                <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <label htmlFor="filter" className="sr-only">Filter</label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Records</option>
                  <option value="image">Medical Images</option>
                  <option value="lab">Lab Reports</option>
                  <option value="normal">Normal Results</option>
                  <option value="abnormal">Abnormal Results</option>
                </select>
              </div>
            </div>

            {/* Records List */}
            {filteredRecords.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report
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
                        Summary
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record) => {
                      const RecordIcon = getRecordIcon(record.type);
                      return (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 rounded-full">
                                <RecordIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {record.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {record.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{record.category}</div>
                            <div className="text-sm text-gray-500">{record.type === 'image' ? 'Medical Image' : 'Laboratory Test'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                              {record.status === 'normal' ? 'Normal' : 'Abnormal'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {record.findings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">View record</span>
                              </button>
                              <button
                                type="button"
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">Download record</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by uploading a medical report or image.'}
                </p>
                {!searchQuery && filter === 'all' && (
                  <div className="mt-6">
                    <Link
                      href="/dashboard/patient/upload-report"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Upload Report
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 