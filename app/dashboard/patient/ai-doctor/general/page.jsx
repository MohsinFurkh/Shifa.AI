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
} from '@heroicons/react/24/outline';

export default function GeneralAIDoctorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m the General AI Doctor. I can provide general medical information and guidance. How can I help you today? Remember, I don\'t store your conversation history or personal information.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
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
      if (payload.doctorType !== 'general') {
        router.push('/dashboard/patient/ai-doctor');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      router.push('/dashboard/patient/ai-doctor');
    }
  }, [router]);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
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
  
  // Start a new conversation
  const handleNewConversation = () => {
    setChatHistory([
      {
        role: 'assistant',
        content: 'Hello! I\'m the General AI Doctor. I can provide general medical information and guidance. How can I help you today? Remember, I don\'t store your conversation history or personal information.',
      },
    ]);
  };
  
  // Format the message content with line breaks
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
        
        <button
          onClick={handleNewConversation}
          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
        >
          New Conversation
        </button>
      </div>
      
      {showInfo && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                You're using the <strong>General AI Doctor</strong>. This session is not personalized and your conversation is not saved.
              </p>
            </div>
            <button 
              onClick={() => setShowInfo(false)}
              className="ml-auto flex-shrink-0 text-blue-500 hover:text-blue-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-1">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">General AI Doctor</h1>
          <p className="text-sm text-gray-600">For general health questions and guidance</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '400px' }}>
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
        </div>
        
        <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your health question here..."
              className="flex-1 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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