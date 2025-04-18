/**
 * Test helper utilities for the arbitrage finder bot
 */
const config = require('../../config/config');
const { logger } = require('./logger');

/**
 * Filter config to focus on specific chains for testing
 * @param {Array} chainIds - Array of chain IDs to include
 * @returns {Object} - Filtered config
 */
function focusOnChains(chainIds) {
  // Create a deep copy of the config
  const filteredConfig = JSON.parse(JSON.stringify(config));
  
  // Filter chains
  filteredConfig.chains = filteredConfig.chains.filter(chain => 
    chainIds.includes(chain.id)
  );
  
  // Filter DEXes
  filteredConfig.dexes = filteredConfig.dexes.filter(dex => 
    chainIds.includes(dex.chainId)
  );
  
  // Filter token pairs
  filteredConfig.tokenPairs = filteredConfig.tokenPairs.filter(pair => 
    chainIds.includes(pair.chainId)
  );
  
  logger.info(`Focused testing on chains: ${filteredConfig.chains.map(c => c.name).join(', ')}`);
  logger.info(`Filtered to ${filteredConfig.dexes.length} DEXes and ${filteredConfig.tokenPairs.length} token pairs`);
  
  return filteredConfig;
}

/**
 * Focus on specific token pairs for testing
 * @param {Array} tokenPairsToInclude - Array of objects {chainId, base, quote}
 * @returns {Object} - Filtered config
 */
function focusOnTokenPairs(tokenPairsToInclude) {
  // Create a deep copy of the config
  const filteredConfig = JSON.parse(JSON.stringify(config));
  
  // Filter token pairs
  filteredConfig.tokenPairs = filteredConfig.tokenPairs.filter(pair => 
    tokenPairsToInclude.some(tp => 
      tp.chainId === pair.chainId && 
      tp.base === pair.base && 
      tp.quote === pair.quote
    )
  );
  
  logger.info(`Focused testing on ${filteredConfig.tokenPairs.length} specific token pairs`);
  
  return filteredConfig;
}

/**
 * Set a very fast polling interval for quick testing
 * @param {number} intervalMs - Polling interval in milliseconds
 * @returns {Object} - Updated config
 */
function setFastPolling(intervalMs = 1000) {
  const updatedConfig = {...config};
  updatedConfig.pollingInterval = intervalMs;
  logger.info(`Set polling interval to ${intervalMs}ms for quick testing`);
  return updatedConfig;
}

module.exports = {
  focusOnChains,
  focusOnTokenPairs,
  setFastPolling
}; 