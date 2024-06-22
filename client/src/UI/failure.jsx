function Failure(props) {
      return (
      <div>
            <h1>Verification failed</h1>
            <h2>Make sure to use the nonce, given by the login provider.</h2>
            <button className="submit-btn" onClick={() => props.submit}>Try again</button>
      </div>
      );
}

export default Failure;
