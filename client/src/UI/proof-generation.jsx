import React, {useState} from "react";
import { stringToBitArray, splitTo128BitArrays, convertToFieldArray, hashByteArray } from "./helper/handle-password";
import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { makeProof } from "../client/zokrates";

function ProofGenerationForm(props) {
  const [provider, setProvider] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // connect to MetaMask
    let account;
    let prov;
    try {
      const onboard = await onboardMM([31337]);
      account = onboard.account;
      prov = onboard.provider;
      console.log('Account:', account);
    } catch (error) {
      console.error('Error onboarding MetaMask:', error);
      return;
    }
    setProvider(new Web3Provider(prov, account));


    // handle inputs
    const password = stringToBitArray(event.target.proof.value);
    const passwordParts = splitTo128BitArrays(password);
    console.log("passwordParts:  ", passwordParts)
    const fieldChunks = passwordParts.map(chunk => convertToFieldArray(chunk));
    if (fieldChunks.length > 4) {
      console.error('Password too long');
      return;
    }
    while (fieldChunks.length < 4) {
      const zeroBytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      fieldChunks.push(zeroBytes);
    }

    const formData = {
      id: event.target.id.value,
      nonce: event.target.nonce.value,
    };

    // Add only necessary proof parts to formData
    for (let i = 0; i < fieldChunks.length; i++) {
      formData[`proof${i + 1}`] = fieldChunks[i];
    }

    const hashes = hashByteArray(...fieldChunks);
    console.log('Hashes:', hashes);

    try {
      /*console.log('Sending data:', formData);
      // Use fetch to POST data to '/run-script' endpoint
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

        props.submit(proofJson, provider, formData.nonce);
      } else {
        console.error('Error:', await response.text());
      }*/
      // const proof = await makeProof(fieldChunks);
      // props.submit(proof.proof, provider, formData.nonce, formData.id);
      console.log('fieldChunks:', fieldChunks);
    } catch (error) {
      console.error('Error executing script:', error);
    }
  };

  const handleLinkClick = (event) => {
    event.preventDefault();
    const form = event.target.closest('form');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
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
