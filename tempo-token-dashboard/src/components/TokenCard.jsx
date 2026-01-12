import React from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon, TrashIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { formatBalance, truncateAddress } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const TokenCard = ({ token, onToggleFavorite, onRemove, onClaimFaucet, walletConnected }) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.address);
    toast.success('Address copied to clipboard!');
  };

  const handleClaim = async () => {
    if (!walletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    toast.promise(
      onClaimFaucet(token.symbol),
      {
        loading: 'Claiming tokens...',
        success: (data) => `Successfully claimed ${data.amount} ${data.symbol}!`,
        error: 'Failed to claim tokens'
      }
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{token.logo}</div>
            <div>
              <h3 className="card-title">{token.symbol}</h3>
              <p className="text-sm text-gray-500">{token.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(token.address)}
              className="btn btn-ghost btn-sm"
            >
              {token.isFavorite ? (
                <StarSolid className="h-5 w-5 text-yellow-500" />
              ) : (
                <StarIcon className="h-5 w-5" />
              )}
            </button>
            
            {!token.isNative && (
              <button
                onClick={() => onRemove(token.address)}
                className="btn btn-ghost btn-sm text-error"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500">Balance:</span>
            <span className="text-2xl font-bold">
              {token.balance} {token.symbol}
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1 cursor-pointer" onClick={handleCopyAddress}>
              <ArrowsPointingOutIcon className="h-4 w-4" />
              {truncateAddress(token.address)}
            </div>
            <div>Decimals: {token.decimals}</div>
          </div>

          {token.isNative && (
            <div className="card-actions">
              <button
                onClick={handleClaim}
                className="btn btn-accent btn-sm w-full"
                disabled={!walletConnected}
              >
                Claim {token.symbol} from Faucet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCard;