import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import logo from "../google_logo.svg";
import { BiCopy } from "react-icons/bi";
import { verifyProof } from "./helper/contract-interaction";
import { stringToBigInts } from "./helper/handle-password";

const BN = require("bn.js");

/**
 * Nonce handles user interaction to verify the proof and calls verifyProof on the contract using the given inputs of the user.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function VerificationForm(props) {
  const [provider, setProvider] = useState(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [tx, setTx] = useState(null);
  const [nonce] = useState(() => {
    const array = new Uint8Array(5);
    window.crypto.getRandomValues(array);
    const randomBytesBuffer = Buffer.from(array);
    return new BN(randomBytesBuffer);
  });

  useEffect(() => {
    if (provider && input) {
      handleSubmit(provider, nonce, input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, input]);

  useEffect(() => {
    console.log("TX:", tx);
    if (tx) {
      props.submit(tx);
    }
    if (tx === false) {
      setError(
        "Sorry, the proof is invalid. Make sure you have the correct proof."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  const handleSubmit = async (provider, nonce, input) => {
    console.log("Provider:", provider);
    console.log("Nonce:", nonce.toString());
    console.log("Input:", input);

    const result = await verifyProof(
      input,
      props.nameNum,
      stringToBigInts(nonce.toString()),
      provider
    );
    console.log("Result:", result);
    if (result.tx == null) {
      console.log("Error:", result.message, result.tx);
      setError(result.message);
    } else {
      console.log("setting TX:", result.tx);
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

  const onboard = async () => {
    const onboard = await onboardMM([31337]);
    const account = onboard.account;
    const prov = onboard.provider;
    setProvider(new Web3Provider(prov, account));
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="rows">
      <div className="SidesL">
        <div className="App-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2>Login</h2>
        <h3>Login with google account.</h3>
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
          Use the zk-login tool to create the proof of the password and input it
          here:
        </p>
        <div className="input-container">
          <label>Proof</label>
          <input
            className="proof"
            placeholder='{"a":[],"b":[],"c":[]}'
            onChange={handleInputChange}
            type="text"
            name="hash"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="buttons">
          <button className="create-btn" onClick={() => props.back()}>
            Back to login
          </button>
          <button className="onboard-btn" onClick={() => onboard()}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerificationForm;
