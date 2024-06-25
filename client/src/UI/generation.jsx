import React, { useEffect, useState } from "react";
import ProofGenerationForm from "./proof-generation";
import Submit from "./submit-proof";
import Success from "./success";
import Failure from "./failure";

const Components = ["PROOF-GENERATION", "PUBLISH-PROOF", "SUCCESS", "FAILURE"];
function GenerationProcess() {
  const [step, setStep] = useState(0);
  const [proof, setProof] = useState(null);
  const [provider, setProvider] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [nameNum, setNameNum] = useState(null);
  const [name, setName] = useState(null);
  const [hashes, setHashes] = useState(null);

  useEffect(() => {
    console.log("Provider:", provider);
    console.log("Name:", name);
    if (provider && proof && hashes) {
      nextStepPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, proof, nonce, name, hashes]);

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
            submit={(proof, hashes, provider, nonce, nameNum, name) => {
              setProof(proof);
              setHashes(hashes);
              setProvider(provider);
              setNonce(nonce);
              setNameNum(nameNum);
              setName(name);
            }}
          />
        );
      case 1:
        return (
          <Submit
            proof={proof}
            hashes={hashes}
            provider={provider}
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
      case 2:
        return <Success />;
      case 3:
        return <Failure submit={() => nextStepPage(false)} />;
      default:
        return (
          <ProofGenerationForm
            submit={(proof, provider, nonce) => {
              setProof(proof);
              setProvider(provider);
              setNonce(nonce);
              nextStepPage(false);
            }}
          />
        );
    }
  };
  return <>{getStep()}</>;
}

export default GenerationProcess;
