import { VerifierMetaData } from "../lib/abi";
import { ethers } from "ethers";

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
    const cAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const cABI = JSON.parse(VerifierMetaData.ABI);
    const verifier = new ethers.Contract(cAddr, cABI, signer);
    console.log("Adding User");
    try {
      const userArgs = [props.name, props.hashes[0], props.hashes[0]];
      const tx = await verifier.addUser(...userArgs, {
        from: address,
        gasLimit: 1000000,
      });
      console.log("Tx:", tx);
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);

      if (receipt.status === 0) {
        return new Error("Transaction failed.");
      }

      const updatedReceipt = await prov.getTransactionReceipt(tx.hash);
      if (updatedReceipt.status === 0) {
        return new Error("Transaction failed.");
      }
      console.log(updatedReceipt);
    } catch (error) {
      console.error("Error adding user:", error);
    }

    console.log("Submit proof to:", cAddr);

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
        const args = [props.name, props.nameNum, props.nonce, { a, b, c }];
        const tx = await verifier.verifyProof(...args, {
          from: address,
          gasLimit: 1000000,
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
