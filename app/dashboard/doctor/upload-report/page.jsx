"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// List of supported image types
const IMAGE_MODALITIES = [
  { value: 'x-ray-chest', label: 'X-ray (Chest)' },
  { value: 'x-ray-bone', label: 'X-ray (Bone)' },
  { value: 'mri-brain', label: 'MRI (Brain)' },
  { value: 'mri-spine', label: 'MRI (Spine)' },
  { value: 'mri-knee', label: 'MRI (Knee)' },
  { value: 'ct-chest', label: 'CT Scan (Chest)' },
  { value: 'ct-abdomen', label: 'CT Scan (Abdomen)' },
  { value: 'ct-brain', label: 'CT Scan (Brain)' },
  { value: 'ultrasound-breast', label: 'Ultrasound (Breast)' },
  { value: 'ultrasound-abdomen', label: 'Ultrasound (Abdomen)' },
  { value: 'ultrasound-pregnancy', label: 'Ultrasound (Pregnancy)' },
  { value: 'mammogram', label: 'Mammogram' },
];

// List of supported lab test types
const LAB_TEST_TYPES = [
  { value: 'cbc', label: 'Complete Blood Count (CBC)' },
  { value: 'lipid-profile', label: 'Lipid Profile' },
  { value: 'liver-function', label: 'Liver Function Test (LFT)' },
  { value: 'kidney-function', label: 'Kidney Function Test (KFT)' },
  { value: 'thyroid-function', label: 'Thyroid Function Test' },
  { value: 'blood-glucose', label: 'Blood Glucose Test' },
  { value: 'hba1c', label: 'HbA1c (Glycated Hemoglobin)' },
  { value: 'vitamin-panel', label: 'Vitamin Panel' },
  { value: 'urinalysis', label: 'Urinalysis' },
  { value: 'covid-test', label: 'COVID-19 Test' },
  { value: 'other', label: 'Other Blood Test' },
];

// Mock patient data
const MOCK_PATIENTS = [
  { id: 1, name: 'John Smith', age: 45, gender: 'Male', condition: 'Hypertension, Diabetes' },
  { id: 2, name: 'Emily Johnson', age: 32, gender: 'Female', condition: 'Migraine, Anxiety' },
  { id: 3, name: 'Michael Rodriguez', age: 58, gender: 'Male', condition: 'Post-surgery recovery' },
  { id: 4, name: 'James Wilson', age: 67, gender: 'Male', condition: 'Hypertension, Diabetes' },
  { id: 5, name: 'Sarah Thompson', age: 42, gender: 'Female', condition: 'Asthma' },
  { id: 6, name: 'Robert Garcia', age: 35, gender: 'Male', condition: 'Anxiety, Insomnia' },
  { id: 7, name: 'Jennifer Lee', age: 29, gender: 'Female', condition: 'Migraine' },
];

