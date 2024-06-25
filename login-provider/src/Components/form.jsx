import React, { useState, useEffect } from "react";
import logo from "../google_logo.svg";

function Form(props) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userName !== "") {
      console.log("Username2:", userName);
      props.submit(userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  const handleButtonClick = () => {
    const usernameInput = document.querySelector('input[name="username"]');
    console.log("Username:", usernameInput.value);
    setUserName(usernameInput.value);
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
      <div className="SidesR">
        <form className="form-container">
          <div className="input-container">
            <label>Username</label>
            <input type="text" name="username" />
          </div>
        </form>
        <div className="buttons">
          <button className="create-btn" onClick={() => props.create()}>
            Create Account
          </button>
          <button className="submit-btn" onClick={handleButtonClick}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Form;
