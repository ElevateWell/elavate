// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Transition } from '@headlessui/react';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS styles

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const getUsername = () => {
      const name = prompt('Please enter your username:');
      if (name) {
        setUsername(name);
        socket.emit('join', { username: name });
      } else {
        getUsername(); // Prompt again if username is not provided
      }
    };

    getUsername();

    socket.on('chatMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      socket.emit('chatMessage', { message: inputMessage });
      setInputMessage('');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Chat App</span>
          <button
            onClick={toggleDropdown}
            className="p-2 bg-gray-700 hover:bg-gray-600 focus:outline-none rounded-md"
          >
            {username} &#9662;
          </button>
          <Transition
            show={isDropdownOpen}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {(ref) => (
              <div ref={ref} className="absolute right-0 mt-2 bg-gray-800 text-white p-2 rounded-md">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 text-sm hover:bg-gray-700 focus:outline-none rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </Transition>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <ul className="list-disc pl-4">
          {messages.map((message, index) => (
            <li key={index} className="mb-2">
              <span className="font-bold text-blue-500">{message.user}:</span> {message.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Input */}
      <div className="bg-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 p-2 rounded-md border border-gray-400 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
