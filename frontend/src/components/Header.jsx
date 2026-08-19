import { Link } from 'react-router-dom';
import "../style/header.css"
export const Header = () => {

    return (
        <header className="hero">
            <h1>Quiz</h1>
            <nav className="navigation">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/game">Game</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    {/* isLogged ? <li><Link to="/admin">Admin</Link></li> : null */}
                </ul>
            </nav>
        </header>
    );
}