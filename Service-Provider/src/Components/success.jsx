function Success(props) {
    return (
        <div className="google-page">
            <h1>Successfully logged in as: {props.userName}</h1>
            <div className="buttons">
        <button className="create-btn" onClick={() => props.submit()}>
            Back to login
          </button>
        </div>
        </div>
    )
}

export default Success;