const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const fs = require("fs");
const path = require("path");

module.exports = buildModule("MappingContractModule", (m) => {
  // Path to the deployed addresses JSON file
  const deployedAddressesPath = path.join(__dirname, "../deployments/chain-31337/deployed_addresses.json");

  // Read the deployed addresses JSON file
  const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, "utf8"));

  // Get the address of the first contract
  const verifierAddress = deployedAddresses["VerifyModule#Verifier"];
  console.log(verifierAddress)
  const mapping = m.contract("MappingContract", [verifierAddress]);

  return { mapping };
});