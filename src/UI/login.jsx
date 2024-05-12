import React from "react";

function LoginForm() {
  return (
    <div className="login-form">
      <h2>Login</h2>
      <form action="/login" method="post">
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
        <a href="/login" className="submit-btn">
          &gt;
        </a>
      </form>
    </div>
  );
}

export default LoginForm;
