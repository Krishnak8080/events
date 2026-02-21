/**
 * App.jsx — Root Application Component
 * Sets up React Router with public and protected routes
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/user', { credentials: 'include' });
                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-dark-950">
                <Navbar user={user} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard user={user} loading={loading} />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
