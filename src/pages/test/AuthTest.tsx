import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const AuthTest: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [credentials, setCredentials] = useState({
    identifier: 'test@example.com',
    password: 'password123'
  });

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testConnection = async () => {
    try {
      const response = await fetch('http://192.168.218.1:5000/health', {
        method: 'GET',
        credentials: 'include',
      });
      
      addResult('Connection Test', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });
    } catch (error: any) {
      addResult('Connection Test', { error: error.message });
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch('http://192.168.218.1:5000/api/v2/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      addResult('Login Test', {
        status: response.status,
        ok: response.ok,
        data,
        headers: Object.fromEntries(response.headers.entries()),
      });
    } catch (error: any) {
      addResult('Login Test', { error: error.message });
    }
  };

  const testProfile = async () => {
    try {
      const response = await fetch('http://192.168.218.1:5000/api/v2/users/profile/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      
      addResult('Profile Test', {
        status: response.status,
        ok: response.ok,
        data,
        headers: Object.fromEntries(response.headers.entries()),
      });
    } catch (error: any) {
      addResult('Profile Test', { error: error.message });
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie;
    addResult('Cookie Check', {
      cookies,
      hasCookies: !!cookies,
      cookieCount: cookies.split(';').filter(c => c.trim()).length,
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
    });
  };

  const clearResults = () => setResults([]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="identifier">Email/Username</Label>
              <Input
                id="identifier"
                value={credentials.identifier}
                onChange={(e) => setCredentials(prev => ({ ...prev, identifier: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={testConnection} variant="outline">
              Test Connection
            </Button>
            <Button onClick={checkCookies} variant="outline">
              Check Cookies
            </Button>
            <Button onClick={testLogin} variant="default">
              Test Login
            </Button>
            <Button onClick={testProfile} variant="secondary">
              Test Profile
            </Button>
            <Button onClick={clearResults} variant="destructive">
              Clear Results
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <Card key={index} className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{result.test}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;