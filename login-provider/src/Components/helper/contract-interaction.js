import { ethers } from "ethers";
import { VerifierMetaData } from "../../lib/abi";

// Return object for the contract interaction functions.
class Result {
  constructor(tx, message) {
    this.tx = tx;
    this.message = message;
  }
}

// Verify the proof of the user.
async function verifyProof(input, name, nameNum, nonce, provider) {
  if (provider == null) {
    console.error("Provider not set");
  }
  console.log("getting signer");
  const signer = await provider.getSigner();
  const address = provider.getAddress();
  const cAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const cABI = JSON.parse(VerifierMetaData.ABI);
  const verifier = new ethers.Contract(cAddr, cABI, signer);

  let proof;
  try {
    console.log("Verifying tx");
    proof = JSON.parse(input);
  } catch {
    return new Result(
      null,
      "Invalid format of proof. Make sure to copy the complete proof"
    );
  }

  console.log("Proof: ", proof);
  if (proof.a.length !== 2 || proof.b.length !== 2 || proof.c.length !== 2) {
    console.log("Invalid proof");
    return new Result(
      null,
      "Invalid format of proof. Make sure to copy the complete proof"
    );
  }
  // Convert the proof to the correct format.
  let bx = new Array(2);
  bx[0] = String(proof.b[0][0]);
  bx[1] = String(proof.b[0][1]);

  let by = new Array(2);
  by[0] = String(proof.b[1][0]);
  by[1] = String(proof.b[1][1]);
  const a = {
    X: String(proof.a[0]),
    Y: String(proof.a[1]),
  };
  const b = {
    X: bx,
    Y: by,
  };
  const c = {
    X: String(proof.c[0]),
    Y: String(proof.c[1]),
  };
  try {
    const args = [name, nameNum, nonce.toString(), { a, b, c }];
    console.log("Args: ", args);
    const tx = await verifier.verifyProof(...args, {
      from: address,
      gasLimit: 1000000,
    });
    console.log("VerifyProof Tx:", tx);
    return new Result(tx, null);
  } catch (error) {
    console.log(error);
    return new Result(
      null,
      "Failed to verify proof, make sure the username is correct."
    );
  }
}

// Change the password of the user.
async function changePassword(input, hashes, name, nameNum, nonce, provider) {
  if (provider == null) {
    console.error("Provider not set");
  }
  console.log("getting signer");
  const signer = await provider.getSigner();
  const address = provider.getAddress();
  const cAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const cABI = JSON.parse(VerifierMetaData.ABI);
  const verifier = new ethers.Contract(cAddr, cABI, signer);

  let proof;
  let outputHash;

  // Convert the hash to the correct format.
  try {
    outputHash = JSON.parse(hashes);
  } catch (error) {
    console.log("Error parsing hash:", error);
    return new Result(
      null,
      "Hash has invalid format. Make sure to copy the hash correctly."
    );
  }
  if (outputHash == null) {
    console.log("Invalid hash");
    return new Result(
      null,
      "Hash has invalid format. Make sure to copy the hash correctly."
    );
  }
  if (outputHash.length !== 2) {
    console.log("Invalid hash");
    return new Result(
      null,
      "Hash has invalid format. Make sure to copy the hash correctly."
    );
  }

  // Convert the proof to the correct format.
  try {
    proof = JSON.parse(input);
  } catch {
    return new Result(
      null,
      "Invalid format of proof. Make sure to copy the complete proof"
    );
  }

  console.log("Proof: ", proof);
  if (proof.a.length !== 2 || proof.b.length !== 2 || proof.c.length !== 2) {
    console.log("Invalid proof");
    return new Result(
      null,
      "Invalid format of proof. Make sure to copy the complete proof"
    );
  }
  let bx = new Array(2);
  bx[0] = String(proof.b[0][0]);
  bx[1] = String(proof.b[0][1]);

  let by = new Array(2);
  by[0] = String(proof.b[1][0]);
  by[1] = String(proof.b[1][1]);
  const a = {
    X: String(proof.a[0]),
    Y: String(proof.a[1]),
  };
  const b = {
    X: bx,
    Y: by,
  };
  const c = {
    X: String(proof.c[0]),
    Y: String(proof.c[1]),
  };
  try {
    const args = [
      name,
      nameNum,
      nonce.toString(),
      { a, b, c },
      outputHash[0],
      outputHash[1],
    ];
    console.log("Args: ", args);
    const tx = await verifier.changePassword(...args, {
      from: address,
      gasLimit: 1000000,
    });
    console.log("changePassword Tx:", tx);
    return new Result(tx, null);
  } catch (error) {
    console.log(error);
    return new Result(
      null,
      "Failed to verify proof, make sure the username is correct."
    );
  }
}

// Add a new user to the contract.
async function addUser(userName, hashes, provider) {
  if (provider == null) {
    console.error("Provider not set");
  }
  console.log("getting signer");
  const signer = await provider.getSigner();
  const cAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const cABI = JSON.parse(VerifierMetaData.ABI);
  const verifier = new ethers.Contract(cAddr, cABI, signer);
  console.log("Adding User");

  let outputHash = null;

  // Convert the hash to the correct format.
  try {
    outputHash = JSON.parse(hashes);
  } catch (error) {
    console.log("Error parsing hash:", error);
    return new Result(null, "Hash has invalid format. Make sure to copy the hash correctly.");
  }
  if (outputHash == null) {
    console.log("Invalid hash");
    return new Result(null, "Hash has invalid format. Make sure to copy the hash correctly.");
  }
  if (outputHash.length !== 2) {
    console.log("Invalid hash");
    return new Result(null, "Hash has invalid format. Make sure to copy the hash correctly.");
  }

  try {
    const userArgs = [userName, outputHash[0], outputHash[1]];
    console.log("User Args:", userArgs);
    const tx = await verifier.addUser(...userArgs, {
      from: provider.getAddress(),
      gasLimit: 1000000,
    });
    console.log("AddUser Tx:", tx);
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    if (receipt.status === 0) {
      return new Error("Transaction failed.");
    }

    const updatedReceipt = await provider.getTransactionReceipt(tx.hash);
    if (updatedReceipt.status === 0) {
      return new Error("Transaction failed.");
    }
    return new Result(tx, null);
  } catch (error) {
    console.log("Error adding user:", error);
    return new Result(null, "The user already exists.");
  }
}

export { verifyProof, changePassword, addUser, Result };
