"use client";

import { useState } from 'react';

export default function DebugAuth() {
  const [logs, setLogs] = useState<string[]>([]);

  const checkAuthState = () => {
    const accessToken = localStorage.getItem('accessToken');
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    setLogs(prev => [...prev, `AccessToken: ${accessToken ? 'EXISTS (' + accessToken.length + ' chars)' : 'MISSING'}`]);
    setLogs(prev => [...prev, `AuthToken: ${authToken ? 'EXISTS (' + authToken.length + ' chars)' : 'MISSING'}`]);
    setLogs(prev => [...prev, `UserId: ${userId || 'MISSING'}`]);
    setLogs(prev => [...prev, `Tokens match: ${accessToken === authToken}`]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <button 
        onClick={checkAuthState}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Check Auth State
      </button>
      
      <button 
        onClick={() => setLogs([])}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
      >
        Clear Logs
      </button>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto mt-4">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">{log}</div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500">Click "Check Auth State" to see debug info.</div>
        )}
      </div>
    </div>
  );
}
