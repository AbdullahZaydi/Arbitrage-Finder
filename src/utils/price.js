const { ethers } = require('ethers');
const { getTokenAddresses, getPairAddress, getPairContract, getTokenContract } = require('./blockchain');
const { logger } = require('./logger');
const config = require('../../config/config');
const { getMockPrices } = require('./mock-data');

/**
 * Get token price from a DEX
 * @param {Object} dex - DEX configuration object
 * @param {string} baseToken - Base token symbol (e.g., WETH)
 * @param {string} quoteToken - Quote token symbol (e.g., USDT)
 * @returns {Promise<Object>} - Price information
 */
async function getTokenPrice(dex, baseToken, quoteToken) {
  try {
    const { token0Address, token1Address } = getTokenAddresses(dex.chainId, baseToken, quoteToken);
    
    // Get pair address from factory
    const pairAddress = await getPairAddress(dex, token0Address, token1Address);
    
    if (pairAddress === ethers.constants.AddressZero) {
      logger.warn(`No liquidity pair found for ${baseToken}/${quoteToken} on ${dex.name}`);
      return null;
    }
    
    // Get pair contract
    const pairContract = getPairContract(dex, pairAddress);
    
    // Get reserves
    const [reserve0, reserve1] = await pairContract.getReserves();
    
    // Get token contract to check decimals
    const baseTokenContract = getTokenContract(dex.chainId, baseToken);
    const quoteTokenContract = getTokenContract(dex.chainId, quoteToken);
    
    const baseTokenDecimals = await baseTokenContract.decimals();
    const quoteTokenDecimals = await quoteTokenContract.decimals();
    
    // Check token order in the pair
    const token0 = await pairContract.token0();
    const baseIsToken0 = token0.toLowerCase() === token0Address.toLowerCase();
    
    // Calculate price based on reserves
    let price;
    if (baseIsToken0) {
      price = ethers.utils.formatUnits(reserve1.mul(ethers.utils.parseUnits('1', baseTokenDecimals)).div(reserve0), quoteTokenDecimals);
    } else {
      price = ethers.utils.formatUnits(reserve0.mul(ethers.utils.parseUnits('1', baseTokenDecimals)).div(reserve1), quoteTokenDecimals);
    }
    
    return {
      dex: dex.name,
      chainId: dex.chainId,
      pair: `${baseToken}/${quoteToken}`,
      price: parseFloat(price),
      liquidity: {
        baseToken: ethers.utils.formatUnits(baseIsToken0 ? reserve0 : reserve1, baseTokenDecimals),
        quoteToken: ethers.utils.formatUnits(baseIsToken0 ? reserve1 : reserve0, quoteTokenDecimals)
      },
      timestamp: Date.now()
    };
  } catch (error) {
    logger.error(`Error getting price for ${baseToken}/${quoteToken} on ${dex.name}: ${error.message}`);
    return null;
  }
}

/**
 * Get prices for a token pair across multiple DEXes
 * @param {Array} dexes - Array of DEX configuration objects
 * @param {Object} tokenPair - Token pair object { chainId, base, quote }
 * @returns {Promise<Array>} - Array of price information
 */
async function getPricesAcrossDexes(dexes, tokenPair) {
  const { chainId, base, quote } = tokenPair;
  
  // If mock mode is enabled, use mock data
  if (config.mockSettings && config.mockSettings.enabled) {
    return getMockPrices(dexes, tokenPair);
  }
  
  // Filter DEXes by chain ID
  const chainDexes = dexes.filter(dex => dex.chainId === chainId);
  
  if (chainDexes.length === 0) {
    logger.warn(`No DEXes found for chain ID ${chainId}`);
    return [];
  }
  
  // Get prices from all DEXes in parallel
  const pricePromises = chainDexes.map(dex => getTokenPrice(dex, base, quote));
  const prices = await Promise.all(pricePromises);
  
  // Filter out null prices (errors or no liquidity)
  return prices.filter(price => price !== null);
}

module.exports = {
  getTokenPrice,
  getPricesAcrossDexes
}; 