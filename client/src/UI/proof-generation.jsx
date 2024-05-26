import React, {useState} from "react";
import { stringToBitArray, splitTo128BitArrays, convertToFieldArray } from "./helper/handle-password";
import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";

function ProofGenerationForm(props) {
  const [provider, setProvider] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // connect to MetaMask
    let account;
    let prov;
    try {
      const onboard = await onboardMM([1]);
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
    const fieldChunks = passwordParts.map(chunk => convertToFieldArray(chunk));

    const formData = {
      id: event.target.id.value,
      contract: event.target.contract.value,
    };

    // Add only necessary proof parts to formData
    for (let i = 0; i < fieldChunks.length; i++) {
      formData[`proof${i + 1}`] = fieldChunks[i];
    }

    try {
      console.log('Sending data:', formData);
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

        props.submit(proofJson, provider);
      } else {
        console.error('Error:', await response.text());
      }
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
          <label htmlFor="contract">Enter the contract ID:</label>
          <input
            type="text"
            id="contract"
            name="contract"
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
