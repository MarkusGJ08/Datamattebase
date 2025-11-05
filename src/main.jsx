import React, { useState } from 'react';
import './main.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        // Assuming successful login
        window.location.href = '/mainPage'; // Redirect to mainPage.jsx
        console.log('Login attempt with:', email, password);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Logg inn</h2>
                <div className="form-group">
                    <label htmlFor="email">E-post:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passord:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Logg inn</button>
            </form>
        </div>
    );
}

export default Login;