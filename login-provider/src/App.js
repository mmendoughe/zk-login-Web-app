import React, { useState } from "react";
import "./App.css";
import Form from "./Components/form";
import Nonce from "./Components/nonce";
import Success from "./Components/success";
import Failure from "./Components/failure";
import Create from "./Components/create";
import Change from "./Components/change";
import { useEffect } from "react";
import { stringToNumber } from "./Components/helper/handle-password";

// Components = ["Form", "Nonce", "Success", "Failure", "Create", "Change"];
function App() {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState(null);
  const [input, setInput] = useState(null);
  const [nonce, setNonce] = useState(null);

  useEffect(() => {
    if (userName) {
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  useEffect(() => {
    if (input && nonce) {
      setStep(5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, nonce]);

  useEffect(() => {
    console.log("Ressss: ", result);
    if (result != null) {
      if (result === true) {
        setStep(2);
      } else {
        setStep(3);
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
              setUserName(userName);
            }}
            create={() => setStep(4)}
          />
        );
      case 1:
        return (
          <Nonce
            name={userName}
            nameNum={stringToNumber(userName).toString()}
            submit={(result) => {
              setResult(result);
            }}
            change={(input, nonce) => {
              setInput(input);
              setNonce(nonce);
            }}
          />
        );
      case 2:
        return <Success />;
      case 3:
        return <Failure submit={() => setStep(0)} />;
      case 4:
        return <Create submit={() => setStep(0)} />;
      case 5:
        return (
          <Change
            name={userName}
            nameNum={stringToNumber(userName).toString()}
            input={input}
            nonce={nonce}
            back={() => setStep(0)}
            submit={() => setStep(0)}
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
