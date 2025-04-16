"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Link from 'next/link';
import {
  PaperAirplaneIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  XMarkIcon,
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function PersonalAIDoctorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [healthData, setHealthData] = useState({
    age: '',
    gender: '',
    conditions: '',
    medications: '',
    allergies: '',
  });
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [isSubmittingHealthData, setIsSubmittingHealthData] = useState(false);
  const [isHealthDataLoaded, setIsHealthDataLoaded] = useState(false);
  const messageEndRef = useRef(null);
  
  // Check if the user has a valid doctor token
  useEffect(() => {
    const doctorToken = localStorage.getItem('doctorToken');
    
    // If no token, redirect back to selection
    if (!doctorToken) {
      router.push('/dashboard/patient/ai-doctor');
      return;
    }
    
    // Parse the JWT token to verify doctor type (in a real app, this would be better handled by the backend)
    try {
      const payload = JSON.parse(atob(doctorToken.split('.')[1]));
      if (payload.doctorType !== 'personal') {
        router.push('/dashboard/patient/ai-doctor');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      router.push('/dashboard/patient/ai-doctor');
    }
    
    // Load chat history and health data
    fetchHealthData();
  }, [router]);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  // Get health data and chat history from the server
  const fetchHealthData = async () => {
    setIsLoading(true);
    
    try {
      const doctorToken = localStorage.getItem('doctorToken');
      
      if (!doctorToken) {
        throw new Error('No valid doctor session');
      }
      
      // Fetch health data
      const response = await fetch('/api/doctor/health-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${doctorToken}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching health data:', errorData.message);
        
        // If we can't load health data, at least set a welcome message
        setChatHistory([{
          role: 'assistant',
          content: 'Hello! I\'m your Personal AI Doctor. To provide the most accurate guidance, I\'ll need some basic health information. Please update your health profile using the "Update Health Data" button above.',
        }]);
        return;
      }
      
      const data = await response.json();
      
      // Update health data state
      if (data.healthData) {
        setHealthData({
          age: data.healthData.age || '',
          gender: data.healthData.gender || '',
          conditions: data.healthData.conditions ? data.healthData.conditions.join(', ') : '',
          medications: data.healthData.medications ? data.healthData.medications.join(', ') : '',
          allergies: data.healthData.allergies ? data.healthData.allergies.join(', ') : '',
        });
        setIsHealthDataLoaded(true);
      }
      
      // Set chat history
      if (data.chatHistory && data.chatHistory.length > 0) {
        setChatHistory(data.chatHistory);
      } else {
        // Welcome message for new users
        setChatHistory([{
          role: 'assistant',
          content: `Hello${data.healthData?.age ? ' and welcome back' : ''}! I'm your Personal AI Doctor. I'm here to provide personalized health information based on your medical profile. How can I help you today?`,
        }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setChatHistory([{
        role: 'assistant',
        content: 'Hello! I\'m your Personal AI Doctor. To provide the most accurate guidance, I\'ll need some basic health information. Please update your health profile using the "Update Health Data" button above.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      const doctorToken = localStorage.getItem('doctorToken');
      
      if (!doctorToken) {
        throw new Error('No valid doctor session. Please restart your consultation.');
      }
      
      // Send message to AI doctor API
      const response = await fetch('/api/doctor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${doctorToken}`
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response from AI Doctor');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message to chat
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again or restart your consultation.', 
          isError: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear chat history
  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear your chat history? This cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const doctorToken = localStorage.getItem('doctorToken');
      
      if (!doctorToken) {
        throw new Error('No valid doctor session');
      }
      
      // Call API to clear history
      const response = await fetch('/api/doctor/history', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${doctorToken}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear chat history');
      }
      
      // Reset chat with welcome message
      setChatHistory([{
        role: 'assistant',
        content: 'Chat history cleared. How can I help you today?',
      }]);
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Failed to clear chat history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit health data
  const handleHealthDataSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingHealthData(true);
    
    try {
      const doctorToken = localStorage.getItem('doctorToken');
      
      if (!doctorToken) {
        throw new Error('No valid doctor session');
      }
      
      // Parse comma-separated lists into arrays
      const formattedHealthData = {
        age: healthData.age ? parseInt(healthData.age) : null,
        gender: healthData.gender || null,
        conditions: healthData.conditions ? healthData.conditions.split(',').map(item => item.trim()).filter(Boolean) : [],
        medications: healthData.medications ? healthData.medications.split(',').map(item => item.trim()).filter(Boolean) : [],
        allergies: healthData.allergies ? healthData.allergies.split(',').map(item => item.trim()).filter(Boolean) : [],
      };
      
      // Submit health data to API
      const response = await fetch('/api/doctor/health-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${doctorToken}`
        },
        body: JSON.stringify({ healthData: formattedHealthData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update health data');
      }
      
      // Close form and show success message
      setShowHealthForm(false);
      setIsHealthDataLoaded(true);
      
      // Add confirmation message to chat
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Your health information has been updated. I\'ll use this to provide more personalized guidance. How can I help you today?', 
        }
      ]);
    } catch (error) {
      console.error('Error updating health data:', error);
      alert('Failed to update health data. Please try again.');
    } finally {
      setIsSubmittingHealthData(false);
    }
  };
  
  // Format message content with HTML or line breaks
  const formatMessage = (content) => {
    // Check if content contains HTML tags
    if (content.includes('<')) {
      return (
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      );
    }
    
    // Regular formatting for plain text
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="container mx-auto py-8 h-full flex flex-col">
      <style jsx global>{`
        .markdown-content {
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .markdown-content h1, 
        .markdown-content h2, 
        .markdown-content h3, 
        .markdown-content h4 {
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .markdown-content h1 {
          font-size: 1.25rem;
        }
        
        .markdown-content h2 {
          font-size: 1.15rem;
        }
        
        .markdown-content h3 {
          font-size: 1.05rem;
        }
        
        .markdown-content p {
          margin-bottom: 0.75rem;
        }
        
        .markdown-content ul, 
        .markdown-content ol {
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .markdown-content li {
          margin-bottom: 0.25rem;
        }
        
        .markdown-content strong {
          font-weight: 600;
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/dashboard/patient/ai-doctor" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Selection
        </Link>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowHealthForm(true)}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Update Health Data
          </button>
          
          <button
            onClick={handleClearHistory}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Clear History
          </button>
        </div>
      </div>
      
      {showInfo && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                You're using the <strong>Personal AI Doctor</strong>. Your conversation history and health data are stored securely to provide personalized guidance.
              </p>
            </div>
            <button 
              onClick={() => setShowInfo(false)}
              className="ml-auto flex-shrink-0 text-green-500 hover:text-green-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Health data form modal */}
      {showHealthForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Your Health Information</h2>
              <button 
                onClick={() => setShowHealthForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleHealthDataSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  max="120"
                  value={healthData.age}
                  onChange={(e) => setHealthData({...healthData, age: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  value={healthData.gender}
                  onChange={(e) => setHealthData({...healthData, gender: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="conditions">
                  Medical Conditions
                </label>
                <textarea
                  id="conditions"
                  value={healthData.conditions}
                  onChange={(e) => setHealthData({...healthData, conditions: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Diabetes, Hypertension, etc. (comma-separated)"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="medications">
                  Current Medications
                </label>
                <textarea
                  id="medications"
                  value={healthData.medications}
                  onChange={(e) => setHealthData({...healthData, medications: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Aspirin, Insulin, etc. (comma-separated)"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="allergies">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  value={healthData.allergies}
                  onChange={(e) => setHealthData({...healthData, allergies: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Penicillin, Peanuts, etc. (comma-separated)"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center pt-4">
                <ShieldCheckIcon className="h-5 w-5 text-primary-600 mr-2" />
                <p className="text-xs text-gray-500">Your health information is stored securely and used only to provide personalized guidance.</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHealthForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHealthData}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 flex items-center"
                >
                  {isSubmittingHealthData ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Information'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-1">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Personal AI Doctor</h1>
            <p className="text-sm text-gray-600">Your personalized health assistant</p>
          </div>
          
          {isHealthDataLoaded && (
            <div className="bg-green-100 rounded-full px-3 py-1 text-xs text-green-800 flex items-center">
              <UserCircleIcon className="h-3 w-3 mr-1" />
              Health Profile Available
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '400px' }}>
          {isLoading && chatHistory.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg px-4 py-3 ${
                      chat.role === 'user'
                        ? 'bg-primary-100 text-gray-800'
                        : chat.isError
                        ? 'bg-red-50 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{formatMessage(chat.content)}</div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3/4 rounded-lg px-4 py-2 bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your health question here..."
              className="flex-1 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isLoading && chatHistory.length === 0}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className={`ml-2 bg-primary-600 text-white rounded-md p-2 ${
                !message.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
              }`}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
        <p className="font-medium mb-2">Disclaimer:</p>
        <p>The information provided by the AI Doctor is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
      </div>
    </div>
  );
} 