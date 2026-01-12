import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ERC20_ABI, DEFAULT_TOKENS, STORAGE_KEYS } from '../utils/constants';
import { isValidAddress, formatBalance, getTokenLogo } from '../utils/helpers';

export const useTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_TOKENS);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITE_TOKENS, JSON.stringify(favorites));
  }, [favorites]);

  // Add a new token
  const addToken = useCallback(async (address, walletAddress) => {
    if (!isValidAddress(address)) {
      setError('Invalid Ethereum address');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check if token already exists
      const existingToken = tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
      if (existingToken) {
        setError('Token already added');
        setLoading(false);
        return existingToken;
      }

      // Create contract instance
      const contract = new ethers.Contract(address, ERC20_ABI, await provider.getSigner());
      
      // Fetch token details
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals()
      ]);

      const logo = getTokenLogo(symbol);
      
      const newToken = {
        address,
        name,
        symbol,
        decimals,
        logo,
        balance: '0',
        isFavorite: false
      };

      // Fetch balance if wallet is connected
      if (walletAddress) {
        const balance = await contract.balanceOf(walletAddress);
        newToken.balance = formatBalance(balance.toString(), decimals);
      }

      setTokens(prev => [...prev, newToken]);
      setLoading(false);
      return newToken;

    } catch (err) {
      setError('Failed to fetch token details. Please check the address.');
      setLoading(false);
      return null;
    }
  }, [tokens]);

  // Remove a token
  const removeToken = useCallback((address) => {
    setTokens(prev => prev.filter(token => token.address !== address));
    removeFromFavorites(address);
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((address) => {
    const tokenIndex = tokens.findIndex(t => t.address === address);
    if (tokenIndex === -1) return;

    const updatedTokens = [...tokens];
    updatedTokens[tokenIndex].isFavorite = !updatedTokens[tokenIndex].isFavorite;
    
    setTokens(updatedTokens);
    
    if (updatedTokens[tokenIndex].isFavorite) {
      setFavorites(prev => [...prev, updatedTokens[tokenIndex]]);
    } else {
      setFavorites(prev => prev.filter(t => t.address !== address));
    }
  }, [tokens]);

  // Remove from favorites
  const removeFromFavorites = useCallback((address) => {
    setFavorites(prev => prev.filter(t => t.address !== address));
    setTokens(prev => prev.map(token => 
      token.address === address ? { ...token, isFavorite: false } : token
    ));
  }, []);

  // Refresh all token balances
  const refreshBalances = useCallback(async (walletAddress) => {
    if (!walletAddress) return;

    setLoading(true);
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const updatedTokens = await Promise.all(
      tokens.map(async (token) => {
        try {
          if (token.isNative) {
            // For native token
            const balance = await provider.getBalance(walletAddress);
            return {
              ...token,
              balance: formatBalance(balance.toString(), token.decimals)
            };
          } else {
            // For ERC20 tokens
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const balance = await contract.balanceOf(walletAddress);
            return {
              ...token,
              balance: formatBalance(balance.toString(), token.decimals)
            };
          }
        } catch (err) {
          return token;
        }
      })
    );

    setTokens(updatedTokens);
    setLoading(false);
  }, [tokens]);

  return {
    tokens,
    favorites,
    loading,
    error,
    addToken,
    removeToken,
    toggleFavorite,
    removeFromFavorites,
    refreshBalances,
    setError
  };
};