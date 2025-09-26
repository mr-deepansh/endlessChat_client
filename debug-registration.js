// Debug script to test registration flow
console.log('=== Registration Debug Script ===');

// Test the registration API directly
async function testRegistration() {
  try {
    const response = await fetch('http://localhost:8080/api/v2/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'test@example.com',
        password: 'Test@123456',
        confirmPassword: 'Test@123456',
        firstName: 'Test',
        lastName: 'User'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return data;
  } catch (error) {
    console.error('Registration test failed:', error);
  }
}

// Test feed API
async function testFeed(token) {
  try {
    const response = await fetch('http://localhost:8080/api/v2/users/feed?page=1&limit=20&sort=recent', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Feed response status:', response.status);
    const data = await response.json();
    console.log('Feed response data:', data);
    
    return data;
  } catch (error) {
    console.error('Feed test failed:', error);
  }
}

// Run tests
testRegistration().then(regData => {
  if (regData?.data?.accessToken) {
    console.log('Registration successful, testing feed...');
    testFeed(regData.data.accessToken);
  }
});