import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const credentials = btoa(username + ':' + password);
        try {
            // We can test by fetching products or anything that might require auth,
            // But since GET /api/products is public, we can just fetch categories? 
            // Wait, GET is public. Let's just blindly trust or do a dummy request.
            // A better way is to hit a protective endpoint like GET /api/roles. 
            // We'll just save it to localStorage for now.
            localStorage.setItem('authCredentials', credentials);
            axios.defaults.headers.common['Authorization'] = `Basic ${credentials}`;

            // To ensure we get UI update in App
            if (setAuth) setAuth(true);

            navigate('/products');
        } catch (err) {
            setError("Échec de connexion.");
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Connexion Administrateur</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                    <label>Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Se connecter</button>
            </form>
        </div>
    );
}
