"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { PaperAirplaneIcon, PaperClipIcon, UserCircleIcon, ClockIcon, ChatBubbleLeftRightIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { BrainIcon, BeakerIcon } from '@heroicons/react/24/solid';

export default function ChatPage() {
  const { user } = useAuth();
  const [chatMode, setChatMode] = useState(null); // 'personal' or 'general'
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Sample chat history data
  const chatHistory = [
    { 
      id: 1, 
      date: 'Today', 
      title: 'Headache symptoms and treatment',
      preview: 'I have been experiencing severe headaches...',
      type: 'personal'
    },
    { 
      id: 2, 
      date: 'Yesterday', 
      title: 'Diet recommendations',
      preview: 'What foods should I avoid with high blood pressure?',
      type: 'personal'
    },
    { 
      id: 3, 
      date: 'Aug 12, 2023', 
      title: 'Exercise routine',
      preview: 'Can you recommend some low-impact exercises?',
      type: 'general'
    },
    { 
      id: 4, 
      date: 'Aug 5, 2023', 
      title: 'Medication side effects',
      preview: "I'm experiencing dizziness after taking...",
      type: 'personal'
    },
  ];

  // Sample conversation data
  const [currentConversation, setCurrentConversation] = useState([]);
  const [lastChat, setLastChat] = useState(chatHistory[0]);

  const samplePersonalFirstMessage = {
    id: 1,
    sender: 'doctor',
    content: `Hello ${firstName}! I'm your Personal AI Doctor. I have access to your health records and previous conversations to provide you with personalized medical guidance. What can I help you with today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: true,
  };

  const sampleGeneralFirstMessage = {
    id: 1,
    sender: 'doctor',
    content: `Hello! I'm your General AI Doctor. I can provide general medical information and health advice. Please note that I don't have access to your personal health records or our previous conversations. How can I assist you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: true,
  };

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  const handleSelectChatMode = (mode) => {
    setChatMode(mode);
    setShowChatHistory(false);
    
    // Initialize conversation with first message based on mode
    if (mode === 'personal') {
      setCurrentConversation([samplePersonalFirstMessage]);
    } else {
      setCurrentConversation([sampleGeneralFirstMessage]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !chatMode) return;

    setLoading(true);

    // Create new message
    const newMessage = {
      id: currentConversation.length + 1,
      sender: 'patient',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    // Update conversation
    setCurrentConversation((prev) => [...prev, newMessage]);

    // Clear input
    setMessageInput('');

    // Simulate AI doctor's response
    setTimeout(() => {
      const doctorResponse = {
        id: currentConversation.length + 2,
        sender: 'doctor',
        content: generateResponse(messageInput, chatMode),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };

      setCurrentConversation((prev) => [...prev, doctorResponse]);
      setLoading(false);
    }, 1500);
  };

  const generateResponse = (message, mode) => {
    // Simple response generation logic
    if (mode === 'personal') {
      if (message.toLowerCase().includes('headache')) {
        return `Based on your medical history, your headaches might be related to the stress patterns we've observed. I recommend continuing with the relaxation techniques we discussed in our last session. If the pain persists for more than 3 days, please consider scheduling an appointment with Dr. Ahmed.`;
      } else if (message.toLowerCase().includes('blood pressure') || message.toLowerCase().includes('bp')) {
        return `Looking at your recent blood pressure readings (138/85 from last week), they're slightly elevated. Continue monitoring daily, maintain your current medication, and try to reduce sodium intake. I'd recommend a follow-up check next week.`;
      } else {
        return `Thank you for sharing that, ${firstName}. Based on your health profile, I recommend monitoring these symptoms for the next 48 hours. Your medical history doesn't indicate any immediate concerns, but please keep me updated on any changes.`;
      }
    } else {
      if (message.toLowerCase().includes('headache')) {
        return `Headaches can be caused by various factors including stress, dehydration, or eye strain. Try resting in a dark room, staying hydrated, and using over-the-counter pain relievers if appropriate. If headaches persist or worsen, please consult with a healthcare provider.`;
      } else if (message.toLowerCase().includes('blood pressure') || message.toLowerCase().includes('bp')) {
        return `Maintaining healthy blood pressure is important. Regular exercise, a balanced diet low in sodium, stress management, and limiting alcohol can help. If you're concerned about your blood pressure, consult with a healthcare provider for personalized advice.`;
      } else {
        return `Thank you for your question. While I can provide general information, for personalized medical advice, it's best to consult with a healthcare provider who can take into account your specific health situation.`;
      }
    }
  };

  const handleLoadChatHistory = (chat) => {
    setChatMode(chat.type);
    setShowChatHistory(false);
    
    // Simulate loading previous chat
    if (chat.type === 'personal') {
      setCurrentConversation([
        samplePersonalFirstMessage,
        {
          id: 2,
          sender: 'patient',
          content: chat.preview,
          timestamp: '10:30 AM',
          read: true,
        },
        {
          id: 3,
          sender: 'doctor',
          content: generateResponse(chat.preview, 'personal'),
          timestamp: '10:32 AM',
          read: true,
        }
      ]);
    } else {
      setCurrentConversation([
        sampleGeneralFirstMessage,
        {
          id: 2,
          sender: 'patient',
          content: chat.preview,
          timestamp: '10:30 AM',
          read: true,
        },
        {
          id: 3,
          sender: 'doctor',
          content: generateResponse(chat.preview, 'general'),
          timestamp: '10:32 AM',
          read: true,
        }
      ]);
    }
  };

  const handleLoadLastChat = () => {
    handleLoadChatHistory(lastChat);
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100">
            <h1 className="text-2xl font-bold text-primary-800">Chat with AI Doctor</h1>
          </div>

          <div className="flex flex-col md:flex-row h-[600px]">
            {/* Options Panel */}
            <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {firstName}'s AI Doctor
                </h2>
                
                {showChatHistory ? (
                  <>
                    <div className="mb-4">
                      <button 
                        onClick={() => setShowChatHistory(false)}
                        className="flex items-center text-primary-600 hover:text-primary-800"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        <span>Back to options</span>
                      </button>
                    </div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">Past Conversations</h3>
                    <div className="space-y-3">
                      {chatHistory.map((chat) => (
                        <div 
                          key={chat.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleLoadChatHistory(chat)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{chat.title}</h4>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{chat.preview}</p>
                            </div>
                            <span className="text-xs text-gray-400">{chat.date}</span>
                          </div>
                          <div className="mt-2 flex items-center">
                            <span className={`text-xs px-2 py-1 rounded-full ${chat.type === 'personal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {chat.type === 'personal' ? 'Personal AI' : 'General AI'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6 space-y-3">
                      <button
                        onClick={() => handleSelectChatMode('personal')}
                        className={`w-full flex items-center p-4 border ${chatMode === 'personal' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'} rounded-lg hover:bg-gray-50`}
                      >
                        <div className="bg-blue-100 rounded-full p-2">
                          <BrainIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3 text-left">
                          <h3 className="font-medium text-gray-800">Personal AI Doctor</h3>
                          <p className="text-xs text-gray-500 mt-1">Uses your health data for tailored insights</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handleSelectChatMode('general')}
                        className={`w-full flex items-center p-4 border ${chatMode === 'general' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'} rounded-lg hover:bg-gray-50`}
                      >
                        <div className="bg-green-100 rounded-full p-2">
                          <BeakerIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-3 text-left">
                          <h3 className="font-medium text-gray-800">General AI Doctor</h3>
                          <p className="text-xs text-gray-500 mt-1">No memory. General advice only.</p>
                        </div>
                      </button>
                    </div>
                    
                    <div className="mt-8 space-y-3">
                      <h3 className="text-md font-medium text-gray-700 mb-2">Quick Actions</h3>
                      
                      <button
                        onClick={() => setShowChatHistory(true)}
                        className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="bg-purple-100 rounded-full p-2">
                          <ClockIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-3 text-left">
                          <h3 className="font-medium text-gray-800">Chat History</h3>
                          <p className="text-xs text-gray-500 mt-1">View your previous conversations</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={handleLoadLastChat}
                        className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="bg-amber-100 rounded-full p-2">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="ml-3 text-left">
                          <h3 className="font-medium text-gray-800">Last Chat</h3>
                          <p className="text-xs text-gray-500 mt-1">Continue your recent conversation</p>
                        </div>
                      </button>
                    </div>
                    
                    <div className="mt-8 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="ml-2">
                          <p className="text-xs text-gray-500">
                            Your conversations are private and encrypted. While our AI can provide health information, it's not a replacement for professional medical care.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-2/3 flex flex-col">
              {chatMode ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${chatMode === 'personal' ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
                        <span className={`${chatMode === 'personal' ? 'text-blue-600' : 'text-green-600'} font-medium`}>
                          {chatMode === 'personal' ? 'P' : 'G'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">
                          {chatMode === 'personal' ? 'Personal AI Doctor' : 'General AI Doctor'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {chatMode === 'personal' 
                            ? 'Uses your health data for personalized advice' 
                            : 'General medical information only'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {currentConversation.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'patient' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === 'patient'
                                ? 'bg-primary-100 text-primary-800'
                                : chatMode === 'personal'
                                  ? 'bg-blue-50 text-gray-800'
                                  : 'bg-green-50 text-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs mt-1 text-gray-500">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 text-gray-800">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 transition"
                      >
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 mx-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="submit"
                        disabled={!messageInput.trim() || loading}
                        className="p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:bg-gray-400"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PaperAirplaneIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Choose an AI Doctor</h3>
                    <p className="text-gray-500 mb-4">
                      Select whether you want to chat with a Personal AI Doctor that remembers your health data or a General AI Doctor for basic health information.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => handleSelectChatMode('personal')}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                      >
                        <BrainIcon className="h-5 w-5 mr-2" />
                        Personal AI Doctor
                      </button>
                      <button
                        onClick={() => handleSelectChatMode('general')}
                        className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                      >
                        <BeakerIcon className="h-5 w-5 mr-2" />
                        General AI Doctor
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 