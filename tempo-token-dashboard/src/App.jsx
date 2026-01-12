import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import TokenSearch from './components/TokenSearch';
import TokenList from './components/TokenList';
import FaucetClaim from './components/FaucetClaim';
import { useTokens } from './hooks/useTokens';
import { useWallet } from './hooks/useWallet';
import { claimFromFaucet } from './utils/tempoFaucet';
import { DEFAULT_TOKENS } from './utils/constants';

function App() {
  const { account, provider } = useWallet();
  const {
    tokens,
    favorites,
    loading,
    error,
    addToken,
    removeToken,
    toggleFavorite,
    refreshBalances
  } = useTokens();

  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Initialize with default tokens
  useEffect(() => {
    if (tokens.length === 0) {
      const initialTokens = DEFAULT_TOKENS.map(token => ({
        ...token,
        balance: '0',
        isFavorite: false
      }));
      // In a real app, you would set these tokens
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh || !account) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, account]);

  const handleAddToken = async (address) => {
    const token = await addToken(address, account);
    return token !== null;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalances(account);
    setLastRefreshed(Date.now());
    setRefreshing(false);
    toast.success('Balances refreshed!');
  };

  const handleClaimFaucet = async (symbol) => {
    return await claimFromFaucet(account, symbol);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" />
      
      <Header 
        onRefresh={handleRefresh}
        refreshing={refreshing}
        lastRefreshed={lastRefreshed}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>⚠️ {error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TokenSearch 
              onAddToken={handleAddToken}
              loading={loading}
            />

            <TokenList
              tokens={tokens}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onRemoveToken={removeToken}
              onClaimFaucet={handleClaimFaucet}
              walletConnected={!!account}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <FaucetClaim account={account} />

            {/* Auto Refresh Toggle */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Auto Refresh</h2>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Enable auto-refresh (30s)</span>
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Automatically refresh token balances every 30 seconds
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Dashboard Stats</h2>
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Total Tokens</div>
                    <div className="stat-value">{tokens.length}</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-title">Favorite Tokens</div>
                    <div className="stat-value">{favorites.length}</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-title">Wallet Status</div>
                    <div className="stat-value">
                      {account ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">ℹ️ About Tempo Testnet</h3>
            <p>
              Tempo Testnet is a Gelato-powered L2 rollup for testing decentralized applications. 
              This dashboard helps you manage test tokens and interact with the network.
            </p>
            <div className="card-actions justify-end">
              <a 
                href="https://docs.tempo.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
              >
                Documentation
              </a>
              <a 
                href="https://testnet.tempolabs.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
              >
                Explorer
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;