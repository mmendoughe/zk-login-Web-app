import { ethers } from "ethers";
import { VerifierMetaData } from "../../lib/abi";
import deployedAddresses from '../../lib/deployed_addresses.js';

// Return object for the contract interaction functions.
class Result {
  constructor(tx, message) {
    this.tx = tx;
    this.message = message;
  }
}

// Helper function to initialize the contract
async function initializeContract(provider) {
  if (!provider) {
    throw new Error("Provider not set");
  }
  const signer = await provider.getSigner();
  const address = provider.getAddress();

  const cAddr = deployedAddresses["MappingContractModule#MappingContract"];
  const cABI = JSON.parse(VerifierMetaData.ABI);
  const verifier = new ethers.Contract(cAddr, cABI, signer);
  return { verifier, address };
}

// Helper function to parse proof
function parseProof(input) {
  let proof;
  try {
    proof = JSON.parse(input);
  } catch {
    throw new Error("Invalid format of proof. Make sure to copy the complete proof");
  }
  if (proof.a.length !== 2 || proof.b.length !== 2 || proof.c.length !== 2) {
    throw new Error("Invalid format of proof. Make sure to copy the complete proof");
  }
  return proof;
}

// Helper function to parse hash
function parseHash(hashes) {
  let outputHash;
  try {
    outputHash = JSON.parse(hashes);
  } catch (error) {
    throw new Error("Hash has invalid format. Make sure to copy the hash correctly.");
  }
  if (!outputHash || outputHash.length !== 2) {
    throw new Error("Hash has invalid format. Make sure to copy the hash correctly.");
  }
  return outputHash;
}

// Helper function to format proof
function formatProof(proof) {
  let bx = [String(proof.b[0][0]), String(proof.b[0][1])];
  let by = [String(proof.b[1][0]), String(proof.b[1][1])];
  const a = { X: String(proof.a[0]), Y: String(proof.a[1]) };
  const b = { X: bx, Y: by };
  const c = { X: String(proof.c[0]), Y: String(proof.c[1]) };
  return { a, b, c };
}

// Verify the proof of the user.
async function verifyProof(input, nameNum, nonce, provider) {
  try {
    const { verifier, address } = await initializeContract(provider);
    const proof = parseProof(input);
    const formattedProof = formatProof(proof);
    const args = [nameNum, nonce, formattedProof];
    const tx = await verifier.verifyProof(...args, {
      from: address,
      gasLimit: 1000000,
    });
    console.log("VerifyProof Tx:", tx);
    return new Result(tx, null);
  } catch (error) {
    console.error(error.message);
    return new Result(null, error.message);
  }
}

// Change the password of the user.
async function changePassword(input, hashes, nameNum, nonce, provider) {
  try {
    const { verifier, address } = await initializeContract(provider);
    const proof = parseProof(input);
    const outputHash = parseHash(hashes);
    const formattedProof = formatProof(proof);
    const args = [nameNum, nonce, formattedProof, outputHash[0], outputHash[1]];
    const tx = await verifier.changePassword(...args, {
      from: address,
      gasLimit: 1000000,
    });
    const receipt = await tx.wait();
    if (receipt.status === 0) {
      throw new Error("Transaction failed.");
    }
    const updatedReceipt = await provider.getTransactionReceipt(tx.hash);
    if (updatedReceipt.status === 0) {
      throw new Error("Transaction failed.");
    }
    console.log("changePassword Tx:", tx);
    return new Result(tx, null);
  } catch (error) {
    console.error(error.message);
    return new Result(null, error.message);
  }
}

// Add a new user to the contract.
async function addUser(userNameNum, input, nonce, hashes, provider) {
  try {
    const { verifier } = await initializeContract(provider);
    const proof = parseProof(input);
    const outputHash = parseHash(hashes);
    const formattedProof = formatProof(proof);
    const args = [userNameNum, nonce, formattedProof, outputHash[0], outputHash[1]];
    const tx = await verifier.addUser(...args, {
      from: provider.getAddress(),
      gasLimit: 1000000,
    });
    const receipt = await tx.wait();
    if (receipt.status === 0) {
      throw new Error("Transaction failed.");
    }
    const updatedReceipt = await provider.getTransactionReceipt(tx.hash);
    if (updatedReceipt.status === 0) {
      throw new Error("Transaction failed.");
    }
    console.log("AddUser Tx:", tx);
    return new Result(tx, null);
  } catch (error) {
    console.error("Error adding user:", error.message);
    return new Result(null, error.message);
  }
}

export {
  verifyProof,
  changePassword,
  addUser
};
