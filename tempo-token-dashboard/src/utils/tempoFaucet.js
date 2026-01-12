// Mock faucet claim function
export const claimFromFaucet = async (address, tokenSymbol = 'TEMP') => {
  // In a real implementation, this would call the Tempo faucet API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
        amount: tokenSymbol === 'TEMP' ? '10' : '100',
        symbol: tokenSymbol
      });
    }, 1500);
  });
};