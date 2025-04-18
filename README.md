# Arbitrage Finder Bot

A Node.js-based bot that searches for and logs arbitrage opportunities across multiple DEXes on EVM chains.

## Features

- Monitors token prices across multiple DEXes on various EVM chains (Ethereum, BSC, Arbitrum, Polygon, Avalanche, Base)
- Identifies arbitrage opportunities with configurable minimum profit threshold
- Logs detailed information about found opportunities, including:
  - Token pair names
  - Profit percentage
  - Source (chain and DEXes)
  - Lifespan (when the opportunity disappears)
- Supports multiple EVM chains with focus on high-volume/low-fee networks
- Configurable polling intervals
- Detailed logging
- Mock data generation for testing without live RPC connections

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Access to EVM chain RPC endpoints

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/arbitrage-finder-bot.git
cd arbitrage-finder-bot
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template and configure it:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your RPC URLs:
```
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
BSC_RPC_URL=https://bsc-dataseed.binance.org/
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
POLYGON_RPC_URL=https://polygon-rpc.com
AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc
BASE_RPC_URL=https://mainnet.base.org
```

## Configuration

The bot is configurable through the `config/config.js` file:

- **Chains**: Add or remove chains to monitor
- **DEXes**: Configure which DEXes to check on each chain
- **Token Pairs**: Define which token pairs to monitor for arbitrage
- **Min Profit Percentage**: Set the minimum profit threshold for logging opportunities (default: 0.3%)
- **Polling Interval**: How often to check for arbitrage (in milliseconds)
- **Mock Settings**: Configure mock data generation for testing

## Usage

### Live Mode

Start the bot in live mode (using real blockchain data):

```bash
npm start
```

### Mock Mode (For Testing)

To run with mock data (without requiring RPC connections):

1. Edit your `.env` file to enable mock mode:
```
MOCK_ENABLED=true
MOCK_VOLATILITY=0.5
MOCK_OPPORTUNITY_FREQUENCY=0.3
```

2. Start the bot:
```bash
npm start
```

The bot will:
1. Initialize and connect to configured chains (or generate mock data)
2. Start monitoring token prices on the specified DEXes
3. Log any arbitrage opportunities found that meet the minimum profit threshold
4. Continue monitoring at the configured interval
5. Track how long each opportunity remains available

## Logs

The bot generates two main log files in the `logs` directory:

- `arbitrage.log`: General application logs
- `opportunities.log`: Detailed logs of arbitrage opportunities found

Example opportunity log:
```
ARBITRAGE OPPORTUNITY FOUND
Token Pair: WETH/USDT
Profit Percentage: 0.7523%
Source: Ethereum - Uniswap V2 -> Sushiswap
Lifespan: 12.45s
Timestamp: 2023-05-01T12:34:56.789Z
End Timestamp: 2023-05-01T12:35:09.234Z
```

## Finding the Best Arbitrage Opportunities

Based on current market data, these chains and DEXes typically offer good arbitrage opportunities:

1. **Layer 2 Solutions and Sidechains**:
   - **Arbitrum**: Low fees with high trading volume (especially for GMX vs SushiSwap)
   - **Polygon**: Very low fees and good liquidity on QuickSwap and SushiSwap
   - **Base**: Emerging ecosystem with sometimes inefficient pricing on new DEXes

2. **High-Volume Pairs**:
   - ETH/USDC and ETH/USDT across different DEXes
   - Stablecoin pairs (USDC/USDT/DAI)
   - Newly listed tokens on multiple DEXes

3. **Market Conditions**:
   - Periods of high volatility create more arbitrage opportunities
   - Flash crashes or sudden price movements often lead to price discrepancies
   - Token migrations or bridge events between chains

## Extending

You can extend the bot by:

1. Adding more chains in the `config/config.js` file
2. Adding more DEXes on existing chains
3. Monitoring additional token pairs
4. Implementing execution logic to automatically execute profitable trades
5. Adding cross-chain arbitrage detection by comparing prices across different networks

## Disclaimer

This bot is for informational purposes only. It does not execute trades automatically. The user is responsible for verifying opportunities and executing trades manually. Always be aware of the risks involved in cryptocurrency trading. 