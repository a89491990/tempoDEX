// Tempo Testnet Configuration
export const TEMPO_TESTNET = {
  chainId: "0x4C4F",
  chainIdDecimal: 19528,
  name: "Tempo Testnet",
  rpcUrl: "https://tempo-testnet.gelato.digital",
  explorerUrl: "https://testnet.tempolabs.xyz",
  faucetUrl: "https://tempo-testnet.gelato.digital/faucet"
};

// ERC20 ABI (Simplified)
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

// Default tokens for Tempo Testnet
export const DEFAULT_TOKENS = [
  {
    address: "0x0e451119b343167227cc8027510f45601ebd50b5", // TEMP (Native)
    name: "Tempo",
    symbol: "TEMP",
    decimals: 18,
    logo: "🟣",
    isNative: true
  },
  {
    address: "0x7af963cF6D228E564e2A0aA0DdBF06241B832A8C", // USDT Test
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logo: "💵"
  },
  {
    address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", // LINK Test
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
    logo: "🔗"
  }
];

// Local storage keys
export const STORAGE_KEYS = {
  FAVORITE_TOKENS: 'tempo-favorite-tokens',
  WALLET_CONNECTED: 'tempo-wallet-connected'
};