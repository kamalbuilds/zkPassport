'use client';

import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    // Extract JWT from URL hash fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');
    
    if (idToken) {
      // Send the JWT back to the parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'zklogin-jwt',
            jwt: idToken,
          },
          window.location.origin
        );
        
        // Close the popup window
        window.close();
      } else {
        // If opened in the same window (not a popup)
        window.location.href = '/login?token=' + encodeURIComponent(idToken);
      }
    } else {
      // Handle error
      console.error('No ID token found in the callback URL');
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'zklogin-error',
            error: 'No ID token found in the callback URL',
          },
          window.location.origin
        );
        window.close();
      } else {
        window.location.href = '/login?error=no_token';
      }
    }
  }, []);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Authentication</h1>
        <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
} 