import React from 'react';

class Login extends React.Component {

    render() {
        return (
            <div>
                <header className="Login-header">
                    <h1>Please login</h1>
                    <button onClick={() => this.connectIO()}>Connect</button>
                </header>
            </div>
        )

    }
}

export default Login;