import React, { useState, useEffect } from "react";
import logo from "../google_logo.svg";
import { onboardMM } from "../client/web3";
import { Buffer } from "buffer";
import { Web3Provider } from "../client/provider";
import { changePassword } from "./helper/contract-interaction";
import { BiCopy } from "react-icons/bi";
import { stringToBigInts } from "./helper/handle-password";
const BN = require("bn.js");

/**
 * Change handles user interaction to change a password and calls changePassword on the contract using the given inputs of the user.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Change(props) {
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
    if (hash !== "" && proof !== "") {
      onboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, proof]);

  useEffect(() => {
    if (provider) {
      ChangePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useEffect(() => {
    if (tx) {
      console.log("TX:", tx);
      props.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  const handleButtonClick = () => {
    setHash(document.querySelector('input[name="hash"]').value);
  };

  const onboard = async () => {
    const onboard = await onboardMM([31337]);
    const account = onboard.account;
    const prov = onboard.provider;
    setProvider(new Web3Provider(prov, account));
  };

  const ChangePassword = async () => {
    const result = await changePassword(
      proof,
      hash,
      props.nameNum,
      stringToBigInts(nonce.toString()),
      provider
    );
    if (result.tx == null) {
      setError(result.message);
    } else {
      setTx(result.tx);
    }
  };

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

  const handleInputChange = (event) => {
    setProof(event.target.value);
  };

  return (
    <div className="rows">
      <div className="SidesL">
        <div className="App-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2>Login</h2>
        <h3>Change Password</h3>
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
          Use the zk-login tool to create the proof and hash of the password and
          input it here:
        </p>
        <form className="form-container">
          <div className="input-container">
            <label>Proof</label>
            <input
              className="proof"
              placeholder='{"a":[],"b":[],"c":[]}'
              onChange={handleInputChange}
              type="text"
              name="proof"
            />
          </div>
        </form>
        <br />
        <form className="form-container">
          <div className="input-container">
            <label>Hashed Password</label>
            <input placeholder='[]' type="text" name="hash" />
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

export default Change;
