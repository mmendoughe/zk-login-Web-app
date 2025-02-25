#!/bin/bash

# Define the source and destination paths for the JSON file
DEPLOYED_ADDRESSES_PATH="./Contracts/ignition/deployments/chain-31337/deployed_addresses.json"
DESTINATION_PATH="./Service-Provider/src/lib/deployed_addresses.js"

# Install dependencies
echo "Installing dependencies..."
npm install

# Function to detect the OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS=Linux;;
        Darwin*)    OS=Mac;;
        CYGWIN*|MINGW*|MSYS*|Windows_NT) OS=Windows;;
        *)          OS="UNKNOWN";;
    esac
    echo "Detected OS: $OS"
}

# Function to open a new terminal and run a command
open_new_terminal() {
    CMD=$1
    case $OS in
        Linux)
            gnome-terminal -- bash -c "$CMD; exec bash"
            ;;
        Mac)
            osascript -e "tell application \"Terminal\" to do script \"$CMD\""
            ;;
        Windows)
            start "" wt -w 0 nt --title "Hardhat Node" bash -c "$CMD; exec bash"
            ;;
        *)
            echo "Unsupported OS"
            exit 1
            ;;
    esac
}

detect_os

echo "Setting up zk-login project..."

# Navigate to the PGT-Frontend-Backend directory and run the initial Zokrates setup
echo "Navigating to the server directory..."
cd PGT-Backend

echo "Running the Zokrates setup..."
# Compile the Zokrates proof generation file
zokrates compile -i proof_generation/proof_gen.zok

# Perform the setup phase
zokrates setup

# Export a Solidity verifier
zokrates export-verifier -o ../Contracts/contracts/verifier.sol
sleep 4
# Navigate to the Contracts directory
echo "Navigating to the contracts directory..."
cd ../Contracts

# Compile Contracts using Hardhat
echo "Cleaning and compiling contracts with Hardhat..."
npx hardhat clean
npx hardhat compile

# Open a new terminal and start the Hardhat node
echo "Starting Hardhat node in a new terminal window..."
open_new_terminal "cd $(pwd) && npx hardhat node"

# Give some time for the Hardhat node to start
sleep 10

# Deploy Contracts using Hardhat Ignition
echo "Deploying contracts with Hardhat Ignition..."
npx hardhat ignition deploy ./ignition/modules/Verify.js --network localhost

# Wait until deployment is complete so mapping can use address of verifier contract
sleep 10

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

echo "Copying deployed_addresses.json to the other project..."
echo "module.exports = " > $DESTINATION_PATH
cat $DEPLOYED_ADDRESSES_PATH >> $DESTINATION_PATH
echo ";" >> $DESTINATION_PATH

sleep 2

# Run the project
echo "Starting the development server..."
npm start

echo "Setup complete. You can view the proof-generation-tool at http://localhost:3000 and the login-provider at http://localhost:3002."