import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import { VerifierMetaData } from "../lib/abi";
import logo from "../google_logo.svg";
import { BiCopy } from "react-icons/bi";

const BN = require("bn.js");

function Nonce(props) {
  const [provider, setProvider] = useState(null);
  const [input, setInput] = useState("");
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

  const handleSubmit = async (provider, nonce, input) => {
    console.log("Provider:", provider);
    console.log("Nonce:", nonce.toString());
    console.log("Input:", input);

    if (provider == null) {
      console.error("Provider not set");
    }
    console.log("getting signer");
    const signer = await provider.getSigner();
    const address = provider.getAddress();
    // Send proof and nonce to verifier
    const cAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const cABI = JSON.parse(VerifierMetaData.ABI);
    const verifier = new ethers.Contract(cAddr, cABI, signer);

    console.log("Verifying tx");
    const proof = JSON.parse(input);
    console.log("Proof: ", proof);
    if (proof.a.length !== 2 || proof.b.length !== 2 || proof.c.length !== 2) {
      console.error("Invalid proof");
      return;
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
      console.log(
        "Args: ",
        props.name,
        props.nameNum,
        nonce.toString(),
        { a, b, c }
      );
      const args = [
        props.name,
        props.nameNum,
        nonce.toString(),
        { a, b, c },
      ];
      const tx = await verifier.verifyProof(...args, {
        from: address,
        gasLimit: 1000000,
      });
      console.log("VerifyProof Tx:", tx);
      props.submit(tx);
    } catch (error) {
      console.log(error);
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
        <h3>Please copy the Identifier: </h3>
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
        <textarea
          className="proof"
          placeholder='{"a":[],"b":[],"c":[]}'
          onChange={handleInputChange}
        ></textarea>
        <div className="buttons">
          <button className="onboard-btn" onClick={() => onboard()}>
            Onboard and Verify Proof
          </button>
        </div>
      </div>
    </div>
  );
}

export default Nonce;
