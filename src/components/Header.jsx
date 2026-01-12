import React from 'react';
import { TempoLogo, RefreshButton } from './ui/Icons';
import ConnectWallet from './ConnectWallet';

const Header = ({ onRefresh, refreshing, lastRefreshed }) => {
  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          <div className="flex items-center gap-2">
            <TempoLogo className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold">Tempo Testnet Dashboard</h1>
              <p className="text-xs text-gray-500">Manage your testnet tokens</p>
            </div>
          </div>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <div className="flex items-center gap-4">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="btn btn-outline btn-sm"
            >
              <RefreshButton refreshing={refreshing} />
              {refreshing ? 'Refreshing...' : 'Refresh Balances'}
            </button>
            
            {lastRefreshed && (
              <span className="text-sm text-gray-500">
                Last: {new Date(lastRefreshed).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="navbar-end">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;