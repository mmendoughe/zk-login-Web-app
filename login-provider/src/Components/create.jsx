import React, { useState, useEffect } from "react";
import logo from "../google_logo.svg";
import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { VerifierMetaData } from "../lib/abi";
import { ethers } from "ethers";

function Create(props) {
  const [userName, setUserName] = useState("");
  const [hash, setHash] = useState("");
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (userName !== "" && hash !== "") {
      console.log("Username2:", userName);
      onboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, hash]);

  useEffect(() => {
    if (provider) {
      AddUser();
      props.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const handleButtonClick = () => {
    const usernameInput = document.querySelector('input[name="username"]');
    console.log("Username:", usernameInput.value);
    setUserName(usernameInput.value);
    setHash(document.querySelector('input[name="hash"]').value);
  };

  const onboard = async () => {
    const onboard = await onboardMM([31337]);
    const account = onboard.account;
    const prov = onboard.provider;
    setProvider(new Web3Provider(prov, account));
  };

  const AddUser = async () => {
    if (provider == null) {
      console.error("Provider not set");
    }
    console.log("getting signer");
    const signer = await provider.getSigner();
    // Send proof and nonce to verifier
    const cAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const cABI = JSON.parse(VerifierMetaData.ABI);
    const verifier = new ethers.Contract(cAddr, cABI, signer);
    console.log("Adding User");
    const outputHash = JSON.parse(hash);
    console.log("Output:", outputHash);

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
      console.log(updatedReceipt);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="rows">
      <div className="SidesL">
        <div className="App-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2>Create Google-Account</h2>
        <h3>Please input the Username</h3>
      </div>
      <div className="SidesL">
        <p className="text">
          Please generate the hashes of your password using the Proof-Generation
          tool.
        </p>
        <form className="form-container">
          <div className="input-container">
            <label>Username</label>
            <input type="text" name="username" />
          </div>
          <div className="input-container">
            <label>Hashes Password</label>
            <input type="text" name="hash" />
          </div>
        </form>
        <div className="buttons">
          <button className="submit-btn" onClick={handleButtonClick}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create;
