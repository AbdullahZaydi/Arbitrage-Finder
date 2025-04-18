/**
 * Analytics utility for analyzing arbitrage opportunity data
 */
const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

// Statistics for arbitrage opportunities
const stats = {
  totalOpportunities: 0,
  activeDuration: [],
  profitRanges: {
    '0-0.5%': 0,
    '0.5-1.0%': 0,
    '1.0-2.0%': 0,
    '2.0%+': 0
  },
  chainCounts: {},
  dexCounts: {},
  pairCounts: {},
  hourlyDistribution: Array(24).fill(0),
  potentialProfits: [],
  startTime: Date.now()
};

/**
 * Record a new arbitrage opportunity in statistics
 * @param {Object} opportunity - The arbitrage opportunity
 */
function recordOpportunity(opportunity) {
  const {
    tokenPair,
    profitPercentage,
    sourceChain,
    sourceDex,
    targetDex,
    timestamp,
    endTimestamp,
    rawData
  } = opportunity;
  
  // Increment total count
  stats.totalOpportunities++;
  
  // Record duration if complete
  if (endTimestamp) {
    const durationSec = (endTimestamp - timestamp) / 1000;
    stats.activeDuration.push(durationSec);
  }
  
  // Count by profit range
  if (profitPercentage < 0.5) {
    stats.profitRanges['0-0.5%']++;
  } else if (profitPercentage < 1.0) {
    stats.profitRanges['0.5-1.0%']++;
  } else if (profitPercentage < 2.0) {
    stats.profitRanges['1.0-2.0%']++;
  } else {
    stats.profitRanges['2.0%+']++;
  }
  
  // Count by chain
  if (!stats.chainCounts[sourceChain]) {
    stats.chainCounts[sourceChain] = 0;
  }
  stats.chainCounts[sourceChain]++;
  
  // Count by DEX
  const dexPair = `${sourceDex}-${targetDex}`;
  if (!stats.dexCounts[dexPair]) {
    stats.dexCounts[dexPair] = 0;
  }
  stats.dexCounts[dexPair]++;
  
  // Count by token pair
  if (!stats.pairCounts[tokenPair]) {
    stats.pairCounts[tokenPair] = 0;
  }
  stats.pairCounts[tokenPair]++;
  
  // Count by hour of day
  const hour = new Date(timestamp).getHours();
  stats.hourlyDistribution[hour]++;
  
  // Record potential profit if available
  if (rawData) {
    const baseAmount = 1; // 1 ETH/BNB/etc.
    const profit = baseAmount * (rawData.sellPrice - rawData.buyPrice);
    stats.potentialProfits.push({
      tokenPair,
      profit,
      profitPercentage,
      timestamp
    });
  }
}

/**
 * Get current arbitrage statistics
 * @returns {Object} - Statistics object
 */
