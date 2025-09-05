// Test backend connectivity
export const testBackendConnectivity = async () => {
  try {
    console.log('🔍 Testing backend connectivity...');

    // Test basic connectivity
    const response = await fetch('http://localhost:5000/api/v2');
    console.log('🌐 Backend response status:', response.status);
    console.log('🌐 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.text();
      console.log('✅ Backend is reachable:', data);
    } else {
      console.error('❌ Backend returned error status:', response.status);
    }

    return response;
  } catch (error) {
    console.error('❌ Backend connectivity test failed:', error);
    throw error;
  }
};

export const testAuthEndpoint = async () => {
  try {
    console.log('🔍 Testing auth endpoint...');

    const response = await fetch('http://localhost:5000/api/v2/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test',
        password: 'test',
      }),
    });

    console.log('🔐 Auth endpoint response status:', response.status);
    const data = await response.text();
    console.log('🔐 Auth endpoint response:', data);

    return response;
  } catch (error) {
    console.error('❌ Auth endpoint test failed:', error);
    throw error;
  }
};
