"use client";

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailTest, setEmailTest] = useState({ email: '', loading: false, result: null });

  const runTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Test error:', error);
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async (e) => {
    e.preventDefault();
    setEmailTest(prev => ({ ...prev, loading: true, result: null }));
    
    try {
      const response = await fetch(
        `/api/test?test_email=true&email=${encodeURIComponent(emailTest.email)}`
      );
      const data = await response.json();
      setEmailTest(prev => ({ ...prev, result: data }));
    } catch (error) {
      console.error('Email test error:', error);
      setEmailTest(prev => ({ 
        ...prev, 
        result: { error: error.message } 
      }));
    } finally {
      setEmailTest(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shifa.AI System Diagnostics</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <button 
          onClick={runTests}
          disabled={loading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Tests Again'}
        </button>
        
        {testResults ? (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium">MongoDB Connection</h3>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  testResults.mongodb?.status === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.mongodb?.status || 'Unknown'}
                </span>
                {testResults.mongodb?.message && (
                  <p className="mt-2 text-red-600">{testResults.mongodb.message}</p>
                )}
                {testResults.mongodb?.collections && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Collections:</p>
                    <ul className="ml-5 list-disc">
                      {testResults.mongodb.collections.map(collection => (
                        <li key={collection} className="text-sm">{collection}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-medium">Environment Variables</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(testResults.env || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className={value === 'Not set' ? 'text-red-600' : 'text-green-600'}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !loading && (
          <p>No test results available</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Email Test</h2>
        <form onSubmit={testEmail} className="space-y-4">
          <div>
            <label htmlFor="test-email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="test-email"
              value={emailTest.email}
              onChange={(e) => setEmailTest(prev => ({ ...prev, email: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter email to test"
            />
          </div>
          <button
            type="submit"
            disabled={emailTest.loading || !emailTest.email}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {emailTest.loading ? 'Sending Test Email...' : 'Send Test Email'}
          </button>
        </form>
        
        {emailTest.result && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-medium">Email Test Result</h3>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-sm ${
                emailTest.result.email?.status === 'sent' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {emailTest.result.email?.status || 'Unknown'}
              </span>
              {emailTest.result.email?.message && (
                <p className="mt-2 text-red-600">{emailTest.result.email.message}</p>
              )}
              {emailTest.result.error && (
                <p className="mt-2 text-red-600">{emailTest.result.error}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 