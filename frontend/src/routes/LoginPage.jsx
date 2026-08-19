import { useState } from 'react';
import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';
import '../style/styles.css'

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message ?? 'Login failed.');
                return;
            }
            navigate('/admin');
        } catch (error) {
                        setError(error.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <Header />
            <main className="page-content">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Kirjaudu sisään</h2>

                    <label htmlFor="username">Käyttäjänimi</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="password">Salasana</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    {error && <p>{error}</p>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
                    </button>
                </form>
            </main>
            <Footer/>
        </div>
    );
};
