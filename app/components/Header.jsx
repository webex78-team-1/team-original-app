import { Link } from "@remix-run/react";
import "./Header.css";
import kotabi from "../images/kotabi.png";
import { SignOutButton } from "../components/Sign.jsx";

export const Header = () => (
  <header className="header">
    <img src={kotabi} className="icon" alt="kotabi"></img>
    <nav className="navigation">
      <Link to="/" className="navigation__link">
        My Page
      </Link>
      |
      <Link to="/search" className="navigation__link">
        Search on Google Map
      </Link>
      |
      <Link to="/recommend" className="navigation__link">
        Suggestions from AI
      </Link>
      <SignOutButton />
    </nav>
  </header>
);
