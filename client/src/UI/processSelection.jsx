function ProcessSelection(props) {
  return (
    <div>
      <h2>Select Generation Tool</h2>
      <br />
      <br />
      <div className="selection-container">
        <button className="selection-btn" onClick={() => props.select("hash")}>
          Hash Generation Tool
        </button>
        <button className="selection-btn" onClick={() => props.select("proof")}>
          Proof Generation Tool
        </button>
      </div>
    </div>
  );
}

export default ProcessSelection;
