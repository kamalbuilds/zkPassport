import { generateNonce, generateRandomness, jwtToAddress } from '@mysten/sui/zklogin';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { toSerializedSignature } from '@mysten/sui/cryptography';

// Types for zkLogin
export interface ZkLoginState {
  jwt: string;
  ephemeralKeyPair: string;
  userSalt: string;
  zkProofs: ZkProof | null;
  address: string;
  maxEpoch: number;
  expiresAt: number;
}

export interface ZkProof {
  proofPoints: {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
  };
  issBase64Details: {
    value: string;
    indexMod4: number;
  };
  headerBase64: string;
}

export interface JwtData {
  iss: string;
  aud: string;
  sub: string;
  email?: string;
  name?: string;
  exp: number;
}

// Configuration for various OAuth providers
const oAuthProviders = {
  google: {
    name: 'Google',
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
  },
  facebook: {
    name: 'Facebook',
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
    authEndpoint: 'https://www.facebook.com/v16.0/dialog/oauth',
    scope: 'email public_profile',
  },
};

// Configuration for proof generation service
const PROVER_URL = process.env.NEXT_PUBLIC_PROVER_URL || 'https://prover.mystenlabs.com/v1';
const SALT_SERVICE_URL = process.env.NEXT_PUBLIC_SALT_SERVICE_URL || 'https://salt.api.mystenlabs.com/get_salt';

export class ZkLoginService {
  private static instance: ZkLoginService;
  
  constructor() {}
  
  public static getInstance(): ZkLoginService {
    if (!ZkLoginService.instance) {
      ZkLoginService.instance = new ZkLoginService();
    }
    return ZkLoginService.instance;
  }
  
  // Generate a random ephemeral key pair for the zkLogin session
  public generateEphemeralKeyPair(): Ed25519Keypair {
    return new Ed25519Keypair();
  }
  
  // Generate a nonce using the ephemeral public key
  public generateNonceWithEphemeralKeyPair(keypair: Ed25519Keypair, maxEpoch: number): string {
    const randomness = generateRandomness();
    return generateNonce(keypair.getPublicKey(), maxEpoch, randomness);
  }
  
  // Build the OAuth login URL for a specific provider
  public getOAuthLoginURL(provider: keyof typeof oAuthProviders, nonce: string): string {
    const oauthConfig = oAuthProviders[provider];
    if (!oauthConfig) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    const params = new URLSearchParams({
      client_id: oauthConfig.clientId,
      redirect_uri: oauthConfig.redirectUri,
      response_type: 'id_token',
      scope: oauthConfig.scope,
      nonce: nonce,
      prompt: 'select_account',
    });
    
    return `${oauthConfig.authEndpoint}?${params.toString()}`;
  }
  
  // Parse a JWT token to get user information
  public parseJwt(token: string): JwtData {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }
  
  // Get a user salt that will be used to derive the zkLogin address
  public async getUserSalt(jwt: string): Promise<string> {
    try {
      const response = await fetch(SALT_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: jwt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user salt');
      }
      
      const data = await response.json();
      return data.salt;
    } catch (error) {
      console.error('Error getting user salt:', error);
      // For demo, you can use a fixed salt, but this is not secure for production
      return '129390038577185583942388216820280642146';
    }
  }
  
  // Get the zkLogin Sui address based on JWT and user salt
  public getAddress(jwt: string, userSalt: string): string {
    return jwtToAddress(jwt, userSalt);
  }
  
  // Generate zero-knowledge proofs
  public async getZkProofs(
    jwt: string,
    ephemeralPublicKey: string,
    maxEpoch: number,
    randomness: string,
    jwtRandomness: string
  ): Promise<ZkProof> {
    try {
      const payload = {
        jwt,
        extendedEphemeralPublicKey: ephemeralPublicKey,
        maxEpoch,
        jwtRandomness,
        salt: randomness,
      };
      
      const response = await fetch(PROVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate ZK proof');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating ZK proof:', error);
      throw error;
    }
  }
  
  // Save zkLogin state to local storage
  public saveState(state: ZkLoginState): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zkLoginState', JSON.stringify(state));
    }
  }
  
  // Get zkLogin state from local storage
  public getState(): ZkLoginState | null {
    if (typeof window !== 'undefined') {
      const state = localStorage.getItem('zkLoginState');
      if (state) {
        return JSON.parse(state);
      }
    }
    return null;
  }
  
  // Clear zkLogin state from local storage
  public clearState(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zkLoginState');
    }
  }
  
  // Check if user is logged in with valid session
  public isLoggedIn(): boolean {
    const state = this.getState();
    if (!state) return false;
    
    // Check if session is expired
    const now = Math.floor(Date.now() / 1000);
    return state.expiresAt > now;
  }
} 