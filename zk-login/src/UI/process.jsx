import React, { useEffect, useState } from "react";
import ProofGenerationForm from "./proof-generation";
import Submit from "./submit-proof";

const Components = ["PROOF-GENERATION", "PUBLISH-PROOF", "SUCCESS"];
function Process() {
  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);
  const [provider, setProvider] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [name, setName] = useState(null);
  const [hashes, setHashes] = useState(null);

  useEffect(() => {
    console.log("Provider:", provider);
    console.log("Name:", name);
    if (provider && proof && hashes) {
      nextStepPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, proof, nonce, name, hashes]);

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
            submit={(proof, hashes, provider, nonce, name) => {
              setProof(proof);
              setHashes(hashes);
              setProvider(provider);
              setNonce(nonce);
              setName(name);
            }}
          />
        );
      case 1:
        return (
          <Submit proof={proof} hashes={hashes} provider={provider} nonce={nonce} name={name} />
        );
      case 2:
        return (
          <ProofGenerationForm
            submit={(proof, provider, nonce) => {
              setProof(proof);
              setProvider(provider);
              setNonce(nonce);
              nextStepPage();
            }}
          />
        );
      default:
        return (
          <ProofGenerationForm
            submit={(proof, provider, nonce) => {
              setProof(proof);
              setProvider(provider);
              setNonce(nonce);
              nextStepPage();
            }}
          />
        );
    }
  };
  return <>{getStep()}</>;
}

export default Process;
