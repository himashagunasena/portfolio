import React, { useRef, useEffect, useState } from 'react';
import './ContactSection.css';
import callImg from '../assets/call.png';
import emailIcon from '../assets/icons/email.png';
import behanceIcon from '../assets/icons/behance.png';
import linkedinIcon from '../assets/icons/linkedin.png';
import githubIcon from '../assets/icons/github.png';

function useVisible(ref) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVis(true);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return vis;
}

const CONTACT_DETAILS = [
  {
    icon: emailIcon,
    label: 'gunasena.himasha@gmail.com',
    href: 'mailto:gunasena.himasha@gmail.com',
  },
  {
    icon: behanceIcon,
    label: 'Himasha Gunasena',
    href: 'https://www.behance.net/himashagunasena1',
  },
  {
    icon: linkedinIcon,
    label: 'Panchali (Himasha) Gunasena',
    href: 'https://www.linkedin.com/in/himashagunasena28/',
  },
  {
    icon: githubIcon,
    label: 'Himasha Gunasena',
    href: 'https://github.com/himashagunasena',
  },
];

export default function ContactSection() {
  const ref = useRef(null);
  const vis = useVisible(ref);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(''); 

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
    
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: "service_5ylxw4t",
          template_id: 'template_mmof1zk',
          user_id: 'asRFzJCJb56C8KZI2',
          template_params: {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
          },
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      className={`ct-section ${vis ? 'ct-visible' : ''}`}
      ref={ref}
      id="contact"
    >
      <div className="ct-inner">

        {/* Left — Form card */}
        <div className="ct-form-card">
          <h2 className="ct-form-title">LET'S TALK</h2>
          <p className="ct-form-desc">
            If you have any project or freelancing opportunities, or any business inquiries,
            please message me or send me an email.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="ct-label">Your name</label>
            <input
              className="ct-input"
              name="name"
              placeholder="Joe Doe"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label className="ct-label">Email</label>
            <input
              className="ct-input"
              name="email"
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label className="ct-label">Message</label>
            <textarea
              className="ct-textarea"
              name="message"
              placeholder="Enter Your Message here"
              value={form.message}
              onChange={handleChange}
              required
            />

            {status === 'sent' && <p className="ct-success">✓ Message sent successfully!</p>}
            {status === 'error' && <p className="ct-error">Something went wrong. Please try again.</p>}

            <button className="ct-submit-btn" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Submit message'}
            </button>
          </form>
        </div>

        {/* Right — Details card */}
        <div className="ct-details-card">
          <h3 className="ct-details-title">CONTACT DETAILS</h3>
          <ul className="ct-details-list">
            {CONTACT_DETAILS.map((item, i) => (
              <li key={i} className="ct-detail-item">
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="ct-detail-link">
               
                    <img src={item.icon} alt="" className="ct-detail-icon-img" />
              
                  <span className="ct-detail-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <img src={callImg} alt="Contact illustration" className="ct-illustration" />
        </div>

      </div>
    </section>
  );
}