'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginButton } from './LoginButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginPage() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  
  const handleLogin = (address: string) => {
    setAddress(address);
    // Redirect to dashboard after successful login
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign in to zkPassport</CardTitle>
          <CardDescription className="text-center">
            Use your social account to sign in securely with zkLogin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {address ? (
            <div className="text-center">
              <div className="mb-4 text-green-500 font-semibold">
                Successfully logged in!
              </div>
              <div className="p-3 bg-muted rounded-md overflow-hidden text-xs break-all">
                {address}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Redirecting to dashboard...
              </div>
            </div>
          ) : (
            <Tabs defaultValue="google">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
              </TabsList>
              <TabsContent value="google" className="mt-0">
                <LoginButton provider="google" onLogin={handleLogin} />
              </TabsContent>
              <TabsContent value="facebook" className="mt-0">
                <LoginButton provider="facebook" onLogin={handleLogin} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-center text-muted-foreground">
            By signing in, you agree to the zkPassport Terms of Service and Privacy Policy.
          </div>
          <div className="text-xs text-center">
            <span className="text-muted-foreground">How it works: </span>
            zkLogin uses zero-knowledge proofs to verify your identity without revealing your personal information.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 