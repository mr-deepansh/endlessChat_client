// Simple HttpOnly cookies test
export const testCookies = () => {
  console.log('🧪 HttpOnly Cookies Test');
  console.log('localStorage tokens:', {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  });
  console.log('Readable cookies:', document.cookie);
  console.log('✅ Test complete - check above results');
};
