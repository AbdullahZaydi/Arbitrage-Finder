/**
 * Mock data generator for testing arbitrage opportunities
 */
const config = require('../../config/config');
const { logger } = require('./logger');

// Cache for mock prices
const mockPrices = new Map();

// Create initial price points for all token pairs
function initializeMockPrices() {
  // Base prices for major tokens in USD
  const basePrices = {
    'WETH': 2500,
    'WBNB': 350,
    'WMATIC': 0.8,
    'WAVAX': 25,
    'USDC': 1,
    'USDT': 1,
    'DAI': 1,
    'BUSD': 1,
    'USDbC': 1,
    'LINK': 15,
    'UNI': 8,
    'AAVE': 120,
    'CAKE': 2.5,
    'ARB': 1.5,
    'cbETH': 2600,
    'SHIB': 0.00002,
    'ADA': 0.5,
    'DOT': 7.5
  };

  // Generate initial prices for all token pairs on all DEXes
  config.tokenPairs.forEach(pair => {
    const { chainId, base, quote } = pair;
    
    // Get DEXes for this chain
    const dexes = config.dexes.filter(dex => dex.chainId === chainId);
    
    // Calculate base price
    let basePrice;
    if (quote === 'USDC' || quote === 'USDT' || quote === 'DAI' || quote === 'BUSD' || quote === 'USDbC') {
      // Direct price in USD
      basePrice = basePrices[base];
    } else {
      // Calculate price in terms of quote token
      basePrice = basePrices[base] / basePrices[quote];
    }
    
    // Generate slightly different prices for each DEX
    dexes.forEach(dex => {
      // Add some variation (+/- 0.5%)
      const variation = 1 + (Math.random() * 0.01 - 0.005);
      const price = basePrice * variation;
      
      // Store in mock prices
      const key = `${chainId}-${base}-${quote}-${dex.name}`;
      mockPrices.set(key, {
        dex: dex.name,
        chainId,
        pair: `${base}/${quote}`,
        price,
        liquidity: {
          baseToken: (1000000 / basePrices[base]).toFixed(4),
          quoteToken: 1000000
        },
        timestamp: Date.now()
      });
    });
  });
  
  logger.info(`Initialized mock prices for ${mockPrices.size} DEX-pair combinations`);
}

/**
 * Update mock prices to simulate market movements and create arbitrage opportunities
 */
function updateMockPrices() {
  // Update each price with some random movement
  mockPrices.forEach((priceData, key) => {
    const parts = key.split('-');
    const chainId = parseInt(parts[0]);
    const base = parts[1];
    const quote = parts[2];
    const dexName = parts[3];
    
    // Apply random price movement
    const volatility = config.mockSettings.volatility || 0.5;
    const movement = (Math.random() * 0.02 - 0.01) * volatility;
    
    // Update price
    let newPrice = priceData.price * (1 + movement);
    
    // Occasionally create an arbitrage opportunity
    if (Math.random() < config.mockSettings.opportunityFrequency) {
      // Find other DEXes with the same pair
      const samePair = Array.from(mockPrices.entries())
        .filter(([k, v]) => 
          k !== key && 
          k.startsWith(`${chainId}-${base}-${quote}-`)
        )
        .map(([k, v]) => v);
      
      if (samePair.length > 0) {
        // Pick a random DEX
        const otherDex = samePair[Math.floor(Math.random() * samePair.length)];
        
        // Create price discrepancy
        const minProfit = config.minProfitPercentage / 100;
        const discrepancy = minProfit + (Math.random() * minProfit * 2);
        
        // 50% chance of price being higher or lower
        if (Math.random() > 0.5) {
          newPrice = otherDex.price * (1 + discrepancy);
        } else {
          newPrice = otherDex.price * (1 - discrepancy);
        }
        
        logger.debug(`Created mock arbitrage opportunity for ${base}/${quote} between ${dexName} and ${otherDex.dex}`);
      }
    }
    
    // Update timestamp
    priceData.price = newPrice;
    priceData.timestamp = Date.now();
  });
}

/**
 * Get mock prices for a specific token pair on all DEXes for a chain
 * @param {Array} dexes - Array of DEX config objects
 * @param {Object} tokenPair - Token pair object { chainId, base, quote }
 * @returns {Array} - Array of price information
 */
function getMockPrices(dexes, tokenPair) {
  const { chainId, base, quote } = tokenPair;
  
  // Initialize prices if needed
  if (mockPrices.size === 0) {
    initializeMockPrices();
  }
  
  // Update prices for this cycle
  updateMockPrices();
  
  // Get prices for the requested pair from all relevant DEXes
  const chainDexes = dexes.filter(dex => dex.chainId === chainId);
  const prices = [];
  
  chainDexes.forEach(dex => {
    const key = `${chainId}-${base}-${quote}-${dex.name}`;
    if (mockPrices.has(key)) {
      prices.push({...mockPrices.get(key)});
    }
  });
  
  return prices;
}

module.exports = {
  getMockPrices
}; 