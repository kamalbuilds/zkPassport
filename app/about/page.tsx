import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About zkPassport</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Our Vision</h2>
          <p>
            zkPassport is a decentralized identity system that lets users prove credentials (e.g., KYC, DAO membership, age) 
            across multiple blockchains without revealing personal data. We combine zero-knowledge proofs for privacy, 
            account abstraction for user experience, and cross-chain verification for interoperability.
          </p>
          
          <h2>The Problem We're Solving</h2>
          <p>
            In today's fragmented blockchain ecosystem, users face several challenges:
          </p>
          <ul>
            <li>Having to repeatedly verify their identity on different chains</li>
            <li>Exposing personal information when proving credentials</li>
            <li>Managing complex wallet interactions and gas payments</li>
            <li>Lack of interoperability between identity systems</li>
          </ul>
          
          <h2>Our Solution</h2>
          <p>
            zkPassport addresses these challenges through a comprehensive approach:
          </p>
          
          <h3>1. Privacy-Preserving Authentication</h3>
          <p>
            Using zkLogin, users can authenticate with familiar social accounts (Google, Facebook) while generating 
            zero-knowledge proofs that verify their identity without revealing personal information.
          </p>
          
          <h3>2. Account Abstraction</h3>
          <p>
            Our implementation of ERC-4337 smart contract wallets simplifies the user experience by:
          </p>
          <ul>
            <li>Enabling gasless transactions (sponsored by applications)</li>
            <li>Supporting payment in any token, not just the chain's native token</li>
            <li>Allowing batch transactions and automation</li>
            <li>Providing enhanced security with social recovery</li>
          </ul>
          
          <h3>3. Cross-Chain Credential Verification</h3>
          <p>
            Through Polyhedra's zkBridge technology, zkPassport enables:
          </p>
          <ul>
            <li>Verifying credentials issued on one chain across any supported blockchain</li>
            <li>Maintaining privacy throughout the verification process</li>
            <li>Trustless verification without relying on centralized bridges or oracles</li>
          </ul>
          
          <h2>Technical Architecture</h2>
          <p>
            zkPassport consists of three core components:
          </p>
          
          <h3>Credential Issuance</h3>
          <p>
            Trusted entities (KYC providers, DAOs, etc.) issue credentials as zero-knowledge proofs. 
            These credentials are stored in the user's zkPassport wallet and can be selectively disclosed.
          </p>
          
          <h3>Smart Contract Wallet</h3>
          <p>
            Our ERC-4337 compliant wallet manages credentials, handles cross-chain interactions, 
            and provides a seamless user experience with features like gasless transactions.
          </p>
          
          <h3>Cross-Chain Verification</h3>
          <p>
            When a user needs to prove a credential on another chain, zkPassport generates a cross-chain 
            proof using Polyhedra's zkBridge, which can be verified on the target chain without revealing 
            the underlying credential data.
          </p>
          
          <h2>Use Cases</h2>
          <p>
            zkPassport enables numerous privacy-preserving applications:
          </p>
          <ul>
            <li><strong>Private DeFi Access:</strong> Prove KYC compliance without revealing identity</li>
            <li><strong>Cross-Chain Governance:</strong> Vote in DAOs across multiple chains with a single identity</li>
            <li><strong>Age Verification:</strong> Prove you're of legal age without revealing your birthdate</li>
            <li><strong>Credential-Gated Access:</strong> Access exclusive content or services based on verifiable credentials</li>
          </ul>
          
          <h2>Join Us</h2>
          <p>
            We're building a more private, user-friendly, and interoperable blockchain ecosystem. 
            Try zkPassport today and experience the future of decentralized identity.
          </p>
          
          <div className="flex justify-center mt-8">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 