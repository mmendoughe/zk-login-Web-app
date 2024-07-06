/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { stringToBigInts } from "./helper/handle-password";
import { makeProof } from "../client/zokrates";

function ChangePasswordForm(props) {
  const [proof, setProof] = useState(null);
  const [newhashes, setNewHashes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (proof && newhashes) {
      console.log("Submitting Data");
      props.submit(proof.proof, newhashes);
      setLoading(false);
    }
  }, [proof, newhashes, props]);

  const handleSubmit = async (event) => {
    setError(null);
    event.preventDefault();
    setLoading(true);

    // handle inputs
    const password = stringToBigInts(event.target.proof.value);

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

    const newpassword = stringToBigInts(event.target.newproof.value);

    const newfieldChunks = [...newpassword];
    if (newfieldChunks.length > 4) {
      setError("Password too long");
      console.error("Password too long");
      setLoading(false);
      return;
    }
    const newpasswordArgs = newfieldChunks;
    while (newpasswordArgs.length < 4) {
      const zeroBytes = "0";
      newpasswordArgs.push(zeroBytes);
    }
    console.log("new Password Args: ", newpasswordArgs);

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
      // Compute Hash of old password
      const outputHashStrings = await makeProof([passwordArgs, newpasswordArgs]);
      console.log("Output Hash Strings:", outputHashStrings.hashes);
      const outputHashString = outputHashStrings.hashes[0];
      const newoutputHashString = outputHashStrings.hashes[1];
      const outputHash = JSON.parse(outputHashString);
      console.log("Output:", outputHash);

      const newoutputHash = JSON.parse(newoutputHashString);
      console.log("new Output:", newoutputHash);

      const args = [...passwordArgs];
      if (outputHash) {
        args.push(outputHash[0]);
        args.push(outputHash[1]);
      }

      const newargs = [...newpasswordArgs];
      if (newoutputHash) {
        newargs.push(newoutputHash[0]);
        newargs.push(newoutputHash[1]);
      }

      if (args.length !== 6 || newargs.length !== 6) {
        console.error("Invalid proof arguments");
        setLoading(false);
        return;
      }
      console.log("Hash zok: ", args[4], args[5]);
      console.log("new Hash zok: ", newargs[4], newargs[5]);
      setNewHashes(newoutputHashString);

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
        newpass1: newargs[0],
        newpass2: newargs[1],
        newpass3: newargs[2],
        newpass4: newargs[3],
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
        newhash1: newargs[4],
        newhash2: newargs[5],
      };

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
          <label htmlFor="proof">Enter your old Password:</label>
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
          <label htmlFor="proof">Enter your new Password:</label>
          <input
            type="password"
            id="newproof"
            name="newproof"
            placeholder="new Password"
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

export default ChangePasswordForm;
