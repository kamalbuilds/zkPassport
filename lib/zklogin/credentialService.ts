import { CredentialType, Credential } from './zkBridgeService';

/**
 * Credential Service
 * 
 * This service manages user credentials and provides functionality for
 * creating, verifying, and managing credentials in the zkPassport system
 */

// Issuer configuration
export interface Issuer {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  publicKey: string;
  types: CredentialType[];
}

// Sample issuers
export const ISSUERS: Issuer[] = [
  {
    id: 'kyc-provider-1',
    name: 'Global KYC Solutions',
    url: 'https://globalkyc.example',
    logoUrl: '/images/issuers/kyc-provider.svg',
    publicKey: '0x1234567890123456789012345678901234567890',
    types: [CredentialType.KYC, CredentialType.AGE_VERIFICATION],
  },
  {
    id: 'dao-governance',
    name: 'DAO Governance Council',
    url: 'https://dao-governance.example',
    logoUrl: '/images/issuers/dao-governance.svg',
    publicKey: '0x2345678901234567890123456789012345678901',
    types: [CredentialType.DAO_MEMBERSHIP],
  },
  {
    id: 'credit-score-authority',
    name: 'Decentralized Credit Authority',
    url: 'https://dca.example',
    logoUrl: '/images/issuers/credit-authority.svg',
    publicKey: '0x3456789012345678901234567890123456789012',
    types: [CredentialType.CREDIT_SCORE, CredentialType.INCOME_VERIFICATION],
  },
];

export class CredentialService {
  private static instance: CredentialService;
  private credentials: Map<string, Credential> = new Map();
  
  // Private constructor for singleton
  private constructor() {
    // Initialize with sample credentials if needed
    this.initSampleCredentials();
  }
  
  /**
   * Get the singleton instance of credential service
   */
  public static getInstance(): CredentialService {
    if (!CredentialService.instance) {
      CredentialService.instance = new CredentialService();
    }
    return CredentialService.instance;
  }
  
  /**
   * Initialize some sample credentials for demo purposes
   */
  private initSampleCredentials(): void {
    const sampleCredentials: Credential[] = [
      {
        id: 'cred-1',
        type: CredentialType.KYC,
        issuer: 'kyc-provider-1',
        subject: 'user-123',
        issuanceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        attributes: {
          kycLevel: 'advanced',
          country: 'US',
          verificationMethod: 'document',
        },
      },
      {
        id: 'cred-2',
        type: CredentialType.DAO_MEMBERSHIP,
        issuer: 'dao-governance',
        subject: 'user-123',
        issuanceDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
        attributes: {
          daoName: 'zkDAO',
          membershipLevel: 'contributor',
          votingPower: 100,
        },
      },
    ];
    
    sampleCredentials.forEach(cred => {
      this.credentials.set(cred.id, cred);
    });
  }
  
  /**
   * Get a credential by ID
   */
  public getCredential(id: string): Credential | undefined {
    return this.credentials.get(id);
  }
  
  /**
   * Get all credentials for a subject (user)
   */
  public getCredentialsForSubject(subject: string): Credential[] {
    return Array.from(this.credentials.values())
      .filter(cred => cred.subject === subject);
  }
  
  /**
   * Create a new credential
   */
  public createCredential(
    type: CredentialType,
    issuer: string,
    subject: string,
    attributes: Record<string, any>,
    validityDays: number = 365
  ): Credential {
    // Check if issuer exists
    const issuerConfig = ISSUERS.find(i => i.id === issuer);
    if (!issuerConfig) {
      throw new Error(`Issuer not found: ${issuer}`);
    }
    
    // Check if issuer supports this credential type
    if (!issuerConfig.types.includes(type)) {
      throw new Error(`Issuer ${issuer} does not support credential type ${type}`);
    }
    
    const now = new Date();
    const expirationDate = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);
    
    const credential: Credential = {
      id: `cred-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      issuer,
      subject,
      issuanceDate: now.toISOString(),
      expirationDate: expirationDate.toISOString(),
      attributes,
    };
    
    // Save the credential
    this.credentials.set(credential.id, credential);
    
    return credential;
  }
  
  /**
   * Verify if a credential is valid
   */
  public verifyCredential(credentialId: string): { valid: boolean; reason?: string } {
    const credential = this.credentials.get(credentialId);
    
    if (!credential) {
      return { valid: false, reason: 'Credential not found' };
    }
    
    // Check expiration
    const now = new Date();
    const expiration = new Date(credential.expirationDate);
    
    if (now > expiration) {
      return { valid: false, reason: 'Credential expired' };
    }
    
    // In a real implementation, we would verify the cryptographic signature
    // of the issuer here to ensure the credential hasn't been tampered with
    
    return { valid: true };
  }
  
  /**
   * Revoke a credential
   */
  public revokeCredential(credentialId: string): boolean {
    return this.credentials.delete(credentialId);
  }
  
  /**
   * Get all supported issuers
   */
  public getIssuers(): Issuer[] {
    return ISSUERS;
  }
  
  /**
   * Get an issuer by ID
   */
  public getIssuer(id: string): Issuer | undefined {
    return ISSUERS.find(issuer => issuer.id === id);
  }
  
  /**
   * Get issuers that can issue a specific credential type
   */
  public getIssuersForCredentialType(type: CredentialType): Issuer[] {
    return ISSUERS.filter(issuer => issuer.types.includes(type));
  }
} 