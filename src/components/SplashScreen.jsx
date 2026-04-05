import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import fullLogo from '../assets/blue_logo.png';
import cloudImg from '../assets/cloud.jpg';
import starImg from '../assets/star.png';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setFadeOut(true), 300);
      setTimeout(() => onComplete(), 900);
    }
  }, [progress, onComplete]);

  return (
    <div className={`splash ${fadeOut ? 'splash--fadeout' : ''}`}>

      <img src={cloudImg} alt="" className="splash-clouds" />

      <img src={starImg} alt="" className="splash-star splash-star--1" />
      <img src={starImg} alt="" className="splash-star splash-star--2" />
      <img src={starImg} alt="" className="splash-star splash-star--3" />
      <img src={starImg} alt="" className="splash-star splash-star--4" />
      <img src={starImg} alt="" className="splash-star splash-star--5" />

      <div className="splash-center">
        <div className="splash-logo-wrap">
          <img src={fullLogo} alt="Panchali Himasha Gunasena" className="splash-mascot" />
        </div>

        <div className="splash-bar-wrap">
          <div className="splash-bar">
            <div className="splash-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

    </div>
  );
}