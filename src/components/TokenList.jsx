import React, { useState } from 'react';
import TokenCard from './TokenCard';
import { ArrowsUpDownIcon, FunnelIcon } from '@heroicons/react/24/outline';

const TokenList = ({ 
  tokens, 
  favorites, 
  onToggleFavorite, 
  onRemoveToken, 
  onClaimFaucet,
  walletConnected 
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const displayTokens = showFavorites ? favorites : tokens;

  const sortedTokens = [...displayTokens].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'balance') return parseFloat(b.balance) - parseFloat(a.balance);
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {showFavorites ? 'Favorite Tokens' : 'All Tokens'}
          <span className="badge badge-lg badge-primary ml-2">
            {displayTokens.length}
          </span>
        </h2>
        
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline">
              <FunnelIcon className="h-5 w-5" />
              Sort: {sortBy}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={() => setSortBy('name')}>By Name</button></li>
              <li><button onClick={() => setSortBy('balance')}>By Balance</button></li>
            </ul>
          </div>
          
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`btn ${showFavorites ? 'btn-primary' : 'btn-outline'}`}
          >
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </button>
        </div>
      </div>

      {displayTokens.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold">No tokens found</h3>
          <p className="text-gray-500">
            {showFavorites 
              ? 'You have no favorite tokens yet' 
              : 'Add your first token using the search above'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTokens.map((token) => (
            <TokenCard
              key={token.address}
              token={token}
              onToggleFavorite={onToggleFavorite}
              onRemove={onRemoveToken}
              onClaimFaucet={onClaimFaucet}
              walletConnected={walletConnected}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenList;