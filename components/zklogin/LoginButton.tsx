'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZkLoginService } from '@/lib/zklogin/zkLoginService';
import { AccountAbstractionService } from '@/lib/zklogin/accountAbstractionService';

interface LoginButtonProps {
  provider: 'google' | 'facebook';
  onLogin?: (address: string) => void;
}

export function LoginButton({ provider, onLogin }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize services
  const zkLoginService = ZkLoginService.getInstance();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (zkLoginService.isLoggedIn()) {
        const state = zkLoginService.getState();
        if (state && onLogin) {
          onLogin(state.address);
        }
      }
    };
    
    checkLoginStatus();
  }, [onLogin]);
  
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate ephemeral key pair
      const ephemeralKeyPair = zkLoginService.generateEphemeralKeyPair();
      
      // Calculate max epoch (e.g., 1 day from now in epochs)
      const EPOCH_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      const currentEpochMs = Math.floor(Date.now() / EPOCH_DURATION_MS) * EPOCH_DURATION_MS;
      const maxEpoch = Math.floor(currentEpochMs / EPOCH_DURATION_MS) + 1;
      
      // Generate nonce
      const nonce = zkLoginService.generateNonceWithEphemeralKeyPair(
        ephemeralKeyPair,
        maxEpoch
      );
      
      // Get OAuth login URL
      const loginUrl = zkLoginService.getOAuthLoginURL(provider, nonce);
      
      // Open OAuth login window
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const loginWindow = window.open(
        loginUrl,
        'zkLogin',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!loginWindow) {
        throw new Error('Failed to open login window. Please disable popup blocker.');
      }
      
      // Listen for the redirect with JWT
      const handleMessage = async (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;
        
        if (event.data && event.data.type === 'zklogin-jwt') {
          const jwt = event.data.jwt;
          
          // Remove event listener
          window.removeEventListener('message', handleMessage);
          
          try {
            // Get user salt
            const userSalt = await zkLoginService.getUserSalt(jwt);
            
            // Get user address
            const address = zkLoginService.getAddress(jwt, userSalt);
            
            // Get ZK proofs (in a real implementation)
            // For demo, we'll skip the actual proof generation
            
            // Save state
            const state = {
              jwt,
              ephemeralKeyPair: JSON.stringify({
                publicKey: ephemeralKeyPair.getPublicKey().toBase64(),
                // Note: In a real implementation, we would need to securely store the private key
                // This is just for demo purposes
                privateKey: ephemeralKeyPair.getSecretKey().toString()
              }),
              userSalt,
              zkProofs: null, // In a real implementation, this would be the actual proofs
              address,
              maxEpoch,
              expiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day expiry
            };
            
            zkLoginService.saveState(state);
            
            // Initialize account abstraction
            const aaService = AccountAbstractionService.getInstance({
              rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
              chainId: 11155111, // Sepolia testnet
            });
            
            await aaService.initialize();
            await aaService.createSmartWallet(address);
            
            // Notify parent component
            if (onLogin) {
              onLogin(address);
            }
          } catch (error) {
            console.error('Error processing login:', error);
            setError('Failed to process login. Please try again.');
          } finally {
            setIsLoading(false);
          }
        }
      };
      
      window.addEventListener('message', handleMessage);
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to initiate login. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <Button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Logging in...' : `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
} 