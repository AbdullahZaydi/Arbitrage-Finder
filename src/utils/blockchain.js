const { ethers } = require('ethers');
const config = require('../../config/config');
const { logger } = require('./logger');

// Cache for providers and contracts
const providers = {};
const contracts = {};

// Commonly used ABIs
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
  'function token1() view returns (address)'
];

const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) view returns (address pair)'
];

/**
 * Get provider for a specific chain
 * @param {number} chainId - Chain ID
 * @returns {ethers.providers.JsonRpcProvider} - Ethers provider
 */
function getProvider(chainId) {
  if (!providers[chainId]) {
    const chain = config.chains.find(c => c.id === chainId);
    if (!chain) {
      throw new Error(`Chain with ID ${chainId} not found in config`);
    }
    
    providers[chainId] = new ethers.providers.JsonRpcProvider(chain.rpc);
    logger.info(`Created provider for chain ${chain.name} (${chainId})`);
  }
  
  return providers[chainId];
}

/**
 * Get token contract instance
 * @param {number} chainId - Chain ID
 * @param {string} tokenSymbol - Token symbol
 * @returns {ethers.Contract} - Token contract
 */
function getTokenContract(chainId, tokenSymbol) {
  const contractKey = `token-${chainId}-${tokenSymbol}`;
  
  if (!contracts[contractKey]) {
    const chain = config.chains.find(c => c.id === chainId);
    if (!chain) {
      throw new Error(`Chain with ID ${chainId} not found in config`);
    }
    
    const tokenAddress = chain.tokenAddress[tokenSymbol];
    if (!tokenAddress) {
      throw new Error(`Token ${tokenSymbol} not found for chain ${chain.name}`);
    }
    
    const provider = getProvider(chainId);
    contracts[contractKey] = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    logger.info(`Created contract for token ${tokenSymbol} on chain ${chain.name}`);
  }
  
  return contracts[contractKey];
}

/**
 * Get DEX factory contract
 * @param {Object} dex - DEX config object
 * @returns {ethers.Contract} - Factory contract
 */
function getFactoryContract(dex) {
  const contractKey = `factory-${dex.chainId}-${dex.name}`;
  
  if (!contracts[contractKey]) {
    const provider = getProvider(dex.chainId);
    contracts[contractKey] = new ethers.Contract(dex.factoryAddress, FACTORY_ABI, provider);
    logger.info(`Created factory contract for ${dex.name} on chain ID ${dex.chainId}`);
  }
  
  return contracts[contractKey];
}

/**
 * Get pair address for a token pair on a specific DEX
 * @param {Object} dex - DEX config object
 * @param {string} token0Address - Address of first token
 * @param {string} token1Address - Address of second token
 * @returns {Promise<string>} - Pair address
 */
async function getPairAddress(dex, token0Address, token1Address) {
  const factory = getFactoryContract(dex);
  return await factory.getPair(token0Address, token1Address);
}

/**
 * Get pair contract for a token pair on a specific DEX
 * @param {Object} dex - DEX config object
 * @param {string} pairAddress - Address of the pair contract
 * @returns {ethers.Contract} - Pair contract
 */
function getPairContract(dex, pairAddress) {
  const contractKey = `pair-${dex.chainId}-${pairAddress}`;
  
  if (!contracts[contractKey]) {
    const provider = getProvider(dex.chainId);
    contracts[contractKey] = new ethers.Contract(pairAddress, PAIR_ABI, provider);
  }
  
  return contracts[contractKey];
}

/**
 * Get token addresses from symbols for a specific chain
 * @param {number} chainId - Chain ID
 * @param {string} token0Symbol - Symbol of first token
 * @param {string} token1Symbol - Symbol of second token
 * @returns {Object} - Object with token addresses
 */
function getTokenAddresses(chainId, token0Symbol, token1Symbol) {
  const chain = config.chains.find(c => c.id === chainId);
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} not found in config`);
  }
  
  const token0Address = chain.tokenAddress[token0Symbol];
  const token1Address = chain.tokenAddress[token1Symbol];
  
  if (!token0Address) {
    throw new Error(`Token ${token0Symbol} not found for chain ${chain.name}`);
  }
  
  if (!token1Address) {
    throw new Error(`Token ${token1Symbol} not found for chain ${chain.name}`);
  }
  
  return { token0Address, token1Address };
}

module.exports = {
  getProvider,
  getTokenContract,
  getFactoryContract,
  getPairAddress,
  getPairContract,
  getTokenAddresses
}; 