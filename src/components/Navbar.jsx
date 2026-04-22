import React, { useState, useEffect } from 'react';
import './Navbar.css';
import downloadIcon from '../assets/download.png';
import logo from '../assets/full_logo.png';
import logoMobile from '../assets/logo.png';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
  const [cvDialogOpen, setCvDialogOpen] = useState(false);
  const [cvData, setCvData] = useState({ mobile: null, uiux: null });
  const [loading, setLoading] = useState(false);

  const isScrolled = scrollY > window.innerHeight * 0.85;

  const scrollTo = (id) => {
    if (id === 'hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (id === 'about') { window.scrollTo({ top: window.innerHeight * 1.0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const openCvDialog = async () => {
    setCvDialogOpen(true);
    if (cvData.mobile && cvData.uiux) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'cv', 'files');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setCvData({
          mobile: snap.data().mobile_cv,
          uiux: snap.data().uiux_cv,
        });
      }
    } catch (e) {
      console.error('Failed to load CVs:', e);
    } finally {
      setLoading(false);
    }
  };

  const downloadCV = (base64, filename) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = filename;
    link.click();
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setCvDialogOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
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

          <button className="btn-cv" onClick={openCvDialog}>
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

      {cvDialogOpen && (
        <div className="cv-overlay" onClick={() => setCvDialogOpen(false)}>
          <div className="cv-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="cv-close" onClick={() => setCvDialogOpen(false)}>✕</button>
            <h2 className="cv-title">Download CV</h2>
            <p className="cv-subtitle">Choose which CV you'd like to download</p>

            {loading ? (
              <div className="cv-loading">
                <div className="cv-spinner" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="cv-options">
                <button
                  className="cv-option-btn"
                  onClick={() => cvData.mobile && downloadCV(cvData.mobile, 'Himasha Gunasena-Mobile Engineer.pdf')}
                  disabled={!cvData.mobile}
                >
                  <div className="cv-option-info">
                    <span className="cv-option-title">Mobile Development</span>
                    <span className="cv-option-desc">Flutter · React Native · Android</span>
                  </div>
                   <img src={downloadIcon} alt="download icon" className="cv-option-arrow" />
                </button>

                <button
                  className="cv-option-btn"
                  onClick={() => cvData.uiux && downloadCV(cvData.uiux, 'Himasha Gunasena-UIUX Designer.pdf')}
                  disabled={!cvData.uiux}
                >
                  <div className="cv-option-info">
                    <span className="cv-option-title">UI/UX Design</span>
                    <span className="cv-option-desc">Figma · Branding · Illustration</span>
                  </div>
                        <img src={downloadIcon} alt="download icon" className="cv-option-arrow" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}