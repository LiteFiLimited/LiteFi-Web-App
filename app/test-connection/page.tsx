'use client';

import { useState, useEffect } from 'react';
import { testConnection } from '@/lib/api';

export default function TestConnection() {
  const [backendStatus, setBackendStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (message: string) => {
      setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const checkBackend = async () => {
      addLog('Testing backend connection...');
      try {
        const isConnected = await testConnection();
        if (isConnected) {
          setBackendStatus('connected');
          addLog('✅ Backend connection successful');
        } else {
          setBackendStatus('failed');
          addLog('❌ Backend connection failed');
        }
      } catch (error) {
        setBackendStatus('failed');
        addLog(`❌ Backend connection error: ${error}`);
      }
    };

    checkBackend();
  }, []);

  const runTest = async () => {
    setBackendStatus('testing');
    setLogs([]);
    // Trigger the effect again
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Backend Connection Test</h1>
        
        {/* Connection Status */}
        <div className="text-center mb-6">
          <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
            backendStatus === 'connected' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : backendStatus === 'failed'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            {backendStatus === 'connected' && '🟢 Backend Connected'}
            {backendStatus === 'failed' && '🔴 Backend Disconnected'}
            {backendStatus === 'testing' && '🟡 Testing Connection...'}
          </div>
        </div>

        {/* Logs */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Connection Logs:</h2>
          <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <button
            onClick={runTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Run Test Again
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Troubleshooting:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Make sure your backend server is running on localhost:3000</li>
            <li>• Check that no other service is using port 3000</li>
            <li>• Clear browser cache if you see port 3001 in network requests</li>
            <li>• Verify the backend `/` endpoint returns a valid response</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 