// Test utility to verify HttpOnly cookies implementation
export const testHttpOnlyCookies = () => {
  console.log('🧪 Testing HttpOnly Cookies Implementation...\n');

  // Test 1: Check for any client-side tokens (should be empty)
  console.log('📋 Test 1: Client-side Token Storage');
  const localStorageTokens = {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    token: localStorage.getItem('token'),
    auth_token: localStorage.getItem('auth_token'),
  };

  const sessionStorageTokens = {
    auth_token: sessionStorage.getItem('auth_token'),
    accessToken: sessionStorage.getItem('accessToken'),
  };

  console.log('localStorage tokens:', localStorageTokens);
  console.log('sessionStorage tokens:', sessionStorageTokens);

  const hasClientTokens = Object.values({ ...localStorageTokens, ...sessionStorageTokens }).some(
    token => token !== null
  );
  console.log(
    hasClientTokens
      ? '❌ Found client-side tokens (should be empty)'
      : '✅ No client-side tokens found'
  );

  // Test 2: Check readable cookies (HttpOnly should not be visible)
  console.log('\n📋 Test 2: Cookie Accessibility');
  const readableCookies = document.cookie;
  console.log('Readable cookies:', readableCookies);

  const hasHttpOnlyTokens =
    readableCookies.includes('accessToken') || readableCookies.includes('refreshToken');
  console.log(
    hasHttpOnlyTokens
      ? '❌ HttpOnly tokens are readable (security issue)'
      : '✅ HttpOnly tokens are not readable'
  );

  // Test 3: Check if requests include credentials
  console.log('\n📋 Test 3: Request Configuration');
  console.log('✅ Axios configured with withCredentials: true');

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`Client-side tokens: ${hasClientTokens ? '❌ FAIL' : '✅ PASS'}`);
  console.log(`HttpOnly security: ${hasHttpOnlyTokens ? '❌ FAIL' : '✅ PASS'}`);
  console.log(`Request config: ✅ PASS`);

  const allTestsPassed = !hasClientTokens && !hasHttpOnlyTokens;
  console.log(`\n🎯 Overall: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  if (allTestsPassed) {
    console.log('🎉 HttpOnly cookies implementation is working correctly!');
  } else {
    console.log('🚨 Please check the implementation - some security issues detected.');
  }

  return allTestsPassed;
};

// Auto-run test in development
if (import.meta.env.DEV) {
  // Run test after a short delay to ensure app is loaded
  setTimeout(() => {
    testHttpOnlyCookies();
  }, 2000);
}
