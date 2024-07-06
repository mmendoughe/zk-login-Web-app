import { ethers } from "ethers";
import { toBigInt } from "ethers";


// Searches for walle, connects to it and returns the provider and the account.
export async function onboardMM(networkIDs) {
  console.log("Onboarding...");
  let web3Provider;

  try {
    web3Provider =  new ethers.BrowserProvider(window.ethereum);
  } catch (e) {
    throw new Error("MetaMask not available");
  }

  if (!web3Provider) {
    throw new Error("MetaMask not available");
  }

  const cID = await window.ethereum.request({
    method: "eth_chainId",
    params: [],
  });
  console.log("Chain ID:", toBigInt(cID));
  if (!networkIDs.includes(toBigInt(cID))) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + networkIDs[0].toString(16) }],
      });
    } catch (error) {
      console.error("Switching chain failed:", error);
    }
  }

  let accounts = [];
  try {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    }).then((accs) => {
      accounts = accs;
      if (accounts.length === 0) {
        return Promise.reject("No accounts specified");
      }
    });
  } catch {
    throw new Error("No accounts specified");
  }

  return { provider: web3Provider, account: accounts[0] };
}
