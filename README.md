# Abstract Global Wallet Connect Demo

A modern React application that demonstrates how to integrate Abstract Global Wallet (AGW) for wallet connection and transaction functionality.

## Features

- **Native Abstract Global Wallet Integration**: Uses the official @abstract-foundation/agw-react package
- **Modern UI**: Beautiful gradient design with glassmorphism effects
- **Responsive Design**: Works on desktop and mobile devices
- **Wallet Connection**: Connect to Abstract Global Wallet with a single click
- **Transaction Support**: Send test transactions using the connected wallet
- **Balance Display**: Shows wallet address and balance after connection
- **Production Ready**: Optimized build for deployment on Vercel

## Local Development

1. Install dependencies:
`ash
npm install --legacy-peer-deps
`

2. Start the development server:
`ash
npm start
`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Production Build

1. Create production build:
`ash
npm run build
`

2. Test production build locally:
`ash
npx serve -s build -l 3000
`

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
`ash
npm install -g vercel
`

2. Deploy:
`ash
vercel
`

3. Follow the prompts to configure your deployment.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect it's a React app and deploy it

### Option 3: Deploy Build Folder

1. Create production build:
`ash
npm run build
`

2. Upload the uild folder to Vercel or use the Vercel CLI:
`ash
vercel --prod
`

## Configuration

The app is configured to use the Abstract testnet by default. To switch to mainnet, change the chain in src/App.js:

`javascript
// For testnet (current)
import { abstractTestnet } from "viem/chains";

// For mainnet
import { abstract } from "viem/chains";
`

## Dependencies

- @abstract-foundation/agw-react: Official Abstract Global Wallet React integration
- @abstract-foundation/agw-client: Abstract Global Wallet client
- wagmi: React hooks for Ethereum
- iem: TypeScript interface for Ethereum
- @tanstack/react-query: Data fetching and caching
- eact: React library
- eact-dom: React DOM rendering
- @privy-io/cross-app-connect: Required dependency for AGW

## Usage

1. Click "Connect with Abstract Global Wallet" to connect your wallet
2. Once connected, you'll see your wallet address and balance
3. Use the "Send Test Transaction" button to send a test transaction
4. Check the browser console for transaction details

## Browser Support

This application works in all modern browsers that support:
- ES6+ features
- Web3 wallet extensions
- Abstract Global Wallet

## License

MIT License
