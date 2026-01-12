import React, { useState } from 'react';
import { claimFromFaucet } from '../utils/tempoFaucet';
import { TEMPO_TESTNET } from '../utils/constants';
import { BeakerIcon, BoltIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const FaucetClaim = ({ account }) => {
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setClaiming(true);
    
    try {
      const result = await claimFromFaucet(account, 'TEMP');
      
      if (result.success) {
        toast.success(
          <div>
            <p>Successfully claimed {result.amount} {result.symbol}!</p>
            <a 
              href={`${TEMPO_TESTNET.explorerUrl}/tx/${result.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on explorer
            </a>
          </div>
        );
      }
    } catch (error) {
      toast.error('Failed to claim from faucet');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-4">
          <BeakerIcon className="h-8 w-8" />
          <h2 className="card-title text-2xl">Tempo Faucet</h2>
        </div>
        
        <p className="mb-4">
          Get free TEST tokens from the Tempo faucet to use on the testnet. 
          You can claim once every 24 hours.
        </p>
        
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-white/20">
          <div className="stat">
            <div className="stat-title text-white">Network</div>
            <div className="stat-value text-lg">Tempo Testnet</div>
          </div>
          
          <div className="stat">
            <div className="stat-title text-white">Token</div>
            <div className="stat-value text-lg">TEMP</div>
          </div>
          
          <div className="stat">
            <div className="stat-title text-white">Amount</div>
            <div className="stat-value text-lg">10 TEMP</div>
          </div>
        </div>
        
        <div className="card-actions mt-4">
          <button
            onClick={handleClaim}
            disabled={claiming || !account}
            className="btn btn-white btn-lg w-full"
          >
            {claiming ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <BoltIcon className="h-6 w-6" />
                Claim 10 TEMP Tokens
              </>
            )}
          </button>
          
          {!account && (
            <p className="text-center text-sm opacity-80">
              Connect your wallet to claim tokens
            </p>
          )}
          
          <a
            href={TEMPO_TESTNET.faucetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-white btn-sm w-full"
          >
            Visit Official Faucet
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaucetClaim;