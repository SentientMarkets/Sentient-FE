# Sentient Markets

An Agentic decentralized prediction market platform built on Mode Network.

## Overview

Sentient Markets allows users to create and trade on prediction markets for real-world events. The platform uses blockchain technology to ensure transparency, security, and trustless execution of market outcomes.

## Features

- Create prediction markets for any real-world event
- Trade YES/NO positions on market outcomes
- Connect with Web3 wallets (MetaMask, etc.)
- View market details, prices, and trading history
- Manage your positions across multiple markets

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI, Radix UI
- **Blockchain Integration**: Wagmi, Viem
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn or npm
- A Web3 wallet (MetaMask recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hebx/sentient-markets.git
   cd sentient-markets
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Connect your Web3 wallet using the "Connect Wallet" button
2. Browse existing markets or create your own
3. Buy YES or NO positions based on your prediction
4. Manage your positions and track your performance

## Smart Contract Integration

The frontend interacts with Sentient Market smart contracts deployed on various EVM-compatible blockchains. The contracts handle:

- Market creation and initialization
- Trading mechanics (buying/selling positions)
- Market resolution and settlement
- Liquidity provision

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Blockchain integration with [Wagmi](https://wagmi.sh/)
