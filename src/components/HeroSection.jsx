import { useEffect, useState, useRef } from 'react';
import './HeroSection.css';
import backgroundImg from '../assets/background.jpg';
import leavesImg from '../assets/leaves.png';
import profileImg from '../assets/profile.png';
import kittyImg from '../assets/kitty.png';
import starImg from '../assets/star.png';

export default function HeroSection({ heroProgress }) {
  const sectionRef = useRef(null);
  const [release, setRelease] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      // when hero bottom reaches viewport top → release
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
            <button className="btn-know-more">Know more about me</button>
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
    </section>
  );
}