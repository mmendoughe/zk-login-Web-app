import React, { useState, useEffect } from "react";
import {
  stringToBitArray,
  splitTo128BitArrays,
  convertToFieldString,
  stringToNumber,
} from "./helper/handle-password";
import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { makeProof } from "../client/zokrates";

function ProofGenerationForm(props) {
  const [proof, setProof] = useState(null);
  const [hashes, setHashes] = useState(null);
  const [formData, setFormData] = useState(null);
  const [provider, setProvider] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (provider && proof && hashes && formData) {
      console.log("Submitting Data");
      props.submit(proof.proof, hashes, provider, formData.nonce, formData.id, username);
    }
  }, [provider, proof, hashes, formData, props, username]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // connect to MetaMask
    let account;
    let prov;
    try {
      const onboard = await onboardMM([31337]);
      account = onboard.account;
      prov = onboard.provider;
      console.log("Account:", account);
    } catch (error) {
      console.error("Error onboarding MetaMask:", error);
      return;
    }
    setProvider(new Web3Provider(prov, account));

    // handle inputs
    const password = stringToBitArray(event.target.proof.value);
    const passwordParts = splitTo128BitArrays(password);
    console.log("passwordParts:  ", passwordParts);
    const fieldChunks = passwordParts.map((chunk) =>
      convertToFieldString(chunk)
    );
    console.log("fieldChunks:  ", fieldChunks);
    if (fieldChunks.length > 4) {
      console.error("Password too long");
      return;
    }
    const passwordArgs = fieldChunks;
    while (passwordArgs.length < 4) {
      const zeroBytes = "0";
      passwordArgs.push(zeroBytes);
    }

    // const hashes = hashByteArray(fieldChunks);
    // console.log('Hashes:', hashes);

    try {
      const { args } = await makeProof(passwordArgs);
      if (args.length !== 6) {
        console.error("Invalid proof arguments");
        return;
      }
      setUsername(event.target.id.value);

      setHashes(args.slice(4, 6));
      const formData = {
        id: stringToNumber(event.target.id.value),
        nonce: stringToNumber(event.target.nonce.value),
        pass1: args[0],
        pass2: args[1],
        pass3: args[2],
        pass4: args[3],
        hash1: args[4],
        hash2: args[5]
      };
      setFormData(formData);

      const response = await fetch('/run-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const proofJson = await response.json();
        console.log('Proof JSON:', proofJson);
        setProof(proofJson);
      } else {
        console.error('Error:', await response.text());
      }
    } catch (error) {
      console.error("Error executing script:", error);
    }
  };

  const handleLinkClick = (event) => {
    event.preventDefault();
    const form = event.target.closest("form");
    form.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">Enter your Username:</label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="Username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="proof">Enter your Password:</label>
          <input
            type="password"
            id="proof"
            name="proof"
            placeholder="Password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nonce">Enter the given nonce:</label>
          <input
            type="text"
            id="nonce"
            name="nonce"
            placeholder="0x..."
            required
          />
        </div>
        <a href="/login" className="submit-btn" onClick={handleLinkClick}>
          &gt;
        </a>
      </form>
    </div>
  );
}

export default ProofGenerationForm;
