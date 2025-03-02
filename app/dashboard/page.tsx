'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZkLoginService } from '@/lib/zklogin/zkLoginService';
import { CredentialService } from '@/lib/zklogin/credentialService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const handleLogout = () => {
    const zkLoginService = ZkLoginService.getInstance();
    zkLoginService.clearState();
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-sm text-muted-foreground">Please wait while we load your dashboard</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your cross-chain identity and credentials</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="mt-4 md:mt-0">
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your zkPassport Address</CardTitle>
            <CardDescription>Your unique identifier across chains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted rounded-md overflow-hidden text-xs break-all">
              {address}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Verified Chains</CardTitle>
            <CardDescription>Blockchains where your identity is verified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Ethereum</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Polygon</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Sui</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href="/credentials">Manage Verifications</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your zkPassport account status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="font-medium">Active</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Your account is active and in good standing
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Your Credentials</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {credentials.map((credential) => (
          <Card key={credential.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{credential.type.replace('_', ' ').split(' ').map((word: string) => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}</CardTitle>
                <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                  Verified
                </div>
              </div>
              <CardDescription>Issued by {credential.issuer}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(credential.attributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                    <span className="text-sm font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-xs text-muted-foreground">
                Expires: {new Date(credential.expirationDate).toLocaleDateString()}
              </div>
              <Button variant="outline" size="sm">Verify Cross-Chain</Button>
            </CardFooter>
          </Card>
        ))}
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Add New Credential</CardTitle>
            <CardDescription>Get a new credential from an issuer</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button variant="outline" asChild>
              <Link href="/credentials">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add Credential
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 