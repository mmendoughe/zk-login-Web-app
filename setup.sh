#!/bin/bash

echo "Setting up zk-login project..."

# Navigate to the server directory and run the initial Zokrates setup
echo "Navigating to the server directory..."
cd server

echo "Running the Zokrates setup..."
# Compile the Zokrates proof generation file
zokrates compile -i proof_generation/proof_gen.zok

# Perform the setup phase
zokrates setup

# Export a Solidity verifier
zokrates export-verifier -o ../contracts/contracts/verifier.sol

# Navigate to the contracts directory
echo "Navigating to the contracts directory..."
cd ../contracts

# Compile contracts using Hardhat
echo "Cleaning and compiling contracts with Hardhat..."
npx hardhat clean
npx hardhat compile

# Open a new terminal and start the Hardhat node
echo "Starting Hardhat node in a new terminal window..."
gnome-terminal -- bash -c "cd $(pwd) && npx hardhat node"

# Give some time for the Hardhat node to start
sleep 5

# Deploy contracts using Hardhat Ignition
echo "Deploying contracts with Hardhat Ignition..."
npx hardhat ignition deploy ./ignition/modules/Verify.js --network localhost
npx hardhat ignition deploy ./ignition/modules/Mapping.js --network localhost

# Print instructions for adding Hardhat network to MetaMask
echo "Please add the following network configuration to MetaMask:"
echo "Network Name: Hardhat"
echo "New RPC URL: http://127.0.0.1:8545/"
echo "Chain ID: 31337"
echo "You can use any of the provided secret keys except the first 2 from the node and import them in MetaMask."

# Navigate back to the project root directory
echo "Navigating back to the project root directory..."
cd ..

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the project
echo "Starting the development server..."
npm start

echo "Setup complete. You can view the proof-generation-tool at http://localhost:3000 and the login-provider at http://localhost:3002."