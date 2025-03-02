'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZkLoginService } from '@/lib/zklogin/zkLoginService';
import { CredentialService, ISSUERS, Issuer } from '@/lib/zklogin/credentialService';
import { CredentialType, Credential } from '@/lib/zklogin/zkBridgeService';
import { ZkBridgeService, Chain } from '@/lib/zklogin/zkBridgeService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CredentialsPage() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [targetChain, setTargetChain] = useState<Chain>(Chain.ETHEREUM);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; txHash?: string } | null>(null);
  
  useEffect(() => {
    const zkLoginService = ZkLoginService.getInstance();
    const credentialService = CredentialService.getInstance();
    
    // Check if user is logged in
    if (!zkLoginService.isLoggedIn()) {
      router.push('/login');
      return;
    }
    
    // Get user address
    const state = zkLoginService.getState();
    if (state) {
      setAddress(state.address);
      
      // Get user credentials
      const userCredentials = credentialService.getCredentialsForSubject('user-123'); // In a real app, this would be the user's ID
      setCredentials(userCredentials);
    }
    
    setIsLoading(false);
  }, [router]);
  
  const handleRequestCredential = async (issuer: Issuer, credentialType: CredentialType) => {
    try {
      const credentialService = CredentialService.getInstance();
      
      // In a real implementation, this would involve a request to the issuer
      // and verification of the user's identity
      
      // For demo purposes, we'll create a credential directly
      const newCredential = credentialService.createCredential(
        credentialType,
        issuer.id,
        'user-123', // In a real app, this would be the user's ID
        {
          // Sample attributes based on credential type
          ...(credentialType === CredentialType.KYC ? {
            kycLevel: 'advanced',
            country: 'US',
            verificationMethod: 'document',
          } : {}),
          ...(credentialType === CredentialType.DAO_MEMBERSHIP ? {
            daoName: 'zkDAO',
            membershipLevel: 'contributor',
            votingPower: 100,
          } : {}),
          ...(credentialType === CredentialType.CREDIT_SCORE ? {
            score: 750,
            reportDate: new Date().toISOString(),
          } : {}),
          ...(credentialType === CredentialType.AGE_VERIFICATION ? {
            ageVerified: true,
            ageGroup: '25-34',
          } : {}),
          ...(credentialType === CredentialType.INCOME_VERIFICATION ? {
            incomeRange: '$75,000-$100,000',
            employmentStatus: 'Full-time',
          } : {}),
        }
      );
      
      // Update the credentials list
      setCredentials(prev => [...prev, newCredential]);
      
      // Show the new credential
      setSelectedCredential(newCredential);
      
    } catch (error) {
      console.error('Error requesting credential:', error);
    }
  };
  
  const handleVerifyCrossChain = async (credential: Credential, targetChain: Chain) => {
    try {
      setIsVerifying(true);
      setVerificationResult(null);
      
      const zkBridgeService = ZkBridgeService.getInstance();
      
      // Generate a bridge proof
      const bridgeProof = await zkBridgeService.generateBridgeProof(
        credential,
        Chain.SUI, // Source chain (assuming credentials are issued on Sui)
        targetChain,
        {} // In a real implementation, this would be the ZK proof
      );
      
      // Verify the bridge proof
      const isValid = await zkBridgeService.verifyBridgeProof(bridgeProof);
      
      if (isValid) {
        // Submit a transaction with the verified credential
        const result = await zkBridgeService.submitVerifiedTransaction(
          bridgeProof,
          '0x1234567890123456789012345678901234567890', // Target contract address
          '0x' // Function data
        );
        
        setVerificationResult({
          success: true,
          txHash: result.txHash,
        });
      } else {
        setVerificationResult({
          success: false,
        });
      }
    } catch (error) {
      console.error('Error verifying credential cross-chain:', error);
      setVerificationResult({
        success: false,
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-sm text-muted-foreground">Please wait while we load your credentials</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Credentials</h1>
          <p className="text-muted-foreground">Manage your verifiable credentials and cross-chain verifications</p>
        </div>
        <Button variant="outline" asChild className="mt-4 md:mt-0">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      
      <Tabs defaultValue="my-credentials">
        <TabsList className="mb-8">
          <TabsTrigger value="my-credentials">My Credentials</TabsTrigger>
          <TabsTrigger value="request-credentials">Request Credentials</TabsTrigger>
          <TabsTrigger value="cross-chain">Cross-Chain Verification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-credentials">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.length > 0 ? (
              credentials.map((credential) => (
                <Card key={credential.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedCredential(credential)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{credential.type.replace('_', ' ').split(' ').map((word) => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}</CardTitle>
                      <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        Verified
                      </div>
                    </div>
                    <CardDescription>
                      Issued by {ISSUERS.find(i => i.id === credential.issuer)?.name || credential.issuer}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(credential.attributes).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                          <span className="text-sm font-medium">{String(value)}</span>
                        </div>
                      ))}
                      {Object.keys(credential.attributes).length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          + {Object.keys(credential.attributes).length - 3} more attributes
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Expires: {new Date(credential.expirationDate).toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCredential(credential);
                      document.getElementById('cross-chain-tab')?.click();
                    }}>
                      Verify Cross-Chain
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="text-xl font-semibold mb-2">No Credentials Yet</div>
                <div className="text-sm text-muted-foreground mb-6">
                  You don't have any credentials yet. Request your first credential to get started.
                </div>
                <Button onClick={() => document.getElementById('request-tab')?.click()}>
                  Request Credential
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="request-credentials" id="request-tab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ISSUERS.map((issuer) => (
              <Card key={issuer.id}>
                <CardHeader>
                  <CardTitle>{issuer.name}</CardTitle>
                  <CardDescription>Credential Issuer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm">
                      Available credential types:
                    </div>
                    <div className="space-y-2">
                      {issuer.types.map((type) => (
                        <div key={type} className="flex justify-between items-center">
                          <span>{type.replace('_', ' ').split(' ').map((word) => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRequestCredential(issuer, type)}
                          >
                            Request
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    <a href={issuer.url} target="_blank" rel="noopener noreferrer" className="underline">
                      Visit issuer website
                    </a>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="cross-chain" id="cross-chain-tab">
          {selectedCredential ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Credential</CardTitle>
                  <CardDescription>
                    {selectedCredential.type.replace('_', ' ').split(' ').map((word) => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')} issued by {ISSUERS.find(i => i.id === selectedCredential.issuer)?.name || selectedCredential.issuer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(selectedCredential.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                        <span className="text-sm font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Chain Verification</CardTitle>
                  <CardDescription>
                    Verify this credential on another blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Target Chain
                      </label>
                      <select 
                        className="w-full p-2 border rounded-md bg-background"
                        value={targetChain}
                        onChange={(e) => setTargetChain(e.target.value as Chain)}
                      >
                        {Object.values(Chain).filter(chain => chain !== Chain.SUI).map((chain) => (
                          <option key={chain} value={chain}>
                            {chain.charAt(0).toUpperCase() + chain.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleVerifyCrossChain(selectedCredential, targetChain)}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify on Selected Chain'}
                    </Button>
                    
                    {verificationResult && (
                      <div className={`p-4 rounded-md ${verificationResult.success ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
                        {verificationResult.success ? (
                          <div>
                            <div className="font-medium mb-1">Verification Successful!</div>
                            <div className="text-sm">
                              Transaction Hash: <span className="font-mono text-xs break-all">{verificationResult.txHash}</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium mb-1">Verification Failed</div>
                            <div className="text-sm">
                              Please try again or contact support if the issue persists.
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-xl font-semibold mb-2">No Credential Selected</div>
              <div className="text-sm text-muted-foreground mb-6">
                Please select a credential from "My Credentials" tab to verify it across chains.
              </div>
              <Button onClick={() => document.getElementById('my-credentials-tab')?.click()}>
                View My Credentials
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 