/**
 * Utility to load and update configuration from environment variables
 */
const config = require('../../config/config');

/**
 * Update config with environment variables
 */
function loadConfigFromEnv() {
  // Update min profit percentage if specified
  if (process.env.MIN_PROFIT_PERCENTAGE) {
    const minProfit = parseFloat(process.env.MIN_PROFIT_PERCENTAGE);
    if (!isNaN(minProfit)) {
      config.minProfitPercentage = minProfit;
    }
  }
  
  // Update polling interval if specified
  if (process.env.POLLING_INTERVAL) {
    const interval = parseInt(process.env.POLLING_INTERVAL);
    if (!isNaN(interval) && interval > 0) {
      config.pollingInterval = interval;
    }
  }
  
  // Update chain RPC URLs if specified
  config.chains.forEach(chain => {
    if (chain.name === 'Ethereum' && process.env.ETH_RPC_URL) {
      chain.rpc = process.env.ETH_RPC_URL;
    } else if (chain.name === 'BSC' && process.env.BSC_RPC_URL) {
      chain.rpc = process.env.BSC_RPC_URL;
    } else if (chain.name === 'Arbitrum' && process.env.ARBITRUM_RPC_URL) {
      chain.rpc = process.env.ARBITRUM_RPC_URL;
    } else if (chain.name === 'Polygon' && process.env.POLYGON_RPC_URL) {
      chain.rpc = process.env.POLYGON_RPC_URL;
    } else if (chain.name === 'Avalanche' && process.env.AVAX_RPC_URL) {
      chain.rpc = process.env.AVAX_RPC_URL;
    } else if (chain.name === 'Base' && process.env.BASE_RPC_URL) {
      chain.rpc = process.env.BASE_RPC_URL;
    }
  });
  
  // Update mock data settings if specified
  if (!config.mockSettings) {
    config.mockSettings = {};
  }
  
  // Enable mock data if specified
  if (process.env.MOCK_ENABLED) {
    config.mockSettings.enabled = process.env.MOCK_ENABLED.toLowerCase() === 'true';
  }
  
  // Update mock volatility if specified
  if (process.env.MOCK_VOLATILITY) {
    const volatility = parseFloat(process.env.MOCK_VOLATILITY);
    if (!isNaN(volatility) && volatility >= 0 && volatility <= 1) {
      config.mockSettings.volatility = volatility;
    }
  }
  
  // Update mock opportunity frequency if specified
  if (process.env.MOCK_OPPORTUNITY_FREQUENCY) {
    const freq = parseFloat(process.env.MOCK_OPPORTUNITY_FREQUENCY);
    if (!isNaN(freq) && freq >= 0 && freq <= 1) {
      config.mockSettings.opportunityFrequency = freq;
    }
  }
  
  return config;
}

module.exports = {
  loadConfigFromEnv
}; 