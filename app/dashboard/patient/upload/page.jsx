"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { 
  ArrowLeftIcon,
  DocumentArrowUpIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function UploadRecordPage() {
  const router = useRouter();
  const { user, getAuthToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    findings: '',
    file: null,
    fileUrl: '',
    status: 'new'
  });

  // Record types
  const recordTypes = [
    { value: '', label: 'Select record type' },
    { value: 'lab', label: 'Lab Result' },
    { value: 'imaging', label: 'Imaging (X-ray, MRI, CT scan)' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'consultation', label: 'Consultation Note' },
    { value: 'surgery', label: 'Surgical Report' },
    { value: 'other', label: 'Other' }
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file,
        // For now, we're just setting a placeholder URL
        // In a production app, you would upload the file to storage
        // and then use the returned URL
        fileUrl: URL.createObjectURL(file)
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to upload records');
      return;
    }
    
    if (!formData.title || !formData.type) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a production app, you would first upload the file to a storage service
      // and then use the returned URL in the payload
      
      const token = await getAuthToken();
      const payload = {
        title: formData.title,
        type: formData.type,
        date: formData.date,
        doctor: formData.doctor,
        findings: formData.findings,
        fileUrl: formData.fileUrl, // This should be the URL from your storage service
        status: formData.status
      };
      
      const response = await fetch('/api/patient/upload-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload record');
      }
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        doctor: '',
        findings: '',
        file: null,
        fileUrl: '',
        status: 'new'
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/patient/records');
      }, 2000);
      
    } catch (err) {
      console.error('Error uploading record:', err);
      setError(err.message || 'Failed to upload record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-primary-100">
              <div className="flex items-center">
                <button 
                  onClick={() => router.push('/dashboard/patient/records')}
                  className="mr-3 text-primary-600 hover:text-primary-800"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-primary-800">Upload Medical Record</h1>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 text-sm">Record uploaded successfully! Redirecting...</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Record Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Blood Test Results, Chest X-ray"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Record Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {recordTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Record Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                    Healthcare Provider
                  </label>
                  <input
                    type="text"
                    id="doctor"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="findings" className="block text-sm font-medium text-gray-700 mb-1">
                    Key Findings or Notes
                  </label>
                  <textarea
                    id="findings"
                    name="findings"
                    rows={4}
                    value={formData.findings}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter any key findings, results, or notes about this record"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Document
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, PNG, JPG, JPEG, DOC, DOCX up to 10MB
                      </p>
                      {formData.file && (
                        <p className="text-sm text-green-600">
                          {formData.file.name} ({Math.round(formData.file.size / 1024)} KB)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/patient/records')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 