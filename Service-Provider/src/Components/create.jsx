import React, { useState, useEffect } from "react";
import logo from "../google_logo.svg";
import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { addUser } from "./helper/contract-interaction";
import { BiCopy } from "react-icons/bi";
import { Buffer } from "buffer";
import { stringToBigInts } from "./helper/handle-password";

const BN = require("bn.js");

/**
 * Create handles user interaction to create a new user and calls addUser on the contract using the given inputs of the user.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Create(props) {
  const [userName, setUserName] = useState("");
  const [hash, setHash] = useState("");
  const [proof, setProof] = useState("");
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [tx, setTx] = useState(null);
  const [nonce] = useState(() => {
    const array = new Uint8Array(5);
    window.crypto.getRandomValues(array);
    const randomBytesBuffer = Buffer.from(array);
    return new BN(randomBytesBuffer);
  });

  useEffect(() => {
    if (userName !== "" && hash !== "" && proof !== "") {
      setError(null);
      console.log("Username2:", userName);
      onboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, hash]);

  useEffect(() => {
    if (provider) {
      AddUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useEffect(() => {
    if (tx) {
      props.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(nonce.toString()).then(
      () => {
        console.log("Content copied to clipboard");
      },
      () => {
        console.log("Failed to copy");
      }
    );
  };

  const handleButtonClick = () => {
    const usernameInput = document.querySelector('input[name="username"]');
    console.log("Username:", usernameInput.value);
    setUserName(usernameInput.value);
    setHash(document.querySelector('input[name="hash"]').value);
    setProof(document.querySelector('input[name="proof"]').value);
  };

  const onboard = async () => {
    const onboard = await onboardMM([31337]);
    const account = onboard.account;
    const prov = onboard.provider;
    setProvider(new Web3Provider(prov, account));
  };

  const AddUser = async () => {
    const result = await addUser(
      stringToBigInts(userName),
      proof,
      stringToBigInts(nonce.toString()),
      hash,
      provider
    );
    if (result.tx == null) {
      setError(result.message);
    } else {
      setTx(result.tx);
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
        <h3>Please copy the Nonce: </h3>
        <div className="nonce-display">
          <p>{nonce.toString()}</p>
          <div
            className="copy-button"
            id="copyButton"
            onClick={() => copyToClipboard()}
          >
            <BiCopy size={20} />
          </div>
        </div>
        <p className="text">
          Please use the Proof-Generation tool to generate the proof and hash of
          your password and username.
        </p>
        <form className="form-container">
          <div className="input-container">
            <label>Username</label>
            <input type="text" name="username" />
          </div>
          <div className="input-container">
            <label>Proof</label>
            <input
              className="proof"
              placeholder='{"a":[],"b":[],"c":[]}'
              type="text"
              name="proof"
            />
          </div>
          <div className="input-container">
            <label>Hashed Password</label>
            <input type="text" name="hash" placeholder="[]" />
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="buttons">
          <button className="create-btn" onClick={() => props.submit()}>
            Back to login
          </button>
          <button className="submit-btn" onClick={handleButtonClick}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create;
