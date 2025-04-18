const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define custom format for console output
const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'arbitrage-finder' },
  transports: [
    // Write logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        consoleFormat
      )
    }),
    // Write all logs to arbitrage.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'arbitrage.log') 
    }),
    // Write all arbitrage opportunities to opportunities.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'opportunities.log'),
      level: 'info'
    })
  ]
});

// Create a special logger just for arbitrage opportunities
const opportunityLogger = {
  log: (opportunity) => {
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
    
    const lifespan = endTimestamp ? `${((endTimestamp - timestamp) / 1000).toFixed(2)}s` : 'Active';
    const profitColor = profitPercentage >= 2.0 ? '🔥' : profitPercentage >= 1.0 ? '💰' : profitPercentage >= 0.5 ? '✅' : '⚡';
    
    // Format price data if available
    let priceInfo = '';
    if (rawData) {
      priceInfo = `
Buy Price: ${rawData.buyPrice.toFixed(6)} on ${sourceDex}
Sell Price: ${rawData.sellPrice.toFixed(6)} on ${targetDex}
Price Difference: ${(rawData.sellPrice - rawData.buyPrice).toFixed(6)} (${profitPercentage.toFixed(4)}%)`;
    }
    
    // Calculate potential profit on 1 ETH (or equivalent base token)
    let potentialProfit = '';
    if (rawData) {
      const baseAmount = 1; // 1 ETH/BNB/etc.
      const profit = baseAmount * (rawData.sellPrice - rawData.buyPrice);
      potentialProfit = `
Estimated Profit for ${baseAmount} ${tokenPair.split('/')[0]}: ${profit.toFixed(6)} ${tokenPair.split('/')[1]}`;
    }
    
    const message = `
╔════════════════════════════════════════════════════
║ ${profitColor} ARBITRAGE OPPORTUNITY ${endTimestamp ? 'ENDED' : 'FOUND'} ${profitColor}
╠════════════════════════════════════════════════════
║ Token Pair: ${tokenPair}
║ Network: ${sourceChain}
║ Profit: ${profitPercentage.toFixed(4)}%
║ Route: ${sourceDex} ➜ ${targetDex}${priceInfo}${potentialProfit}
║ 
║ Status: ${endTimestamp ? 'CLOSED' : 'OPEN'}
║ Lifespan: ${lifespan}
║ Detected: ${new Date(timestamp).toISOString()}
${endTimestamp ? `║ Disappeared: ${new Date(endTimestamp).toISOString()}` : ''}
╚════════════════════════════════════════════════════
`;
    
    logger.info(message);
    
    return message;
  }
};

module.exports = {
  logger,
  opportunityLogger
}; 