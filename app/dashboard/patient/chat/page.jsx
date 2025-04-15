"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import { PaperAirplaneIcon, PaperClipIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function ChatPage() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample data for demo purposes
  const sampleDoctors = [
    { id: 1, name: 'Dr. Sarah Ahmed', specialty: 'General Physician', online: true },
    { id: 2, name: 'Dr. Khalid Khan', specialty: 'Cardiologist', online: false },
    { id: 3, name: 'Dr. Ayesha Malik', specialty: 'Dermatologist', online: true },
    { id: 4, name: 'Dr. Imran Ali', specialty: 'Pediatrician', online: false },
    { id: 5, name: 'Dr. Fatima Zaidi', specialty: 'Neurologist', online: true },
  ];

  const sampleConversations = {
    1: [
      {
        id: 1,
        sender: 'patient',
        content: 'Hello Dr. Ahmed, I have been experiencing headaches for the past few days.',
        timestamp: '09:30 AM',
        read: true,
      },
      {
        id: 2,
        sender: 'doctor',
        content: 'Hello! I\'m sorry to hear that. How often are you experiencing these headaches?',
        timestamp: '09:32 AM',
        read: true,
      },
      {
        id: 3,
        sender: 'patient',
        content: 'They occur almost daily, usually in the afternoon.',
        timestamp: '09:33 AM',
        read: true,
      },
      {
        id: 4,
        sender: 'doctor',
        content: 'I\'m sorry to hear that. How would you describe the pain? Is it constant or does it come and go?',
        timestamp: '09:35 AM',
        read: true,
      },
    ],
    2: [
      {
        id: 1,
        sender: 'patient',
        content: 'Hi Dr. Khan, I had my follow-up appointment with you last week.',
        timestamp: '10:15 AM',
        read: true,
      },
      {
        id: 2,
        sender: 'doctor',
        content: 'Hello! Yes, I remember. How are you feeling now?',
        timestamp: '10:20 AM',
        read: true,
      },
      {
        id: 3,
        sender: 'patient',
        content: 'Much better, thank you. The medication seems to be working well.',
        timestamp: '10:22 AM',
        read: true,
      },
    ],
    3: [
      {
        id: 1,
        sender: 'doctor',
        content: 'Hello! I noticed you missed your appointment yesterday. Would you like to reschedule?',
        timestamp: '11:00 AM',
        read: true,
      },
      {
        id: 2,
        sender: 'patient',
        content: 'Yes, I apologize for that. I had an emergency. Can we reschedule for next week?',
        timestamp: '11:05 AM',
        read: true,
      },
    ],
  };

  const [conversations, setConversations] = useState(sampleConversations);

  useEffect(() => {
    // Scroll to bottom of messages when active chat changes or new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, conversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    setLoading(true);

    // Create new message
    const newMessage = {
      id: conversations[activeChat].length + 1,
      sender: 'patient',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    // Update conversations
    setConversations((prev) => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMessage],
    }));

    // Clear input
    setMessageInput('');

    // Simulate doctor's response
    setTimeout(() => {
      const doctorResponse = {
        id: conversations[activeChat].length + 2,
        sender: 'doctor',
        content: 'Thank you for your message. I will get back to you shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };

      setConversations((prev) => ({
        ...prev,
        [activeChat]: [...prev[activeChat], doctorResponse],
      }));
      setLoading(false);
    }, 1500);
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-primary-100">
            <h1 className="text-2xl font-bold text-primary-800">Chat with Doctors</h1>
          </div>

          <div className="flex flex-col md:flex-row h-[600px]">
            {/* Doctors List */}
            <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Your Doctors</h2>
                <div className="space-y-2">
                  {sampleDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setActiveChat(doctor.id)}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        activeChat === doctor.id
                          ? 'bg-primary-50 border border-primary-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {doctor.name.split(' ')[1][0]}
                            </span>
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              doctor.online ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          ></div>
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-800">{doctor.name}</h3>
                          <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-2/3 flex flex-col">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {sampleDoctors.find((d) => d.id === activeChat)?.name.split(' ')[1][0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">
                          {sampleDoctors.find((d) => d.id === activeChat)?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {sampleDoctors.find((d) => d.id === activeChat)?.specialty}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {conversations[activeChat].map((message) => (
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
                                : 'bg-gray-100 text-gray-800'
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
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PaperAirplaneIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Doctor</h3>
                    <p className="text-gray-500 max-w-md">
                      Choose a doctor from the list to start a conversation. You can discuss your health concerns, ask questions, or follow up on your appointments.
                    </p>
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