// Test authentication utility
import { apiClient } from '../services/core/apiClient';

export const testAuth = async () => {
  try {
    console.log('🔍 Testing authentication...');

    // Check if token exists
    const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
    console.log('🔑 Token exists:', !!token);
    console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

    // Check token format
    if (token) {
      try {
        const parts = token.split('.');
        console.log('🔑 Token parts count:', parts.length);
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('🔑 Token payload:', payload);
          console.log('🔑 Token exp:', new Date(payload.exp * 1000));
          console.log('🔑 Token is expired:', Date.now() > payload.exp * 1000);
        }
      } catch (e) {
        console.warn('🔑 Token parsing failed:', e);
      }
    }

    // Test a simple API call
    console.log('🌐 Testing API call to /users/profile/me...');
    const response = await apiClient.get('/users/profile/me');
    console.log('✅ API call successful:', response);
    return response;
  } catch (error) {
    console.error('❌ Authentication test failed:', error);

    // Try to get more details about the error
    if (error.response) {
      console.error('❌ Error response status:', error.response.status);
      console.error('❌ Error response data:', error.response.data);
    }

    throw error;
  }
};

export const testOtherEndpoints = async () => {
  try {
    console.log('🔍 Testing other endpoints...');

    // Test users endpoint
    console.log('🔍 Testing /users endpoint...');
    const usersResponse = await apiClient.get('/users?page=1&limit=10');
    console.log('✅ Users API call successful:', usersResponse);

    // Test search endpoint
    console.log('🔍 Testing /users/search endpoint...');
    const searchResponse = await apiClient.get('/users/search?username=alex');
    console.log('✅ Search API call successful:', searchResponse);

    return { usersResponse, searchResponse };
  } catch (error) {
    console.error('❌ Other endpoints test failed:', error);
    throw error;
  }
};

export const testFeed = async () => {
  try {
    console.log('🔍 Testing feed API...');
    console.log('🔍 Feed URL: /users/feed?page=1&limit=20&sort=recent');

    // Test with different parameter combinations
    console.log('🔍 Testing with minimal parameters...');
    const response1 = await apiClient.get('/users/feed');
    console.log('✅ Minimal feed API call successful:', response1);

    console.log('🔍 Testing with full parameters...');
    const response2 = await apiClient.get('/users/feed?page=1&limit=20&sort=recent');
    console.log('✅ Full feed API call successful:', response2);

    return response2;
  } catch (error) {
    console.error('❌ Feed API test failed:', error);

    // Try to get more details about the error
    if (error.response) {
      console.error('❌ Error response status:', error.response.status);
      console.error('❌ Error response data:', error.response.data);
      console.error('❌ Error response headers:', error.response.headers);
    }

    throw error;
  }
};
