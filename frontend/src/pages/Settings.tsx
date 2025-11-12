import React, { useState } from 'react';

export default function Settings() {
  const [apiKeys, setApiKeys] = useState({
    llmProvider: 'alibaba',
    llmApiKey: '',
    supabaseUrl: '',
    supabaseKey: '',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApiKeys({ ...apiKeys, [name]: value });
  };

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ <strong>Important:</strong> API keys are sensitive information. They are stored locally in your browser only and never sent to our servers.
            </p>
          </div>

          {saved && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              ✓ Settings saved successfully!
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">LLM Configuration</h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  LLM Provider
                </label>
                <select
                  name="llmProvider"
                  value={apiKeys.llmProvider}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                >
                  <option value="alibaba">Alibaba Bailian (阿里云百炼)</option>
                  <option value="openai">OpenAI</option>
                  <option value="huggingface">Hugging Face</option>
                  <option value="local">Local LLM</option>
                </select>
                <p className="text-gray-500 text-sm mt-1">
                  Choose your preferred LLM provider. Your instructor may provide Alibaba Bailian keys.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  name="llmApiKey"
                  value={apiKeys.llmApiKey}
                  onChange={handleChange}
                  placeholder="Your API key (e.g., sk-xxxx or your-bailian-key)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Your API key will be stored locally and used for AI requests.
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Database Configuration (Optional)</h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Supabase URL
                </label>
                <input
                  type="text"
                  name="supabaseUrl"
                  value={apiKeys.supabaseUrl}
                  onChange={handleChange}
                  placeholder="https://xxxx.supabase.co"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Supabase Key
                </label>
                <input
                  type="password"
                  name="supabaseKey"
                  value={apiKeys.supabaseKey}
                  onChange={handleChange}
                  placeholder="Your Supabase anon key"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Getting API Keys</h3>
          <ul className="text-blue-900 text-sm space-y-1">
            <li>• <strong>Alibaba Bailian:</strong> Available through your course instructor</li>
            <li>• <strong>OpenAI:</strong> https://platform.openai.com/api-keys</li>
            <li>• <strong>Supabase:</strong> https://supabase.com (Free tier available)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
