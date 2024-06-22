function Failure(props) {
  return (
    <div>
      <h1>Failure</h1>
      <p>The Verification failed, make sure to use the provided nonce.</p>
      <button onClick={props.submit}>Try again</button>
    </div>
  );
}

export default Failure;