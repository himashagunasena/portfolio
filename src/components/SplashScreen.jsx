import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import fullLogo from '../assets/blue_logo.png';
import cloudImg from '../assets/cloud.jpg';
import starImg from '../assets/star.png';
import { loadExperienceData, loadProjectData } from '../fetchData';

export default function SplashScreen({ onComplete, setData }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let interval;
    const startLoading = async () => {
      interval = setInterval(() => setProgress(prev => Math.min(prev + 1, 90)), 20);
      const [experience, projects] = await Promise.all([loadExperienceData(), loadProjectData()]);
      setData({
        experiences: experience.experiences,
        education: experience.education,
        projects
      });
      clearInterval(interval);
      setProgress(100);
    };
    startLoading();
    return () => clearInterval(interval);
  }, [setData]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setFadeOut(true), 500);
      setTimeout(() => onComplete(), 800);
    }
  }, [progress, onComplete]);

  return (
    <div className={`splash ${fadeOut ? 'splash--fadeout' : ''}`}>
      <img src={cloudImg} alt="" className="splash-clouds" />
      {[...Array(5)].map((_, i) => (
        <img key={i} src={starImg} alt="" className={`splash-star splash-star--${i+1}`} />
      ))}
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