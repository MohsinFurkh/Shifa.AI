"use client";

import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';

export default function SymptomCheckerPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  
  const commonConditions = [
    { name: 'Common Cold', symptoms: ['runny nose', 'sore throat', 'cough', 'congestion', 'sneezing'] },
    { name: 'Influenza', symptoms: ['fever', 'headache', 'muscle pain', 'fatigue', 'cough'] },
    { name: 'Migraine', symptoms: ['headache', 'nausea', 'sensitivity to light', 'blurred vision'] },
    { name: 'Allergic Rhinitis', symptoms: ['sneezing', 'itchy eyes', 'runny nose', 'congestion'] },
    { name: 'Gastroenteritis', symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain'] },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple symptom matching algorithm
    const userSymptoms = symptoms.toLowerCase().split(',').map(s => s.trim());
    
    const matches = commonConditions.map(condition => {
      const matchedSymptoms = condition.symptoms.filter(symptom => 
        userSymptoms.some(userSymptom => symptom.includes(userSymptom) || userSymptom.includes(symptom))
      );
      
      return {
        condition: condition.name,
        matchCount: matchedSymptoms.length,
        matchPercentage: Math.round((matchedSymptoms.length / condition.symptoms.length) * 100),
        matchedSymptoms
      };
    }).filter(match => match.matchCount > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Simulate API call delay
    setTimeout(() => {
      setResults(matches);
      setLoading(false);
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100">
            <h1 className="text-2xl font-bold text-primary-800">Symptom Checker</h1>
            <p className="text-gray-600">Enter your symptoms to get potential diagnoses</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="mb-4">
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe your symptoms
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your symptoms separated by commas (e.g., headache, fever, cough)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                disabled={loading}
              >
                {loading ? 'Analyzing symptoms...' : 'Check Symptoms'}
              </button>
            </form>

            {results && results.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Potential Conditions</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Note: This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation.
                </p>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-800">{result.condition}</h3>
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                          {result.matchPercentage}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Matched symptoms:</span>{' '}
                        {result.matchedSymptoms.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700 text-sm">
                    <strong>Important:</strong> This symptom checker provides general information only and is not a substitute for professional medical advice. 
                    If you're experiencing severe symptoms, please seek immediate medical attention.
                  </p>
                </div>
              </div>
            )}

            {results && results.length === 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700">
                  No matches found for your symptoms. Please try being more specific or consult with a healthcare professional.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 