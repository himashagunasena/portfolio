import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import './App.css';
import SplashScreen from './components/SplashScreen.jsx';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ExperienceSection from './components/ExperienceSection.jsx';
import SkillsSection from './components/SkillsSection.jsx';
import ProjectSection from './components/ProjectSection.jsx';
import AllProjects from './pages/AllProjects.jsx';
import TestimonialSection from './components/TestimonialSection.jsx';
import ContactSection from './components/ContactSection.jsx';

const SECTIONS = ['hero', 'about', 'experience', 'skills', 'portfolio', 'review', 'contact'];

function HomePage({ experienceData, projectData }) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroProgress, setHeroProgress] = useState(0);
  const rafRef = React.useRef(null);

  const detectSection = useCallback(() => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    setScrollY(y);
    setHeroProgress(Math.min(1, Math.max(0, y / (vh * 0.60))));
    if (y < vh * 0.6) { setActiveSection('hero'); return; }
    if (y < vh * 1.0) { setActiveSection('about'); return; }
    let closestSection = SECTIONS[2];
    let minDistance = Infinity;
    for (let i = 2; i < SECTIONS.length; i++) {
      const el = document.getElementById(SECTIONS[i]);
      if (!el) continue;
      const distance = Math.abs(el.getBoundingClientRect().top);
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = SECTIONS[i];
      }
    }
    setActiveSection(closestSection);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(detectSection);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(detectSection);
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [detectSection]);

  return (
    <div className="app">
      <Navbar activeSection={activeSection} scrollY={scrollY} />
      <HeroSection heroProgress={heroProgress} />
      <ExperienceSection initialData={experienceData} />
      <SkillsSection />
      <ProjectSection initialData={projectData} />
      <TestimonialSection />
      <ContactSection />
      <footer className="site-footer">
        <p>© 2026 Panchali Gunasena · Designed & Built with ♥</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [experienceData, setExperienceData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const auth = getAuth();
        await auth.authStateReady?.(); 
      } catch (e) {
        console.warn('Firebase init:', e);
      } finally {
        setFirebaseReady(true);
      }
    };
    init();
  }, []);

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  return (
    <>
      {(!splashDone || !firebaseReady || !experienceData || !projectData) && (
        <SplashScreen
          onComplete={handleSplashComplete}
          setData={(data) => {
            setExperienceData({ experiences: data.experiences, education: data.education });
            setProjectData(data.projects);
          }}
        />
      )}
      {splashDone && firebaseReady && experienceData && projectData && (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage experienceData={experienceData} projectData={projectData} />
              }
            />
            <Route path="/projects" element={<AllProjects />} />
          </Routes>
        </Router>
      )}
    </>
  );
}