function Success(props) {
    return (
        <div className="google-page">
            <h1>Success</h1>
            <div className="buttons">
        <button className="create-btn" onClick={() => props.submit()}>
            Back to login
          </button>
        </div>
        </div>
    )
}

export default Success;