import React, { useState } from 'react';
import './App.css';
import Form from './Components/form';
import Nonce from './Components/nonce';
import Success from './Components/success';
import Failure from './Components/failure';
import { useEffect } from 'react';
import { stringToNumber } from './Components/helper/handle-password';

const Components = ["Form", "Nonce", "Success", "Failure"];
function App() {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState(null);

  const nextStepPage = (bool) => {
    if (step > Components.length - 1) {
      setStep(0);
    }
    if (bool) {
      setStep(step + 2);
    } else {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (userName) {
      nextStepPage(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  useEffect(() => {
    if (result != null) {
      if (result === true) {
        nextStepPage(false);
      } else {
        nextStepPage(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);


  const getStep = () => {
    switch (step) {
      case 0:
        return <Form submit={(userName) => { setUserName(userName) }} />;
      case 1:
        return <Nonce name={userName} nameNum={stringToNumber(userName)} submit={(result) => {
          setResult(result);
        }}/>;
      case 2:
        return <Success />;
      case 3:
        return <Failure submit={() => nextStepPage(false)} />;
      default:
        return <Form submit={(userName) => {}} />;
    }
  }
  return (
    <div className="App">
    <div className="centering">{getStep()}</div>
    </div>
  );
}

export default App;
