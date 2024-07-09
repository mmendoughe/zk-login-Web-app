import { BiCopy } from "react-icons/bi";

/**
 * Proof displays the proof and hash to the user.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Proof(props) {

  const copyToClipboard = (val) => {
    navigator.clipboard.writeText(val).then(
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
        <div className="hash-display">
        <label>Proof</label>
          <textarea
            className="proof"
            readOnly={true}
            value={JSON.stringify(props.proof)}
          ></textarea>
          <div
              className="copy-button"
              id="copyButton"
              onClick={() => copyToClipboard(JSON.stringify(props.proof))}
            >
              <BiCopy size={20} />
            </div>
        </div>
        {props.hashes ? (
          <div className="hash-display">
          <br />
          <label>Hashed Password</label>
          <textarea className="hash" value={props.hashes} readOnly></textarea>
          <div
              className="copy-button"
              id="copyButton"
              onClick={() => copyToClipboard(props.hashes)}
            >
              <BiCopy size={20} />
            </div>
        </div>
        ) : (
          <></>
        )}
        
      </div>
    </>
  );
}

export default Proof;
