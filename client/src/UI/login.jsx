import React from "react";

function LoginForm() {
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = {
      id: event.target.id.value,
      proof: event.target.proof.value,
      contract: event.target.contract.value,
    };

    try {
      // Use fetch to POST data to '/run-script' endpoint
      const response = await fetch('/run-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Assuming server responds with JSON
      console.log('Script execution successful:', data);
    } catch (error) {
      console.error('Error executing script:', error);
    }
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
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
