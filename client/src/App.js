import React from "react";
import "./App.css";
import ProcessSelection from "./Components/selectionForm";
import LoginProcess from "./Components/login-process";
import ChangePasswordProcess from "./Components/changePassword-process";

function App() {
  const [step, setStep] = React.useState(0);
  const [register, setRegister] = React.useState(false);

  const getStep = () => {
    switch (step) {
      case 0:
        return (
          <ProcessSelection
            select={(select) => {
              if (select === "login") {
                setStep(2);
              } else if (select === "register") {
                setRegister(true);
                setStep(2);
              } else if (select === "passwordChange") {
                setStep(1);
              }
            }}
          />
        );
      case 1:
        return <ChangePasswordProcess />;
      case 2:
        return <LoginProcess register={register} />;
      default:
        return (
          <ProcessSelection
            select={(select) => {
              if (select === "registerLogin") {
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
