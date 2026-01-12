import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TEMPO_TESTNET, STORAGE_KEYS } from '../utils/constants';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED);
    if (wasConnected === 'true' && window.ethereum) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
      }
    } catch (err) {
      console.error('Failed to check connection:', err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Check if connected to Tempo Testnet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);

      if (currentChainId !== TEMPO_TESTNET.chainIdDecimal) {
        await switchToTempoNetwork();
      }

      setAccount(accounts[0]);
      setProvider(provider);
      setChainId(currentChainId);
      
      // Save connection state
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');

      // Setup event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

    } catch (err) {
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToTempoNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TEMPO_TESTNET.chainId }]
      });
    } catch (switchError) {
      // If network not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: TEMPO_TESTNET.chainId,
              chainName: TEMPO_TESTNET.name,
              rpcUrls: [TEMPO_TESTNET.rpcUrl],
              nativeCurrency: {
                name: 'Tempo',
                symbol: 'TEMP',
                decimals: 18
              },
              blockExplorerUrls: [TEMPO_TESTNET.explorerUrl]
            }]
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId) => {
    setChainId(parseInt(newChainId, 16));
  };

  return {
    account,
    chainId,
    isConnecting,
    provider,
    connectWallet,
    disconnectWallet,
    switchToTempoNetwork
  };
};