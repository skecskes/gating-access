function Content({isAuthorized, contract}) {

    return (
        <>
            {isAuthorized ? (
                <>
                    <h1>Secret Place</h1>
                    <p>Welcome to this gated content for type {contract}</p>
                    <p>password is 'hunter2'</p>
                </>
            ) : (
                <h1>Sorry you do not own the NFT required of type {contract} </h1>
            )}
        </>
    )
}

export default Content;
