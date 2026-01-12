// Validate Ethereum address
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Format token balance
export const formatBalance = (balance, decimals = 18) => {
  if (!balance) return "0";
  const formatted = balance / Math.pow(10, decimals);
  return formatted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
};

// Truncate address
export const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Get token logo
export const getTokenLogo = (symbol) => {
  const logos = {
    'TEMP': '🟣',
    'USDT': '💵',
    'USDC': '💲',
    'DAI': '🎯',
    'LINK': '🔗',
    'UNI': '🦄',
    'AAVE': '👻',
    'default': '🪙'
  };
  return logos[symbol] || logos.default;
};