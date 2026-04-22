import React, { useRef, useEffect, useState } from 'react';
import './ExperienceSection.css';
import grassBg from '../assets/grass_background.jpg';
import Lottie from "lottie-react";
import loaderAnimation from "../assets/loading.json";

function useVisible(ref) {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVis(true);
    }, { threshold: 0.1 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  return vis;
}

export default function ExperienceSection({ initialData }) {
  const ref = useRef(null);
  const vis = useVisible(ref);

  const [experiences] = useState(initialData.experiences || []);
  const [education] = useState(initialData.education || []);
  const [loading] = useState(false);

  return (
    <section
      id="experience"
      ref={ref}
      className={`exp-section ${vis ? 'exp-visible' : ''}`}
      style={{ backgroundImage: `url(${grassBg})` }}
    >
      <div className="exp-bg-overlay"></div>

      <div className="exp-center">
        <div className="exp-edu-grid">

          <div className="exp-card">
            <h3 className="exp-card-title exp-color">Experiences</h3>
            <div className="exp-list">
              {loading ? (
                <div className="card-loader">
                  <Lottie animationData={loaderAnimation} loop />
                </div>
              ) : (
                experiences.map((e, i) => (
                  <div key={i} className="exp-item">
                    <p className="exp-item-title">{e.title}</p>
                    <p className="exp-item-company">{e.company}</p>
                    {e.period && <p className="exp-item-period">{e.period}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="exp-card">
            <h3 className="exp-card-title edu-color">Education</h3>
            <div className="exp-list">
              {loading ? (
                <div className="card-loader">
                  <Lottie animationData={loaderAnimation} loop />
                </div>
              ) : (
                education.map((e, i) => (
                  <div key={i} className="exp-item">
                    <p className="exp-item-title" style={{ whiteSpace: 'pre-line' }}>
                      {e.title}
                    </p>
                    <p className="exp-item-company">{e.company}</p>
                    <p className="exp-item-period">{e.period}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="exp-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,40 C240,120 480,-40 720,40 C960,120 1200,-40 1440,40 L1440,120 L0,120 Z"
            fill="var(--bg-color)"
          />
        </svg>
      </div>
    </section>
  );
}