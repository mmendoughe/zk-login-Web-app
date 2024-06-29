import React, { useEffect, useState } from "react";
import ProofGenerationForm from "./proof-generation";
import Proof from "./proof";

const Components = ["PROOF-GENERATION", "PUBLISH-PROOF"];
function GenerationProcess() {
  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [nameNum, setNameNum] = useState(null);
  const [name, setName] = useState(null);
  const [hashes, setHashes] = useState(null);

  useEffect(() => {
    console.log("Name:", name);
    if (proof && hashes) {
      nextStepPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proof, nonce, name, hashes]);

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
          <ProofGenerationForm
            submit={(proof, hashes, nonce, nameNum, name) => {
              setProof(proof);
              setHashes(hashes);
              setNonce(nonce);
              setNameNum(nameNum);
              setName(name);
            }}
          />
        );
      case 1:
        return (
          <Proof
            proof={proof}
            hashes={hashes}
            nonce={nonce}
            nameNum={nameNum}
            name={name}
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
          <ProofGenerationForm
            submit={(proof, hashes, nonce, nameNum, name) => {
              setProof(proof);
              setHashes(hashes);
              setNonce(nonce);
              setNameNum(nameNum);
              setName(name);
            }}
          />
        );
    }
  };
  return <>{getStep()}</>;
}

export default GenerationProcess;
