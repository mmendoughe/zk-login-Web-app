import React, { useState, useEffect } from "react";
import logo from "../google_logo.svg";
import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { changePassword } from "./helper/contract-interaction";

function Change(props) {
  const [hash, setHash] = useState("");
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [tx, setTx] = useState(null);

  useEffect(() => {
    if (hash !== "") {
      onboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

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
    const result = await changePassword(props.input, hash, props.name, props.nameNum, props.nonce, provider);
    if (result.tx == null) {
      setError(result.message);
    }
    else {
      setTx(result.tx);
    }
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
        <p className="text">
          Please generate the hashes of your new password using the Proof-Generation
          tool.
        </p>
        <form className="form-container">
          <div className="input-container">
            <label>Hashed Password</label>
            <input type="text" name="hash" />
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="buttons">
          <button className="create-btn" onClick={() => props.back()}>
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