export default function UploadReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State for the form
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reportType, setReportType] = useState(''); // 'image' or 'lab'
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  // Reset form when report type changes
  const handleReportTypeChange = (type) => {
    setReportType(type);
    setSelectedModality('');
    setSelectedTestType('');
    setFile(null);
    setFilePreview(null);
    setError('');
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/dicom'];
    const validDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (reportType === 'image' && !validImageTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or DICOM).');
      return;
    }
    
    if (reportType === 'lab' && !validDocumentTypes.includes(selectedFile.type)) {
      setError('Please upload a valid document (PDF, JPEG, or PNG).');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create file preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDFs, use a generic preview
      setFilePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedPatient) {
      setError('Please select a patient.');
      return;
    }
    
    if (reportType === 'image' && !selectedModality) {
      setError('Please select an image modality.');
      return;
    }
    
    if (reportType === 'lab' && !selectedTestType) {
      setError('Please select a lab test type.');
      return;
    }
    
    if (!file) {
      setError('Please upload a file.');
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      // In a real application, you would use FormData to upload the file to your server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', selectedPatient);
      formData.append('doctorId', user?.id || 'doctor-test');
      
      if (reportType === 'image') {
        formData.append('reportType', 'image');
        formData.append('modality', selectedModality);
      } else {
        formData.append('reportType', 'lab');
        formData.append('testType', selectedTestType);
      }
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate response from AI analysis
      let mockAnalysis;
      
      if (reportType === 'image') {
        if (selectedModality === 'x-ray-chest') {
          mockAnalysis = {
            findings: "No significant abnormalities detected in the lung fields. Heart size is normal. No pleural effusions.",
            impression: "Normal chest radiograph.",
            recommendations: "No follow-up imaging required.",
            probability: 0.94
          };
        } else if (selectedModality.includes('mri')) {
          mockAnalysis = {
            findings: "Normal brain parenchyma. No evidence of acute infarction, mass, or hemorrhage. Ventricles are normal in size and configuration.",
            impression: "Normal MRI study without evidence of pathology.",
            recommendations: "No additional imaging recommended at this time.",
            probability: 0.87
          };
        } else {
          mockAnalysis = {
            findings: "Examination reveals normal anatomy and structure. No abnormalities detected.",
            impression: "Normal imaging study.",
            recommendations: "No further imaging required at this time.",
            probability: 0.91
          };
        }
      } else {
        if (selectedTestType === 'cbc') {
          mockAnalysis = {
            abnormalValues: [
              { parameter: "White Blood Cells", value: "11.2 × 10^9/L", referenceRange: "4.5-11.0 × 10^9/L", status: "High" }
            ],
            interpretation: "Slightly elevated white blood cell count may indicate mild infection or inflammation.",
            recommendations: "Consider follow-up testing if symptoms persist. Stay hydrated and monitor for fever."
          };
        } else if (selectedTestType === 'lipid-profile') {
          mockAnalysis = {
            abnormalValues: [
              { parameter: "LDL Cholesterol", value: "145 mg/dL", referenceRange: "<130 mg/dL", status: "High" }
            ],
            interpretation: "Elevated LDL cholesterol indicates increased risk for cardiovascular disease.",
            recommendations: "Dietary modifications recommended. Increase physical activity and reduce saturated fat intake."
          };
        } else {
          mockAnalysis = {
            abnormalValues: [],
            interpretation: "All values are within normal ranges.",
            recommendations: "Continue with regular health check-ups as recommended by your physician."
          };
        }
      }
      
      setAnalysisResult(mockAnalysis);
      setUploadComplete(true);
    } catch (error) {
      setError('An error occurred while uploading the file. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient('');
    setReportType('');
    setSelectedModality('');
    setSelectedTestType('');
    setFile(null);
    setFilePreview(null);
    setUploadComplete(false);
    setAnalysisResult(null);
    setError('');
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100">
            <h1 className="text-2xl font-bold text-primary-800">Upload Patient Medical Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Upload your patient's medical images or lab reports for AI analysis
            </p>
          </div>

          <div className="p-6">
            {!uploadComplete ? (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Select Patient */}
                {!selectedPatient ? (
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Select Patient</h2>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {MOCK_PATIENTS.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => setSelectedPatient(patient.id)}
                          className="relative rounded-lg border-2 border-gray-300 p-4 flex flex-col items-start text-left hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                          <div className="flex items-center w-full">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                              <UserIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-medium text-gray-900">{patient.name}</h3>
                              <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">{patient.condition}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Display selected patient
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
                      <button 
                        type="button" 
                        onClick={() => setSelectedPatient('')}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        Change Patient
                      </button>
                    </div>
                    
                    {(() => {
                      const patient = MOCK_PATIENTS.find(p => p.id === selectedPatient);
                      return (
                        <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                            <UserIcon className="h-7 w-7" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{patient?.name}</h3>
                            <p className="text-sm text-gray-500">{patient?.age} years • {patient?.gender}</p>
                            <p className="text-sm text-gray-500 mt-1">{patient?.condition}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Step 2: Report Type Selection (only shown after patient selection) */}
                {selectedPatient && !reportType ? (
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Select Report Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleReportTypeChange('image')}
                        className="relative rounded-lg border-2 border-gray-300 p-4 flex flex-col items-center text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <div className="rounded-full bg-blue-100 p-3 mb-3">
                          <PhotoIcon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Medical Image</h3>
                        <p className="mt-1 text-sm text-gray-500">X-rays, MRIs, CT scans, ultrasounds, etc.</p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleReportTypeChange('lab')}
                        className="relative rounded-lg border-2 border-gray-300 p-4 flex flex-col items-center text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <div className="rounded-full bg-green-100 p-3 mb-3">
                          <DocumentTextIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Lab Test Report</h3>
                        <p className="mt-1 text-sm text-gray-500">Blood tests, urine analysis, etc.</p>
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Step 3: More details based on report type */}
                {reportType === 'image' && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Medical Image Details</h2>
                      <button 
                        type="button" 
                        onClick={() => setReportType('')}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        Change Report Type
                      </button>
                    </div>
                    
                    {/* Image modality selection */}
                    <div className="mb-4">
                      <label htmlFor="modality" className="block text-sm font-medium text-gray-700 mb-1">
                        Image Modality
                      </label>
                      <select
                        id="modality"
                        value={selectedModality}
                        onChange={(e) => setSelectedModality(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select modality</option>
                        {IMAGE_MODALITIES.map((modality) => (
                          <option key={modality.value} value={modality.value}>
                            {modality.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {reportType === 'lab' && (
                  <div className="space-y-6">
                    {/* Patient info */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      {(() => {
                        const patient = MOCK_PATIENTS.find(p => p.id === selectedPatient);
                        return (
                          <div className="flex items-start">
                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                              <UserIcon className="h-7 w-7" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{patient?.name}</h3>
                              <p className="text-sm text-gray-500">{patient?.age} years • {patient?.gender}</p>
                              <p className="text-sm text-gray-700 mt-1">{patient?.condition}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Report info */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Report Information</h3>
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50">
                          <h3 className="text-base font-medium text-gray-900">
                            {LAB_TEST_TYPES.find(t => t.value === selectedTestType)?.label || 'Lab Test'} Results
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Uploaded {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <div className="border-t border-gray-200">
                          <dl>
                            {analysisResult?.abnormalValues && analysisResult.abnormalValues.length > 0 ? (
                              <div className="bg-white px-4 py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 mb-2">Abnormal Values</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Parameter</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reference Range</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                      {analysisResult.abnormalValues.map((item, index) => (
                                        <tr key={index}>
                                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{item.parameter}</td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.value}</td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.referenceRange}</td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                              item.status === 'High' 
                                                ? 'bg-red-100 text-red-800' 
                                                : item.status === 'Low'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                              {item.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </dd>
                              </div>
                            ) : (
                              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Abnormal Values</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    None detected
                                  </span>
                                </dd>
                              </div>
                            )}
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Interpretation</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {analysisResult?.interpretation}
                              </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Recommendations</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                {analysisResult?.recommendations}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                {(reportType === 'image' && selectedModality) || (reportType === 'lab' && selectedTestType) ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload {reportType === 'image' ? 'Image' : 'Document'}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {filePreview ? (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setFile(null);
                                setFilePreview(null);
                              }}
                              className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="mx-auto h-48 object-cover"
                            />
                            <p className="text-sm text-gray-500 mt-2">{file.name}</p>
                          </div>
                        ) : (
                          <>
                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  accept={
                                    reportType === 'image'
                                      ? 'image/jpeg,image/png,image/dicom'
                                      : 'application/pdf,image/jpeg,image/png'
                                  }
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {reportType === 'image'
                                ? 'PNG, JPG, DICOM up to 10MB'
                                : 'PDF, PNG, JPG up to 10MB'}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Error message */}
                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                {selectedPatient && reportType && ((reportType === 'image' && selectedModality) || (reportType === 'lab' && selectedTestType)) && file && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        isUploading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Processing...
                        </>
                      ) : (
                        'Upload & Analyze'
                      )}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Result</h2>
                <p className="text-base text-gray-500 mb-6">
                  Your report has been successfully uploaded and analyzed.
                </p>
                <div className="flex justify-center">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                    {analysisResult ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Result</h3>
                        <p className="text-base text-gray-500 mb-4">{analysisResult.findings}</p>
                        <p className="text-base text-gray-500 mb-4">{analysisResult.impression}</p>
                        <p className="text-base text-gray-500 mb-4">{analysisResult.recommendations}</p>
                        <p className="text-base text-gray-500 mb-4">Probability: {analysisResult.probability.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-base text-gray-500">No analysis result available</p>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Upload Another Report
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/doctor/patients/${selectedPatient}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back to Patient Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 