import React, { useRef, useEffect, useState } from 'react';
import './SkillsSection.css';
import illustratorImg from '../assets/illustrator_me.png';
import flutterIcon from '../assets/icons/flutter.png';
import reactIcon from '../assets/icons/react.png';
import kotlinIcon from '../assets/icons/kotlin.png';
import figmaIcon from '../assets/icons/figma.png';
import xdIcon from '../assets/icons/xd.png';
import psIcon from '../assets/icons/ps.png';
import aiIcon from '../assets/icons/ai.png';
import CurvedText from '../widget/CurvedText';

function useVisible(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

const SKILLS_LEFT = [
  {
    title: 'Mobile Development',
    desc: 'I have 5 years industrial experience in Flutter, Kotlin and React Native. IDE: Android Studio & VS Code ',
    icons: [
      { label: 'Flutter', icon: flutterIcon },
      { label: 'React',   icon: reactIcon },
      { label: 'Kotlin',  icon: kotlinIcon },
    ],
  },
  {
    title: 'Web Development',
    desc: 'Experience in MERN stack web development projects.',
    icons: [
      { label: 'React', icon: reactIcon },
    ],
  },
];

const SKILLS_RIGHT = [
  {
    title: 'UI/UX Designing',
    desc: 'Freelancing experience over 5 years in UI/UX designing. Tools: Figma & Adobe XD',
    icons: [
      { label: 'Figma', icon: figmaIcon },
      { label: 'XD',    icon: xdIcon },
    ],
  },
  {
    title: 'Digital Painting & Creative Design',
    desc: 'Experience in digital painting, concept art, logo and branding design. Tools: Adobe Photoshope & Adobe ',
    icons: [
      { label: 'Photoshop',  icon: psIcon },
      { label: 'Illustrator', icon: aiIcon },
    ],
  },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const visible = useVisible(ref);

  return (
    <section className={`skills-section${visible ? ' visible' : ''}`} ref={ref} id="skills">
      <CurvedText className="curve" text=". Skills & Tools ." />
      <div className="skills-inner">
       <div className="skills-grid-left">
  {SKILLS_LEFT.map((s, i) => (
    <div
      key={i}
      className={`skill-card${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${i * 0.12}s` }}
    >
      <div className="skill-card-overlay"></div>
      <h4 className="skill-title">{s.title}</h4>
      <p className="skill-desc">{s.desc}</p>
      <div className="skill-icons">
        {s.icons.map((ic, j) => (
          <img src={ic.icon} alt={ic.label} className="skill-icon-img" key={j} />
        ))}
      </div>
    </div>
  ))}
</div>
        <div className="skills-char">
          <img
            src={illustratorImg}
            alt="Illustrator character"
            className="skills-char-img"
          />
        </div>
        <div className="skills-grid-right">
          {SKILLS_RIGHT.map((s, i) => (
            <div key={i} className="skill-card" style={{ animationDelay: `${(i + 2) * 0.12}s` }}>
              <h4 className="skill-title">{s.title}</h4>
              <p className="skill-desc">{s.desc}</p>
              <div className="skill-icons">
                {s.icons.map((ic, j) => (
                  <img src={ic.icon} alt={ic.label} className="skill-icon-img" key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}