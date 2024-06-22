import React, { useState, useEffect } from "react";

function Form(props) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userName !== "") {
      console.log("Username2:", userName);
      props.submit(userName);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Username:", event.target.username.value);
    setUserName(event.target.username.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;
