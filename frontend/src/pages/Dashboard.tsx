import React, { useState } from 'react';
import { llmService } from '../services/api';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setQuery(transcript);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const result = await llmService.chat(query);
      setResponse(result.data.data.text);
    } catch (error) {
      setResponse('Error: Unable to process your request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to AI Travel Planner</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-gray-600 mb-4">
            Ask me anything about your travel plans. You can speak or type your question.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about travel plans, budget, attractions..."
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  isListening
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {isListening ? '🎤 Listening...' : '🎤'}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>

          {response && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Response:</h3>
              <p className="text-gray-700">{response}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="font-semibold text-lg mb-2">Plan Your Trip</h3>
            <p className="text-gray-600">Create personalized travel itineraries</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-lg mb-2">Manage Budget</h3>
            <p className="text-gray-600">Track your travel expenses</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="font-semibold text-lg mb-2">Settings</h3>
            <p className="text-gray-600">Configure your AI preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
