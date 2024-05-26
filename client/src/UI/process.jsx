import React, { useEffect, useState } from "react";
import ProofGenerationForm from "./proof-generation";
import Submit from "./submit-proof";

const Components = ["PROOF-GENERATION", "PUBLISH-PROOF", "SUCCESS"];
function Process() {
  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (provider && proof) {
      nextStepPage();
    }
  }, [provider, proof]);

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
          <ProofGenerationForm
            submit={(proof, provider) => {
              setProof(proof);
              setProvider(provider);
            }}
          />
        );
      case 1:
        return <Submit proof={proof} provider={provider} />;
      case 2:
        return <ProofGenerationForm />;
      default:
        return <ProofGenerationForm />;
    }
  };
  return <>{getStep()}</>;
}

export default Process;
