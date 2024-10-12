import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WooCommerceSettings: React.FC = () => {
  const [url, setUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedUrl = localStorage.getItem('woocommerce_url');
    const savedConsumerKey = localStorage.getItem('woocommerce_consumer_key');
    const savedConsumerSecret = localStorage.getItem('woocommerce_consumer_secret');

    if (savedUrl) setUrl(savedUrl);
    if (savedConsumerKey) setConsumerKey(savedConsumerKey);
    if (savedConsumerSecret) setConsumerSecret(savedConsumerSecret);
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('woocommerce_url', url);
    localStorage.setItem('woocommerce_consumer_key', consumerKey);
    localStorage.setItem('woocommerce_consumer_secret', consumerSecret);

    alert('WooCommerce settings saved successfully!');
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await axios.get(`${url}/wp-json/wc/v3/system_status`, {
        auth: {
          username: consumerKey,
          password: consumerSecret
        }
      });

      if (response.status === 200) {
        setTestResult('Connection successful! WooCommerce API is accessible.');
      } else {
        setTestResult('Connection failed. Please check your settings.');
      }
    } catch (error) {
      setTestResult('Connection failed. Please check your settings and ensure the WooCommerce API is enabled.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">WooCommerce Settings</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">WooCommerce URL</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700">Consumer Key</label>
            <input
              type="text"
              id="consumerKey"
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700">Consumer Secret</label>
            <input
              type="password"
              id="consumerSecret"
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </form>
        {testResult && (
          <div className={`mt-4 p-3 rounded-md ${testResult.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default WooCommerceSettings;