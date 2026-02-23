import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">AKARU STYLE</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/awards">Awards</Link></li>
        <li><Link to="/agency">Agency</Link></li>
      </ul>
    </nav>
  );
}
