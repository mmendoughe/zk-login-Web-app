function Proof(props) {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(props.proof)).then(
      () => {
        console.log("Content copied to clipboard");
      },
      () => {
        console.log("Failed to copy");
      }
    );
  };

  return (
    <>
      <div className="login-form">
        <h2>You have successfully generated the proof</h2>
        <p>Please copy the proof and paste it into the login page</p>
        <div className="form-group">
          <textarea
            className="proof"
            readOnly={true}
            value={JSON.stringify(props.proof)}
          ></textarea>
          <button className="custom-button" onClick={copyToClipboard}>
            Copy
          </button>
        </div>
      </div>
    </>
  );
}

export default Proof;
