// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SustainX <i className="fas fa-leaf"></i>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/energy-analyzer" className="nav-links">⚡ Energy Analyzer</Link>
          </li>
          <li className="nav-item">
            <Link to="/sustainable-brands" className="nav-links">🏢 Sustainable Brands</Link>
          </li>
          <li className="nav-item">
            <Link to="/sustainable-news" className="nav-links">🌍 Climate News</Link>
          </li>
          <li className="nav-item">
            <Link to="/sustainable-recommender" className="nav-links">🌱 Recommender</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

