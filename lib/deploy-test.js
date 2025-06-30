// This is a simple test script that can be added to the deployment
// to verify the API connection to the Render backend

(function() {
  // API URL from environment variable only (no fallback for security)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
  
  if (!API_URL) {
    console.error('API URL not configured. Please set NEXT_PUBLIC_API_URL or BACKEND_API_URL environment variable.');
    return;
  }

  console.log('=== LiteFi Backend Connection Test ===');
  console.log('Testing connection to:', API_URL);

  // Create a button that when clicked will test the connection
  function createTestButton() {
    const button = document.createElement('button');
    button.innerText = 'Test Backend Connection';
    button.style.padding = '10px 20px';
    button.style.margin = '20px';
    button.style.backgroundColor = '#f44336';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', async () => {
      const resultDiv = document.getElementById('connection-test-result') || document.createElement('div');
      resultDiv.id = 'connection-test-result';
      resultDiv.style.margin = '20px';
      resultDiv.style.padding = '10px';
      resultDiv.style.borderRadius = '4px';
      
      try {
        resultDiv.innerText = 'Testing connection...';
        resultDiv.style.backgroundColor = '#fffde7';
        
        const response = await fetch(API_URL);
        const data = await response.text();
        
        resultDiv.innerText = `Connection successful! Server responded with status: ${response.status}`;
        resultDiv.style.backgroundColor = '#e8f5e9';
        console.log('Connection test success:', data);
      } catch (error) {
        resultDiv.innerText = `Connection failed: ${error.message}`;
        resultDiv.style.backgroundColor = '#ffebee';
        console.error('Connection test failed:', error);
      }
      
      if (!document.getElementById('connection-test-result')) {
        document.body.appendChild(resultDiv);
      }
    });
    
    return button;
  }

  // Add the test button to the page when loaded
  window.addEventListener('DOMContentLoaded', () => {
    // Only add the test button if we're on the test route or have a special query param
    if (window.location.pathname === '/test-connection' || window.location.search.includes('test-api')) {
      const testButton = createTestButton();
      document.body.appendChild(testButton);
    }
  });
})();
