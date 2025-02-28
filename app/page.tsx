import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            zkPassport
          </span>
        </h1>
        <p className="text-xl text-center mb-12 max-w-2xl mx-auto text-muted-foreground">
          Your Cross-Chain Privacy Identity Solution
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4">Zero-Knowledge Identity</h2>
            <p className="mb-4 text-muted-foreground">
              Prove your credentials across blockchains without revealing your personal data. 
              zkPassport uses zero-knowledge proofs to maintain your privacy while verifying your identity.
            </p>
            <Link 
              href="/credentials" 
              className={buttonVariants({ variant: "outline" })}
            >
              View Credentials
            </Link>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4">Cross-Chain Verification</h2>
            <p className="mb-4 text-muted-foreground">
              Access DApps on multiple blockchains with a single identity. 
              Our zkBridge integration allows your credentials to be verified across chains securely.
            </p>
            <Link 
              href="/dashboard" 
              className={buttonVariants({ variant: "outline" })}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="bg-card rounded-xl p-8 shadow-sm border mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Authenticate</h3>
              <p className="text-sm text-muted-foreground">Sign in with zkLogin using your social accounts like Google or Facebook</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Generate Proofs</h3>
              <p className="text-sm text-muted-foreground">Create zero-knowledge proofs of your credentials without revealing sensitive data</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Verify Cross-Chain</h3>
              <p className="text-sm text-muted-foreground">Use your credentials across different blockchains with Polyhedra's zkBridge</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg" })}
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </main>
  );
}
