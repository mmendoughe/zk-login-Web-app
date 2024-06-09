import { VerifierMetaData } from "../lib/abi";
import { ethers } from "ethers";
import { BN } from "bn.js";

function Submit(props) {
  const prov = props.provider;
  const address = prov.getAddress();

  const handleSubmit = async () => {
    if (prov == null) {
      console.error("Provider not set");
    }
    console.log("getting signer");
    const signer = await prov.getSigner();
    // Send proof and nonce to verifier
    const cAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log("Submit proof to:", cAddr);
    const cABI = JSON.parse(VerifierMetaData.ABI);
    const verifier = new ethers.Contract(cAddr, cABI, signer);
    if (verifier != null) {
      console.log("Verifying tx");
      const proof = props.proof;
      let bx = new Array(2);
      bx[0] = String(proof.b[0][0]);
      bx[1] = String(proof.b[0][1]);

      let by = new Array(2);
      by[0] = String(proof.b[1][0]);
      by[1] = String(proof.b[1][1]);
      const a = {
        X: String(proof.a[0]),
        Y: String(proof.a[1]),
      };
      const b = {
        X: bx,
        Y: by,
      };
      const c = {
        X: String(proof.c[0]),
        Y: String(proof.c[1]),
      };
      try {
        console.log("Args: ", { a, b, c }, props.hashes, props.nonce, props.name);
        const args = [{ a, b, c }, [props.hashes[0], props.hashes[1], props.nonce, 0]];
        const tx = await verifier.verifyTx(...args, {
          from: address,
          gasLimit: 1000000,
          blockTag: 1,
        });
        console.log("Tx:", tx);
      } catch (error) {
        console.error("Error verifying tx:", error);
      }
    }
  };
  return (
    <>
      <div className="login-form">
        <h2>Your Address: {address}</h2>
        <div className="form-group">
          <textarea className="proof">{JSON.stringify(props.proof)}</textarea>
          <></>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}


export default Submit;
