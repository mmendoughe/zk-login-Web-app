function ProcessSelection(props) {
  return (
    <div>
      <h2>Select Generation Tool</h2>
      <br />
      <br />
      <div className="selection-container">
        <button className="selection-btn" onClick={() => props.select("register")}>
          Proof for Registration
        </button>
        <button className="selection-btn" onClick={() => props.select("login")}>
          Proof for Login
        </button>
        <button className="selection-btn" onClick={() => props.select("passwordChange")}>
          Proof for Password Change
        </button>
      </div>
    </div>
  );
}

export default ProcessSelection;
