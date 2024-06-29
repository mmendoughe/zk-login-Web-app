import React from "react";
import "./App.css";
import ProcessSelection from "./Components/processSelection";
import GenerationProcess from "./Components/generation";
import HashProcess from "./Components/hash";

function App() {
  const [step, setStep] = React.useState(0);

  const getStep = () => {
    switch (step) {
      case 0:
        return (
          <ProcessSelection
            select={(select) => {
              if (select === "proof") {
                setStep(2);
              } else {
                setStep(1);
              }
            }}
          />
        );
      case 1:
        return <HashProcess />;
      case 2:
        return <GenerationProcess />;
      default:
        return (
          <ProcessSelection
            select={(select) => {
              if (select === "proof") {
                setStep(2);
              } else {
                setStep(1);
              }
            }}
          />
        );
    }
  };
  return (
    <div className="App">
      {step !== 0 ? (
        <div className="back-button">
          <a href="/login" className="submit-btn" onClick={() => setStep(0)}>
            &lt;
          </a>
        </div>
      ) : (
        <></>
      )}

      <div>{getStep()}</div>
    </div>
  );
}

export default App;
