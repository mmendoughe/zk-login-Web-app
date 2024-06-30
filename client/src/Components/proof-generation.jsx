/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { stringToBigInts } from "./helper/handle-password";
import { makeProof } from "../client/zokrates";

function ProofGenerationForm(props) {
  const [proof, setProof] = useState(null);
  const [hashes, setHashes] = useState(null);
  const [formData, setFormData] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (proof && hashes && formData) {
      console.log("Submitting Data");
      props.submit(proof.proof, hashes, formData.nonce, formData.id, username);
      setLoading(false);
    }
  }, [proof, hashes, formData, props, username]);

  const handleSubmit = async (event) => {
    setError(null);
    event.preventDefault();
    setLoading(true);

    // handle inputs
    const password = stringToBigInts(event.target.proof.value);
    // const passwordParts = splitTo128BitArrays(password);
    // console.log("passwordParts:  ", passwordParts);
    // const fieldChunks = passwordParts.map((chunk) =>
    //   convertToFieldString(chunk)
    // );
    // console.log("fieldChunks:  ", fieldChunks);
    const fieldChunks = [...password];
    if (fieldChunks.length > 4) {
      setError("Password too long");
      console.error("Password too long");
      setLoading(false);
      return;
    }
    const passwordArgs = fieldChunks;
    while (passwordArgs.length < 4) {
      const zeroBytes = "0";
      passwordArgs.push(zeroBytes);
    }
    console.log("Password Args: ", passwordArgs);

    const userName = stringToBigInts(event.target.id.value);
    const nameChunks = [...userName];
    if (nameChunks.length > 4) {
      setError("username too long");
      console.error("username too long");
      setLoading(false);
      return;
    }
    const userNameArgs = nameChunks;
    while (userNameArgs.length < 4) {
      const zeroBytes = "0";
      userNameArgs.push(zeroBytes);
    }
    console.log("userName Args: ", userNameArgs);

    const nonce = stringToBigInts(event.target.nonce.value);
    const nonceChunks = [...nonce];
    if (nonceChunks.length > 4) {
      setError("nonce too long");
      console.error("nonce too long");
      setLoading(false);
      return;
    }
    const nonceArgs = nonceChunks;
    while (nonceArgs.length < 4) {
      const zeroBytes = "0";
      nonceArgs.push(zeroBytes);
    }
    console.log("nonceArgs Args: ", nonceArgs);

    try {
      const { outputHashString } = await makeProof(passwordArgs);
      const outputHash = JSON.parse(outputHashString);
      console.log("Output:", outputHash);

      const args = [...passwordArgs];
      if (outputHash) {
        args.push(outputHash[0]);
        args.push(outputHash[1]);
      }
      if (args.length !== 6) {
        console.error("Invalid proof arguments");
        setLoading(false);
        return;
      }
      console.log("Hash zok: ", args[4], args[5]);
      setUsername(event.target.id.value);

      setHashes(args.slice(4, 6));

      const pass = args.slice(0, 4);
      for (let i = 0; i < 4; i++) {
        pass[i] = BigInt(pass[i]) ^ BigInt(nonceArgs[i]) ^ BigInt(userNameArgs[i]);
        pass[i] = pass[i].toString();
      }
      console.log("Pass: ", pass);
      const formData = {
        pass1: pass[0],
        pass2: pass[1],
        pass3: pass[2],
        pass4: pass[3],
        user1: userNameArgs[0],
        user2: userNameArgs[1],
        user3: userNameArgs[2],
        user4: userNameArgs[3],
        nonce1: nonceArgs[0],
        nonce2: nonceArgs[1],
        nonce3: nonceArgs[2],
        nonce4: nonceArgs[3],
        hash1: args[4],
        hash2: args[5],
      };
      setFormData(formData);

      const response = await fetch("/run-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const proofJson = await response.json();
        console.log("Proof JSON:", proofJson);
        setProof(proofJson);
      } else {
        console.error("Error:", await response.text());
        setLoading(false);
      }
    } catch (error) {
      console.error("Error executing script:", error);
      setLoading(false);
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
      <h2>Proof Generation Tool</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">Enter your Username:</label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="Username"
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nonce">Enter the given nonce:</label>
          <input
            type="text"
            id="nonce"
            name="nonce"
            placeholder="..........."
            required
            disabled={loading}
          />
        </div>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <div className="loading-circle"></div>
        ) : (
          <a href="/login" className="submit-btn" onClick={handleLinkClick}>
            &gt;
          </a>
        )}
      </form>
    </div>
  );
}

export default ProofGenerationForm;
