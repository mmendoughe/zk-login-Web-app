import React, { useEffect, useState } from "react";
import ChangePasswordForm from "./changePasswordForm";
import Proof from "./proof";

const Components = ["PROOF-GENERATION", "PUBLISH-PROOF"];

/**
 * ChangePasswordProcess handles the navigation of the change password process.
 * @returns {JSX.Element}
 * @constructor
 */
function ChangePasswordProcess() {
  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);
  const [hashes, setHashes] = useState(null);

  useEffect(() => {
    if (proof && hashes) {
      nextStepPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proof, hashes]);

  const nextStepPage = (bool) => {
    if (step >= Components.length - 1) {
      setStep(0);
    } else {
      if (bool) {
        setStep(step + 2);
      } else setStep(step + 1);
    }
  };

  const getStep = () => {
    switch (step) {
      case 0:
        return (
          <ChangePasswordForm
            submit={(proof, hashes) => {
              setProof(proof);
              setHashes(hashes);
            }}
          />
        );
      case 1:
        return (
          <Proof
            proof={proof}
            hashes={hashes}
            submit={(tx) => {
              if (tx === true) {
                nextStepPage(false);
              }
              if (tx === false) {
                nextStepPage(true);
              }
            }}
          />
        );
      default:
        return (
          <ChangePasswordForm
            submit={(proof, hashes, nonce, nameNum, name) => {
              setProof(proof);
              setHashes(hashes);
            }}
          />
        );
    }
  };
  return <>{getStep()}</>;
}

export default ChangePasswordProcess;
