import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { toBigInt } from "ethers";


/**
 * @returns a promise for a Web3Provider initialized with the MetaMask provider
 * if it is available. Will reject if MetaMask is not detected.
 */
export async function initWeb3() {
  const prov = await detectEthereumProvider();
  if (prov) {
    console.log("MetaMask detected");
    return new ethers.BrowserProvider(
      prov,
      "any"
    );
  } else {
    return Promise.reject("MetaMask not available");
  }
}

/**
 * Gets the Web3 provider that has to be connected to one of the given
 * networkIDs and requests an account.
 *
 * @param networkIDs - The IDs of the supported networks that MetaMask can be
 * connected to.
 * @returns - The Web3 Provider and the address of the provided account.
 * @throws - Error, if:
 * - Getting the Web3 Provider fails.
 * - MetaMask is not connected to one of the networkIDs.
 * - Requesting the accounts failed.
 */
export async function onboardMM(networkIDs) {
  console.log("Onboarding...");
  window.ethereum.enable();
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
