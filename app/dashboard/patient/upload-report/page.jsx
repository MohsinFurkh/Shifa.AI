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
  CheckCircleIcon
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

export default function UploadReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  
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
      formData.append('userId', user.id);
      
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
            <h1 className="text-2xl font-bold text-primary-800">Upload Medical Report</h1>
            <p className="mt-1 text-sm text-gray-600">
              Upload your medical images or lab reports for AI analysis
            </p>
          </div>

          <div className="p-6">
            {!uploadComplete ? (
              <form onSubmit={handleSubmit}>
                {!reportType ? (
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Select Report Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleReportTypeChange('image')}
                        className="relative rounded-lg border-2 border-gray-300 p-4 flex flex-col items-center text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <PhotoIcon className="h-12 w-12 text-primary-600 mb-3" aria-hidden="true" />
                        <span className="text-lg font-medium text-gray-900">Medical Image</span>
                        <span className="mt-1 text-sm text-gray-500">X-ray, MRI, CT Scan, Ultrasound, etc.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReportTypeChange('lab')}
                        className="relative rounded-lg border-2 border-gray-300 p-4 flex flex-col items-center text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <DocumentTextIcon className="h-12 w-12 text-primary-600 mb-3" aria-hidden="true" />
                        <span className="text-lg font-medium text-gray-900">Lab Test Report</span>
                        <span className="mt-1 text-sm text-gray-500">Blood tests, Urine tests, etc.</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">
                        Upload {reportType === 'image' ? 'Medical Image' : 'Lab Test Report'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => handleReportTypeChange('')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>

                    {reportType === 'image' && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image Modality
                        </label>
                        <select
                          value={selectedModality}
                          onChange={(e) => setSelectedModality(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          required
                        >
                          <option value="">Select Image Type</option>
                          {IMAGE_MODALITIES.map((modality) => (
                            <option key={modality.value} value={modality.value}>
                              {modality.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {reportType === 'lab' && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lab Test Type
                        </label>
                        <select
                          value={selectedTestType}
                          onChange={(e) => setSelectedTestType(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          required
                        >
                          <option value="">Select Test Type</option>
                          {LAB_TEST_TYPES.map((test) => (
                            <option key={test.value} value={test.value}>
                              {test.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {filePreview ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="h-40 object-contain mb-4"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFile(null);
                                  setFilePreview(null);
                                }}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remove file
                              </button>
                            </div>
                          ) : file && file.type === 'application/pdf' ? (
                            <div className="flex flex-col items-center">
                              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                              <p className="mt-1 text-sm text-gray-900">{file.name}</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setFile(null);
                                  setFilePreview(null);
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                              >
                                Remove file
                              </button>
                            </div>
                          ) : (
                            <>
                              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
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

                    {error && (
                      <div className="mb-4 rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <p>{error}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-75"
                      >
                        {isUploading ? (
                          <span className="flex items-center">
                            <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                            Analyzing...
                          </span>
                        ) : (
                          'Upload and Analyze'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="analysis-result">
                <div className="rounded-md bg-green-50 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Analysis Completed</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your medical report has been analyzed successfully.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Analysis Results
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {reportType === 'image' 
                        ? `AI analysis for ${IMAGE_MODALITIES.find(m => m.value === selectedModality)?.label || 'Medical Image'}`
                        : `AI analysis for ${LAB_TEST_TYPES.find(t => t.value === selectedTestType)?.label || 'Lab Test'}`
                      }
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    {reportType === 'image' && analysisResult && (
                      <dl>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Findings</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {analysisResult.findings}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Impression</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {analysisResult.impression}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Recommendations</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {analysisResult.recommendations}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Confidence</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {(analysisResult.probability * 100).toFixed(1)}%
                          </dd>
                        </div>
                      </dl>
                    )}

                    {reportType === 'lab' && analysisResult && (
                      <dl>
                        {analysisResult.abnormalValues && analysisResult.abnormalValues.length > 0 ? (
                          <div className="bg-white px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 mb-2">Abnormal Values</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <div className="border rounded-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-300">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Parameter
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Value
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Reference Range
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {analysisResult.abnormalValues.map((item, index) => (
                                      <tr key={index}>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {item.parameter}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {item.value}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                          {item.referenceRange}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                          <span 
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                              item.status === 'High' ? 'bg-red-100 text-red-800' : 
                                              item.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-green-100 text-green-800'
                                            }`}
                                          >
                                            {item.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </dd>
                          </div>
                        ) : (
                          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Results</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              All values are within normal ranges.
                            </dd>
                          </div>
                        )}

                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Interpretation</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {analysisResult.interpretation}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Recommendations</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {analysisResult.recommendations}
                          </dd>
                        </div>
                      </dl>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Upload Another Report
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/patient/records')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View All Reports
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