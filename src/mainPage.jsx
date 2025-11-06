import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/mainPage.css'; // You'll need to create this CSS file

const MainPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your authentication logic here
        // For now, we'll just redirect to Login.jsx
        navigate('/login');
    };

    return (
        <div className="main-container">
            <div className="login-box">
                <h1>Welcome to DatamatteBase</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MainPage;