import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { TEMPO_TESTNET } from '../utils/constants';
import { truncateAddress } from '../utils/helpers';
import { WalletIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ConnectWallet = () => {
  const { account, chainId, isConnecting, connectWallet, disconnectWallet, switchToTempoNetwork } = useWallet();

  const isCorrectNetwork = chainId === TEMPO_TESTNET.chainIdDecimal;

  return (
    <div className="flex items-center gap-2">
      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn btn-primary"
        >
          {isConnecting ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <WalletIcon className="h-5 w-5" />
              Connect Wallet
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {!isCorrectNetwork && (
            <button
              onClick={switchToTempoNetwork}
              className="btn btn-warning btn-sm"
            >
              Switch to Tempo
            </button>
          )}
          <div className="badge badge-lg badge-primary">
            {truncateAddress(account)}
          </div>
          <button
            onClick={disconnectWallet}
            className="btn btn-outline btn-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;