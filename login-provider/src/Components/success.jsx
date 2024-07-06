function Success(props) {
    return (
        <div>
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