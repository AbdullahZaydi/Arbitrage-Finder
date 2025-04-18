/**
 * Test script for running the arbitrage finder bot with real data
 * focusing on two high-volume, low-fee chains: Arbitrum and Polygon
 */
require('dotenv').config();

const { loadConfigFromEnv } = require('./src/utils/config-loader');
const { focusOnChains, focusOnTokenPairs } = require('./src/utils/test-helpers');
const { logger } = require('./src/utils/logger');
const { getPricesAcrossDexes } = require('./src/utils/price');
const { findArbitrageOpportunities, processArbitrageOpportunities } = require('./src/utils/arbitrage');
const { logStatistics } = require('./src/utils/analytics');

// Load base config
let config = loadConfigFromEnv();

// These two chains have high volume and low fees
const HIGH_VOLUME_CHAINS = [42161, 137]; // Arbitrum and Polygon

// Choose test mode:
const TEST_MODE = process.argv[2] || 'high-volume';

// Configure the test
switch (TEST_MODE) {
  case 'high-volume':
    // Focus on Arbitrum and Polygon (high volume, low fees)
    config = focusOnChains(HIGH_VOLUME_CHAINS);
    break;
  
  case 'arbitrum':
    // Focus only on Arbitrum 
    config = focusOnChains([42161]);
    break;
  
  case 'polygon':
    // Focus only on Polygon
    config = focusOnChains([137]);
    break;
    
  case 'top-pairs':
    // Focus on specific high-volume pairs on the two chains
    config = focusOnTokenPairs([
      // Arbitrum pairs (high volume)
      { chainId: 42161, base: 'WETH', quote: 'USDC' },
      { chainId: 42161, base: 'WETH', quote: 'USDT' },
      { chainId: 42161, base: 'ARB', quote: 'WETH' },
      
      // Polygon pairs (high volume)
      { chainId: 137, base: 'WMATIC', quote: 'USDC' },
      { chainId: 137, base: 'WETH', quote: 'USDC' },
      { chainId: 137, base: 'WMATIC', quote: 'WETH' }
    ]);
    break;
    
  default:
    logger.info('Using default configuration with Arbitrum and Polygon');
    config = focusOnChains(HIGH_VOLUME_CHAINS);
}

// Set a more frequent polling interval for testing
config.pollingInterval = 15000; // 15 seconds (to avoid rate limiting)

// Store the last check time
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
    
    // Log price data for debugging
    prices.forEach(price => {
      logger.info(`${price.pair} on ${price.dex}: ${price.price}`);
    });
    
    // Find arbitrage opportunities
    const opportunities = findArbitrageOpportunities(prices);
    
    // Process and log opportunities
    processArbitrageOpportunities(opportunities);
    
    // Log the number of opportunities found
    if (opportunities.length > 0) {
      logger.info(`Found ${opportunities.length} arbitrage opportunities for ${tokenPair.base}/${tokenPair.quote}`);
    }
    
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
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  logger.info(`Finished checking all pairs. Next check in ${config.pollingInterval / 1000}s`);
  
  // Log statistics every 3 cycles
  if (++cycleCount % 3 === 0) {
    logStatistics();
  }
}

/**
 * Initialize the test run
 */
let cycleCount = 0;
let running = true;

async function runTest() {
  logger.info('Starting real data test for Arbitrage Finder Bot');
  logger.info(`Testing with ${config.tokenPairs.length} token pairs across ${config.chains.length} chains`);
  logger.info(`Test mode: ${TEST_MODE}`);
  
  // Set a maximum runtime (15 minutes for testing)
  const MAX_RUNTIME = 15 * 60 * 1000; // 15 minutes
  const startTime = Date.now();
  
  // Initial check
  await checkAllArbitrageOpportunities();
  
  // Run for the specified time duration with regular polling
  while (running && (Date.now() - startTime < MAX_RUNTIME)) {
    // Wait for the polling interval
    await new Promise(resolve => setTimeout(resolve, config.pollingInterval));
    
    // Run the next check
    await checkAllArbitrageOpportunities();
  }
  
  // Log final statistics
  logger.info('Test run completed. Final statistics:');
  logStatistics();
  
  logger.info('Real data test finished.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Test interrupted by user.');
  running = false;
});

// Run the test
runTest().catch(error => {
  logger.error(`Error in test run: ${error.message}`);
  process.exit(1);
}); 