# zk-login

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

### Setup zokrates

Follow the [instructions](https://zokrates.github.io/gettingstarted.html) to install zokrates.

#### Setup via setup.sh

If you are working with Linux or macOS, you can run 
`chmod +x setup.sh` and
`./setup.sh`
to compile zokrates, deploy the contracts and start the project,
then skip to section Hardhat on Metamask.

#### Manual Setup
Run
`chmod +x /server/dev.sh`
`./server/dev.sh`
to generate the verifier.sol file.

Navigate to the contracts directory:
`cd contracts`

Follow the other instructions.

### Compile
Open repository and run:
`npx hardhat clean`
`npx hardhat compile`

### Deploy
Open another terminal, navigate to the repository and type:
`npx hardhat node`

Go back to the previous window and run these commands:

`npx hardhat ignition deploy ./ignition/modules/Verify.js --network localhost`

`npx hardhat ignition deploy ./ignition/modules/Mapping.js --network localhost`

## Hardhat on Metamask
This should now allow you to make contract calls.
You can use any of the provided secret keys except the first 2 from the node and import them in MetaMask.

Then add the Hardhat Node to the Networks:

Network Name: Hardhat
New RPC URL: http://127.0.0.1:8545/
Chain ID: 31337

## Run project

navigate back to the root of the project.

In the project directory, you can run:
### `npm install`

Installs all dependencies in /client, /login-provider and /server.

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3002) to view the proof-generation-tool in your browser.
Open [http://localhost:3002](http://localhost:3002) to view the login-provider in your browser.
