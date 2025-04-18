const config = require('../../config/config');
const { logger, opportunityLogger } = require('./logger');
const { recordOpportunity, logStatistics } = require('./analytics');

// Store active arbitrage opportunities
const activeOpportunities = new Map();

// Track statistics logging interval
let lastStatsTime = Date.now();
const STATS_INTERVAL = 3600000; // Log stats every hour

/**
 * Calculate potential profit for arbitrage between two DEXes
 * @param {Object} price1 - Price info from first DEX
 * @param {Object} price2 - Price info from second DEX
 * @returns {Object} - Arbitrage opportunity details
 */
function calculateArbitrage(price1, price2) {
  if (!price1 || !price2) return null;
  
  const { price: price1Value, dex: dex1Name, pair, chainId } = price1;
  const { price: price2Value, dex: dex2Name } = price2;
  
  // Calculate price difference
  const priceDiff = Math.abs(price1Value - price2Value);
  
  // Calculate profit percentage
  let profitPercentage;
  let buyDex, sellDex;
  
  if (price1Value < price2Value) {
    // Buy on DEX1, sell on DEX2
    profitPercentage = ((price2Value - price1Value) / price1Value) * 100;
    buyDex = dex1Name;
    sellDex = dex2Name;
  } else {
    // Buy on DEX2, sell on DEX1
    profitPercentage = ((price1Value - price2Value) / price2Value) * 100;
    buyDex = dex2Name;
    sellDex = dex1Name;
  }
  
  // Get chain name
  const chain = config.chains.find(c => c.id === chainId);
  const chainName = chain ? chain.name : `Chain ${chainId}`;
  
  return {
    tokenPair: pair,
    profitPercentage,
    sourceChain: chainName,
    sourceDex: buyDex,
    targetDex: sellDex,
    timestamp: Date.now(),
    rawData: {
      buyPrice: price1Value < price2Value ? price1Value : price2Value,
      sellPrice: price1Value < price2Value ? price2Value : price1Value
    }
  };
}

/**
 * Find arbitrage opportunities from price data
 * @param {Array} priceData - Array of price info from different DEXes
 * @returns {Array} - Array of arbitrage opportunities
 */
function findArbitrageOpportunities(priceData) {
  const opportunities = [];
  
  // Check if we have at least 2 prices to compare
  if (priceData.length < 2) {
    return opportunities;
  }
  
  // Compare each DEX with every other DEX
  for (let i = 0; i < priceData.length; i++) {
    for (let j = i + 1; j < priceData.length; j++) {
      const arbitrage = calculateArbitrage(priceData[i], priceData[j]);
      
      if (arbitrage && arbitrage.profitPercentage >= config.minProfitPercentage) {
        opportunities.push(arbitrage);
      }
    }
  }
  
  return opportunities;
}

/**
 * Process and log arbitrage opportunities
 * @param {Array} opportunities - Array of arbitrage opportunities
 */
function processArbitrageOpportunities(opportunities) {
  const currentTime = Date.now();
  
  // Process new opportunities
  opportunities.forEach(opportunity => {
    const oppKey = `${opportunity.tokenPair}-${opportunity.sourceDex}-${opportunity.targetDex}`;
    
    if (!activeOpportunities.has(oppKey)) {
      // New opportunity
      logger.info(`New arbitrage opportunity found: ${opportunity.tokenPair} - ${opportunity.profitPercentage.toFixed(2)}%`);
      
      // Log the opportunity
      opportunityLogger.log(opportunity);
      
      // Add to active opportunities
      activeOpportunities.set(oppKey, opportunity);
      
      // Record for analytics
      recordOpportunity(opportunity);
    } else {
      // Update existing opportunity
      const existingOpp = activeOpportunities.get(oppKey);
      
      // Update profit percentage
      existingOpp.profitPercentage = opportunity.profitPercentage;
      existingOpp.rawData = opportunity.rawData;
      
      // Update the map
      activeOpportunities.set(oppKey, existingOpp);
    }
  });
  
  // Check for expired opportunities
  const activeKeys = Array.from(activeOpportunities.keys());
  const currentOpps = opportunities.map(o => `${o.tokenPair}-${o.sourceDex}-${o.targetDex}`);
  
  activeKeys.forEach(key => {
    if (!currentOpps.includes(key)) {
      // Opportunity no longer exists
      const expiredOpp = activeOpportunities.get(key);
      expiredOpp.endTimestamp = currentTime;
      
      // Log the expired opportunity
      logger.info(`Arbitrage opportunity ended: ${expiredOpp.tokenPair} - Lifespan: ${((currentTime - expiredOpp.timestamp) / 1000).toFixed(2)}s`);
      opportunityLogger.log(expiredOpp);
      
      // Record complete opportunity for analytics
      recordOpportunity(expiredOpp);
      
      // Remove from active opportunities
      activeOpportunities.delete(key);
    }
  });
  
  // Log statistics periodically
  if (currentTime - lastStatsTime > STATS_INTERVAL) {
    logStatistics();
    lastStatsTime = currentTime;
  }
}

module.exports = {
  findArbitrageOpportunities,
  processArbitrageOpportunities
}; 