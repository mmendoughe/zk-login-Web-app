/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import {
  stringToNumber,
} from "./helper/handle-password";
import { makeProof } from "../client/zokrates";
import { BiCopy } from "react-icons/bi";

function HashGenerationForm(props) {
  const [hashes, setHashes] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hashes) {
      setLoading(false);
    }
  }, [hashes, props]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // handle inputs
    const password = stringToNumber(event.target.proof.value);
    // const passwordParts = splitTo128BitArrays(password);
    // console.log("passwordParts:  ", passwordParts);
    // const fieldChunks = passwordParts.map((chunk) =>
    //   convertToFieldString(chunk)
    // );
    // console.log("fieldChunks:  ", fieldChunks);
    const fieldChunks = [password];
    if (fieldChunks.length > 4) {
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

    try {
      const { outputHashString } = await makeProof(passwordArgs);
      setHashes(outputHashString);
    } catch (error) {
      console.error("Error making hash:", error);
      setLoading(false);
    }
  };

  function copyToClipboard() {
      navigator.clipboard.writeText(hashes).then(
        () => {
          console.log("Content copied to clipboard");
        },
        () => {
          console.log("Failed to copy");
        }
      );
    }

  const handleLinkClick = (event) => {
    event.preventDefault();
    const form = event.target.closest("form");
    form.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  return (
    <div className="hash-form">
      <h2>Hash Generation Tool</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="proof">Enter your Password:</label>
          <input
            type="password"
            id="proof"
            name="proof"
            placeholder="Password"
            required
            disabled={loading} // Disable input while loading
          />
        </div>
        
        {hashes !== null ? (
        <div className="hash-display">
          <textarea className="hash" value={hashes} readOnly></textarea>
          <div
              className="copy-button"
              id="copyButton"
              onClick={() => copyToClipboard()}
            >
              <BiCopy size={20} />
            </div>
        </div>
      ) : (
        <div></div>
      )}
      {loading ? (
        <div className="loading-circle"></div>
      ) : (
        hashes === null && (
          <a href="/login" className="submit-btn" onClick={handleLinkClick}>
            &gt;
          </a>
        )
      )}
      </form>
    </div>
  );
}

export default HashGenerationForm;
