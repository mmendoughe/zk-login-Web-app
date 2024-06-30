import React, { useState, useEffect } from "react";
import logo from "../google_logo.svg";
import { onboardMM } from "../client/web3";
import { Web3Provider } from "../client/provider";
import { addUser } from "./helper/contract-interaction";

function Create(props) {
  const [userName, setUserName] = useState("");
  const [hash, setHash] = useState("");
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [tx, setTx] = useState(null);

  useEffect(() => {
    if (userName !== "" && hash !== "") {
      setError(null);
      console.log("Username2:", userName);
      onboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, hash]);

  useEffect(() => {
    if (provider) {
      AddUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useEffect(() => {
    if (tx) {
      props.submit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx]);

  const handleButtonClick = () => {
    const usernameInput = document.querySelector('input[name="username"]');
    console.log("Username:", usernameInput.value);
    setUserName(usernameInput.value);
    setHash(document.querySelector('input[name="hash"]').value);
  };

  const onboard = async () => {
    const onboard = await onboardMM([31337]);
    const account = onboard.account;
    const prov = onboard.provider;
    setProvider(new Web3Provider(prov, account));
  };

  const AddUser = async () => {
    const result = await addUser(userName, hash, provider);
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
        <h2>Create Google-Account</h2>
        <h3>Please input the Username</h3>
      </div>
      <div className="SidesL">
        <p className="text">
          Please generate the hashes of your password using the Proof-Generation
          tool.
        </p>
        <form className="form-container">
          <div className="input-container">
            <label>Username</label>
            <input type="text" name="username" />
          </div>
          <div className="input-container">
            <label>Hashed Password</label>
            <input type="text" name="hash" />
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

export default Create;