function getArbitrageStats() {
  const avgDuration = stats.activeDuration.length > 0
    ? stats.activeDuration.reduce((sum, val) => sum + val, 0) / stats.activeDuration.length
    : 0;
  
  // Sort data for better readability
  const sortedChains = Object.entries(stats.chainCounts)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
  
  const sortedDexes = Object.entries(stats.dexCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
  
  const sortedPairs = Object.entries(stats.pairCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
  
  // Calculate max profit opportunity
  let maxProfitOpp = null;
  if (stats.potentialProfits.length > 0) {
    maxProfitOpp = stats.potentialProfits.reduce((max, current) => 
      current.profitPercentage > (max ? max.profitPercentage : 0) ? current : max, null);
  }
  
  // Calculate total potential profit
  const totalPotentialProfit = stats.potentialProfits.reduce((sum, p) => sum + p.profit, 0);
  
  // Calculate runtime duration
  const runtimeMs = Date.now() - stats.startTime;
  const runtimeHours = runtimeMs / (1000 * 60 * 60);
  
  // Calculate opportunities per hour
  const oppsPerHour = runtimeHours > 0 ? stats.totalOpportunities / runtimeHours : 0;
  
  const peakHour = stats.hourlyDistribution.indexOf(Math.max(...stats.hourlyDistribution));
  
  return {
    totalOpportunities: stats.totalOpportunities,
    averageDurationSeconds: avgDuration.toFixed(2),
    profitRanges: stats.profitRanges,
    topChains: sortedChains,
    topDexPairs: sortedDexes,
    topTokenPairs: sortedPairs,
    peakHour,
    hourlyDistribution: stats.hourlyDistribution,
    maxProfitOpportunity: maxProfitOpp,
    totalPotentialProfit: totalPotentialProfit,
    runtimeHours: runtimeHours.toFixed(2),
    opportunitiesPerHour: oppsPerHour.toFixed(2)
  };
}

/**
 * Format a value with percentage
 * @param {number} value - Raw count
 * @param {number} total - Total count
 * @returns {string} - Formatted string with percentage
 */
function formatWithPercentage(value, total) {
  if (!total) return `${value} (0.0%)`;
  return `${value} (${((value / total) * 100).toFixed(1)}%)`;
}

/**
 * Create a simple horizontal bar chart
 * @param {Object} data - Data object
 * @param {number} maxWidth - Max width of the bar
 * @returns {string} - ASCII bar chart
 */
function createBarChart(data, maxWidth = 40) {
  const entries = Object.entries(data);
  
  if (entries.length === 0) return "No data";
  
  // Find the maximum value
  const maxValue = Math.max(...entries.map(([_, v]) => v));
  
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => {
      const barLength = Math.round((value / maxValue) * maxWidth);
      const bar = '█'.repeat(barLength);
      return `${key.padEnd(25)}: ${bar} ${value}`;
    })
    .join('\n');
}

/**
 * Log current statistics to console and file
 */
function logStatistics() {
  const currentStats = getArbitrageStats();
  
  // Create a horizontal bar chart for hourly distribution
  const hourChart = Array(24)
    .fill(0)
    .map((_, hour) => {
      const count = currentStats.hourlyDistribution[hour];
      const barLength = Math.round((count / Math.max(...currentStats.hourlyDistribution)) * 20);
      const bar = barLength > 0 ? '█'.repeat(barLength) : '';
      return `${hour.toString().padStart(2, '0')}:00 ${bar} ${count}`;
    })
    .join('\n');
  
  const statsLog = `
╔═══════════════════════════════════════════════════
║ 📊 ARBITRAGE OPPORTUNITY STATISTICS 📊
╠═══════════════════════════════════════════════════
║ Runtime: ${currentStats.runtimeHours} hours
║ Total Opportunities: ${currentStats.totalOpportunities} (${currentStats.opportunitiesPerHour}/hour)
║ Average Duration: ${currentStats.averageDurationSeconds}s
║ 
║ 💰 PROFIT DISTRIBUTION
║ ──────────────────────────────────────────────────
║ 0-0.5%:   ${formatWithPercentage(currentStats.profitRanges['0-0.5%'], currentStats.totalOpportunities)}
║ 0.5-1.0%: ${formatWithPercentage(currentStats.profitRanges['0.5-1.0%'], currentStats.totalOpportunities)}
║ 1.0-2.0%: ${formatWithPercentage(currentStats.profitRanges['1.0-2.0%'], currentStats.totalOpportunities)}
║ 2.0%+:    ${formatWithPercentage(currentStats.profitRanges['2.0%+'] || 0, currentStats.totalOpportunities)}
║ 
║ 🏆 MOST PROFITABLE OPPORTUNITY
║ ──────────────────────────────────────────────────
${currentStats.maxProfitOpportunity ? `║ Pair: ${currentStats.maxProfitOpportunity.tokenPair}
║ Profit: ${currentStats.maxProfitOpportunity.profitPercentage.toFixed(4)}%
║ Potential Gain: ${currentStats.maxProfitOpportunity.profit.toFixed(6)}
║ Timestamp: ${new Date(currentStats.maxProfitOpportunity.timestamp).toISOString()}` : '║ No profit data recorded yet'}
║ 
║ 💎 TOP CHAINS
║ ──────────────────────────────────────────────────
║ ${createBarChart(currentStats.topChains).split('\n').join('\n║ ')}
║ 
║ 🔄 TOP DEX PAIRS
║ ──────────────────────────────────────────────────
║ ${createBarChart(currentStats.topDexPairs).split('\n').join('\n║ ')}
║ 
║ 🪙 TOP TOKEN PAIRS
║ ──────────────────────────────────────────────────
║ ${createBarChart(currentStats.topTokenPairs).split('\n').join('\n║ ')}
║ 
║ 🕒 HOURLY DISTRIBUTION
║ ──────────────────────────────────────────────────
║ ${hourChart.split('\n').join('\n║ ')}
║ Peak Activity Hour: ${currentStats.peakHour}:00
╚═══════════════════════════════════════════════════
`;

  logger.info(statsLog);
  
  // Write to stats file
  try {
    const statsFile = path.join(process.cwd(), 'logs', 'statistics.log');
    fs.writeFileSync(statsFile, statsLog);
  } catch (error) {
    logger.error(`Failed to write statistics to file: ${error.message}`);
  }
  
  return currentStats;
}

module.exports = {
  recordOpportunity,
  getArbitrageStats,
  logStatistics
}; 