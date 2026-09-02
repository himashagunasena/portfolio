import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../firebase';
import './HeroSection.css';
import backgroundImg from '../assets/background.jpg';
import leavesImg from '../assets/leaves.png';
import profileImg from '../assets/profile.png';
import kittyImg from '../assets/kitty.png';
import starImg from '../assets/star.png';

const DEFAULT_ABOUT_TEXT = '';

function AboutMeModal({ onClose }) {
  const [aboutText, setAboutText] = useState(DEFAULT_ABOUT_TEXT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    const fetchAbout = async () => {
      try {
        const database = getDatabase(db.app, 'https://portfolio-web-41160-default-rtdb.firebaseio.com/');
        const snapshot = await get(ref(database, 'myself'));

        console.log('RTDB "myself" exists:', snapshot.exists(), 'value:', snapshot.val());

        if (!cancelled && snapshot.exists()) {
          const value = snapshot.val();
          const text = typeof value === 'string' ? value : value?.about || value?.text;
          if (text) {
            setAboutText(text);
          } else {
            console.warn('RTDB "myself" exists but has no usable string/about/text field:', value);
          }
        } else if (!cancelled) {
          console.warn('No data found at RTDB path "myself". Check the key exists in the console.');
        }
      } catch (err) {
        console.error('Failed to load about-me text:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAbout();
    return () => { cancelled = true; };
  }, []);

     return createPortal(
    <div className="about-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="about-modal-page">
        <button className="about-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="about-modal-stars">
          <img src={starImg} className="about-star about-star-1" alt="" />
          <img src={starImg} className="about-star about-star-2" alt="" />
          <img src={starImg} className="about-star about-star-3" alt="" />
        </div>

        <div className="about-modal-scroll">
          <div className="about-modal-photo-frame">
            <img src={profileImg} alt="Himasha Gunasena" />
          </div>

          <h2 className="about-modal-hello">Hello!</h2>

          <div className="about-modal-body">
            {loading ? (
              <p className="about-modal-loading">Loading...</p>
            ) : aboutText ? (
              aboutText.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <p className="about-modal-loading">Couldn't load this right now — please try again later.</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function HeroSection({ heroProgress }) {
  const sectionRef = useRef(null);
  const [release, setRelease] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setRelease(rect.bottom <= window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const titleY = -heroProgress * 220;
  const titleOp = Math.max(0, 1 - heroProgress * 2);

  const cardProg = Math.min(1, Math.max(0, (heroProgress - 0.25) / 0.5));
  const cardOp = cardProg;
  const cardY = (1 - cardProg) * 80;

  return (
    <section
      ref={sectionRef}
      className={`hero-section ${release ? 'release' : ''}`}
      id="hero"
    >
      <div className="hero-clip">
        <div className="hero-bg-static">
          <img src={backgroundImg} className="hero-bg-img" />
          <div className='hero-bg-overlay'></div>
        </div>

        <div
          className="hero-title-layer"
          style={{ transform: `translateY(${titleY}px)`, opacity: titleOp }}
        >
          <div className="stars-layer">
            <img src={starImg} className="star star-1" />
            <img src={starImg} className="star star-2" />
            <img src={starImg} className="star star-3" />
            <img src={starImg} className="star star-4" />
          </div>

          <div className="column">
            <p className="portfolio-subtitle">Welcome To My</p>
            <h1 className="portfolio-title">PORTFOLIO</h1>
          </div>
        </div>

        <div className="hero-leaves-static">
          <img src={leavesImg} className="hero-leaves-img" />
        </div>

        <div
          className="hero-cards-layer"
          style={{
            opacity: cardOp,
            transform: `translateY(${cardY}px)`,
            pointerEvents: cardProg > 0.05 ? 'auto' : 'none',
          }}
        >
          <div className="hi-card">
            <div className="hi-avatar-float">
              <img src={profileImg} className="hi-avatar-img" />
            </div>
            <div className="hi-card-body">
              <h2 className="kitty-name-text">
                HI! I'M PANCHALI HIMASHA<br />GUNASENA
              </h2>
              <p className="hi-desc">
                Mobile Engineer | Web Developer | UI/UX Designer | Branding Designer | Illustrator
              </p>
              <button className="btn-know-more" onClick={() => setShowAbout(true)}>
                Know more about me
              </button>
            </div>
          </div>

          <div className="kitty-card">
            <div className="kitty-avatar-float">
              <img src={kittyImg} className="kitty-avatar-img" />
            </div>
            <div className="kitty-card-body">
              <p className="kitty-name-text">THIS IS</p>
              <p className="kitty-name-text">KITTY</p>
              <p className="kitty-role-text">Personal Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {showAbout && <AboutMeModal onClose={() => setShowAbout(false)} />}
    </section>
  );
}