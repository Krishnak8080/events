/**
 * Navbar Component
 * Navigation bar with logo, links, and auth status
 */
import { Link, useLocation } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import { API_URL } from '../config';

const Navbar = ({ user }) => {
    const location = useLocation();

    return (
        <nav className="glass sticky top-0 z-40 border-b border-dark-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold">
                            <span className="gradient-text">Sydney</span>
                            <span className="text-dark-200"> Events</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors ${location.pathname === '/'
                                ? 'text-primary-400'
                                : 'text-dark-400 hover:text-dark-200'
                                }`}
                        >
                            Events
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                                ? 'text-primary-400'
                                : 'text-dark-400 hover:text-dark-200'
                                }`}
                        >
                            Dashboard
                        </Link>

                        {/* Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {user.avatar && (
                                        <img
                                            src={user.avatar}
                                            alt={user.displayName}
                                            className="w-8 h-8 rounded-full border-2 border-primary-500/30"
                                        />
                                    )}
                                    <span className="text-sm text-dark-300 hidden sm:block">
                                        {user.displayName}
                                    </span>
                                </div>
                                <a
                                    href={`${API_URL}/api/auth/logout`}
                                    className="text-xs text-dark-500 hover:text-red-400 transition-colors font-medium"
                                >
                                    Logout
                                </a>
                            </div>
                        ) : (
                            <GoogleLoginButton />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
