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