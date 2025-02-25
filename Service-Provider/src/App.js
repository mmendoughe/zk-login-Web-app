import React, { useState } from "react";
import "./App.css";
import Form from "./Components/form";
import VerificationForm from "./Components/verificationForm";
import Success from "./Components/success";
import Create from "./Components/create";
import Change from "./Components/change";
import { useEffect } from "react";
import { stringToBigInts } from "./Components/helper/handle-password";

// Components = ["Form", "Nonce", "Success", "Failure", "Create", "Change"];
function App() {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState(null);
  const [input, setInput] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [change, setChange] = useState(false);

  useEffect(() => {
    if (userName && change === true) {
      setStep(4);
    } else if (userName) {
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  useEffect(() => {
    if (input && nonce) {
      setStep(4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, nonce]);

  useEffect(() => {
    console.log("Ressss: ", result);
    if (result != null) {
      if (result === true) {
        setStep(2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const getStep = () => {
    switch (step) {
      case 0:
        return (
          <Form
            submit={(userName) => {
              setChange(false);
              setUserName(userName);
            }}
            changePassword={(userName) => {
              setChange(true);
              setUserName(userName);
            }}
            create={() => setStep(3)}
          />
        );
      case 1:
        return (
          <VerificationForm
            nameNum={stringToBigInts(userName)}
            submit={(result) => {
              setResult(result);
            }}
            change={(input, nonce) => {
              setInput(input);
              setNonce(nonce);
            }}
            back={() => {
              setUserName("");
              setStep(0);
            }}
          />
        );
      case 2:
        return (
          <Success
            userName={userName}
            submit={() => {
              setUserName("");
              setInput(null);
              setNonce(null);
              setResult(null);
              setStep(0);
            }}
          />
        );
      case 3:
        return <Create submit={() => setStep(0)} />;
      case 4:
        return (
          <Change
            nameNum={stringToBigInts(userName)}
            submit={() => {
              setUserName("");
              setStep(0);
            }}
          />
        );
      default:
        return <Form submit={(userName) => {}} />;
    }
  };
  return (
    <div className="App">
      <div className="App-body">
        <div>{getStep()}</div>
      </div>
    </div>
  );
}

export default App;
