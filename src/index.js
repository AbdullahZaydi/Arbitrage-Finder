require('dotenv').config();
const schedule = require('node-schedule');
const { loadConfigFromEnv } = require('./utils/config-loader');
const config = loadConfigFromEnv();
const { logger } = require('./utils/logger');
const { getPricesAcrossDexes } = require('./utils/price');
const { findArbitrageOpportunities, processArbitrageOpportunities } = require('./utils/arbitrage');

// Store last check time
let lastCheckTime = Date.now();

/**
 * Check for arbitrage opportunities for a specific token pair
 * @param {Object} tokenPair - Token pair object { chainId, base, quote }
 */
async function checkArbitrageForPair(tokenPair) {
  try {
    logger.info(`Checking arbitrage for ${tokenPair.base}/${tokenPair.quote} on chain ${tokenPair.chainId}`);
    
    // Get prices across DEXes
    const prices = await getPricesAcrossDexes(config.dexes, tokenPair);
    
    if (prices.length < 2) {
      logger.info(`Not enough DEXes with liquidity for ${tokenPair.base}/${tokenPair.quote}`);
      return;
    }
    
    // Find arbitrage opportunities
    const opportunities = findArbitrageOpportunities(prices);
    
    // Process and log opportunities
    processArbitrageOpportunities(opportunities);
    
    // Update last check time
    lastCheckTime = Date.now();
  } catch (error) {
    logger.error(`Error checking arbitrage for ${tokenPair.base}/${tokenPair.quote}: ${error.message}`);
  }
}

/**
 * Main function to check all token pairs for arbitrage opportunities
 */
async function checkAllArbitrageOpportunities() {
  logger.info(`Checking all arbitrage opportunities at ${new Date().toISOString()}`);
  
  // Process each token pair in sequence to avoid rate limiting
  for (const tokenPair of config.tokenPairs) {
    await checkArbitrageForPair(tokenPair);
    
    // Add a small delay between checks to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  logger.info(`Finished checking all pairs. Next check in ${config.pollingInterval / 1000}s`);
}

/**
 * Initialize the arbitrage finder bot
 */
async function initBot() {
  logger.info('Initializing Arbitrage Finder Bot');
  logger.info(`Configured to check ${config.tokenPairs.length} token pairs across ${config.chains.length} chains`);
  logger.info(`Minimum profit percentage: ${config.minProfitPercentage}%`);
  logger.info(`Polling interval: ${config.pollingInterval / 1000} seconds`);
  
  // Initial check
  await checkAllArbitrageOpportunities();
  
  // Schedule regular checks
  setInterval(checkAllArbitrageOpportunities, config.pollingInterval);
  
  logger.info(`Bot initialized and running. Checking every ${config.pollingInterval / 1000} seconds`);
}

// Start the bot
initBot().catch(error => {
  logger.error(`Error initializing bot: ${error.message}`);
  process.exit(1);
}); 