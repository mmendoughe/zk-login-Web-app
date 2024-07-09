import React, { useEffect, useState } from "react";
import LoginForm from "./loginForm";
import Proof from "./proof";

const Components = ["PROOF-GENERATION", "PUBLISH-PROOF"];

/**
 * LoginProcess handles the navigation of the login and registration process.
 * @returns {JSX.Element}
 * @constructor
 */
function LoginProcess(props) {
  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);
  const [hashes, setHashes] = useState(null);

  useEffect(() => {
    if (proof) {
      nextStepPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proof]);

  const nextStepPage = () => {
    if (step >= Components.length - 1) {
      setStep(0);
    } else {
      setStep(step + 1);
    }
  };

  const getStep = () => {
    switch (step) {
      case 0:
        return (
          <LoginForm
            register={props.register}
            submit={(proof, hash) => {
              setProof(proof);
              setHashes(hash);
            }}
          />
        );
      case 1:
        return (
          <Proof
            proof={proof}
            hashes={hashes}
          />
        );
      default:
        return (
          <LoginForm
            register={props.register}
            submit={(proof, hash) => {
              setProof(proof);
              setHashes(hash);
            }}
          />
        );
    }
  };
  return <>{getStep()}</>;
}

export default LoginProcess;
