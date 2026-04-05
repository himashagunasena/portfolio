import React, { useState } from 'react';
import './Navbar.css';
import downloadIcon from '../assets/download.png';
import logo from '../assets/full_logo.png';
import logoMobile from '../assets/logo.png';

const NAV_ITEMS = [
  { label: 'Home',        id: 'hero' },
  { label: 'About Me',    id: 'about' },
  { label: 'Experience',  id: 'experience' },
  { label: 'Skills',      id: 'skills' },
  { label: 'Portfolio',   id: 'portfolio' },
  { label: 'Testimonial', id: 'review' },
  { label: 'Contact me',  id: 'contact' },
];

export default function Navbar({ activeSection, scrollY }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isScrolled = scrollY > window.innerHeight * 0.85;

  const scrollTo = (id) => {
    if (id === 'hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (id === 'about') { window.scrollTo({ top: window.innerHeight * 1.0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="navbar-wrapper">
      <button className="logo-btn" onClick={() => scrollTo('hero')}>
        <img src={logo} alt="Logo" className="logo-desktop" />
        <img src={logoMobile} alt="Logo" className="logo-mobile" />
      </button>

      <nav className={`navbar ${isScrolled ? 'scrolled' : 'hero-nav'}`}>
        <ul className="nav-list desktop-nav">
          {NAV_ITEMS.map(({ label, id }) => (
            <li key={id}>
              <button
                className={`nav-item ${activeSection === id ? 'active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
                {activeSection === id && <span className="nav-dot" />}
              </button>
            </li>
          ))}
        </ul>

        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <button className="btn-cv" onClick={() => alert('CV download coming soon!')}>
          <span>Download CV</span>
          <img src={downloadIcon} alt="download icon" className="btn-cv-icon" />
        </button>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(({ label, id }) => (
            <button key={id} className="mobile-item" onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}