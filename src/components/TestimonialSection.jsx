import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import './TestimonialSection.css';
import rainbowCat from '../assets/rainbow_cat.png';
import rainbowCatMobile from '../assets/rainbow_cat_mobile.png';
import loveCat from '../assets/love.png';

const AUTO_INTERVAL = 3000;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

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

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="tm-stars-input">
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          className={`tm-star-btn ${n <= (hovered || value) ? 'active' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >★</span>
      ))}
    </div>
  );
}

function StarDisplay({ value }) {
  return (
    <div className="tm-stars-display">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`tm-star ${n <= value ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

function FeedbackModal({ onClose }) {
  const [form, setForm] = useState({ name:'', position:'', company:'', feedback:'', rating:0, service:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = e => { if(e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
  async function fetchReviews() {
    const q = query(
      collection(db, "testimonials"),
      where("approve", "==", true),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  fetchReviews();
}, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.position.trim()) return setError('Please enter your position.');
    if (!form.feedback.trim()) return setError('Please write your feedback.');
    if (form.rating === 0) return setError('Please give a rating.');

    setError('');
    setLoading(true);

    try {
      await addDoc(collection(db, "testimonials"), {
        name: form.name.trim(),
        position: form.position.trim(),
        company: form.company.trim(),
        feedback: form.feedback.trim(),
        service: form.service.trim(),
        rating: form.rating,
        approve: false,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong.');
    }

    setLoading(false);
  };

  return createPortal(
    <div className="tm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tm-modal">
        {submitted ? (
          <div className="tm-thankyou">
            <h2 className="tm-ty-title">Thank you so much</h2>
            <p className="tm-ty-desc">
              Your feedback has been successfully submitted to Panchali Himasha Gunasena. I truly appreciate your support.
            </p>
            <img src={loveCat} alt="Thank you" className="tm-ty-img"/>
          </div>
        ) : (
          <>
            <div className="tm-modal-header">
              <h2 className="tm-form-title">Add Your Feedback</h2>
              <button className="tm-modal-close" onClick={onClose}>✕</button>
            </div>

            <label className="tm-label">Your name</label>
            <input className="tm-input" name="name" placeholder="Joe Doe" value={form.name} onChange={handleChange} />

            <label className="tm-label">Position</label>
            <input className="tm-input" name="position" placeholder="Ex: Software Engineer" value={form.position} onChange={handleChange} />

            <label className="tm-label">Company <span className="tm-optional">(Optional)</span></label>
            <input className="tm-input" name="company" placeholder="Ex: Google" value={form.company} onChange={handleChange} />

            <label className="tm-label">Service <span className="tm-optional">(Optional)</span></label>
            <input className="tm-input" name="service" placeholder="Ex: Logo Design" value={form.service} onChange={handleChange} />

            <label className="tm-label">Feedback</label>
            <textarea
              className="tm-textarea"
              name="feedback"
              placeholder="Write your feedback here"
              maxLength={250}
              value={form.feedback}
              onChange={handleChange}
            />
            <div className="tm-char-count">{form.feedback.length}/250</div>

            <p className="tm-rating-label">Rating for my services</p>
            <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />

            {error && <p className="tm-error">{error}</p>}

            <button className="tm-submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit your feedback'}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function TestimonialSection() {
  const ref = useRef(null);
  const vis = useVisible(ref);
  const isMobile = useIsMobile();

  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const dragStartX = useRef(null);
  const autoRef = useRef(null);

  useEffect(() => {
    async function fetchReviews() {
      const q = query(collection(db, "testimonials"), where("approve","==",true));
      const snap = await getDocs(q);
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchReviews();
  }, []);

  const visibleCount = isMobile ? 1 : 2;
  const total = reviews.length > visibleCount ? reviews.length - visibleCount + 1 : 1;

  const goTo = useCallback((idx) => {
    const looped = ((idx % total) + total) % total;
    setCurrent(looped);
  }, [total]);

  const stopAuto = () => clearInterval(autoRef.current);
  const startAuto = useCallback(() => {
    stopAuto();
    if (reviews.length <= visibleCount) return;
    autoRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, AUTO_INTERVAL);
  }, [reviews.length, visibleCount, total]);

  useEffect(() => {
    if (!reviews.length) return;
    startAuto();
    return () => stopAuto();
  }, [reviews.length, startAuto]);

  const onMouseDown = e => {
    stopAuto();
    dragStartX.current = e.clientX;
    const onMouseMove = ev => setDragOffset(ev.clientX - dragStartX.current);
    const onMouseUp = ev => {
      const diff = dragStartX.current - ev.clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      setDragOffset(0);
      dragStartX.current = null;
      startAuto();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onTouchStart = e => {
    stopAuto();
    dragStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = e => {
    if (dragStartX.current === null) return;
    setDragOffset(e.touches[0].clientX - dragStartX.current);
  };
  const onTouchEnd = e => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    setDragOffset(0);
    dragStartX.current = null;
    startAuto();
  };

  return (
    <section className={`tm-section ${vis ? 'tm-visible' : ''}`} ref={ref} id='review'>
      <h2 className="tm-heading">TESTIMONIAL</h2>

      <div
        className="tm-slider-wrapper"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y', cursor: 'grab', userSelect: 'none' }}
      >
        <div
          className="tm-slider-track"
          style={{
            transform: `translateX(calc(-${current * (100 / visibleCount)}% - ${current * 16}px + ${dragOffset}px))`,
            transition: dragOffset === 0 ? 'transform 0.5s ease' : 'none'
          }}
        >
          {reviews.map(r => (
            <div key={r.id} className="tm-card">
              <div className="tm-card-top">
                <span className="tm-quote">"</span>
                {r.service && <span className="tm-service-tag">{r.service}</span>}
              </div>
              <p className="tm-card-text">{r.feedback}</p>
              <div className="tm-card-bottom">
                <StarDisplay value={r.rating}/>
                <p className="tm-card-name">{r.name}</p>
                {r.company && <p className="tm-card-company">{r.company}</p>}
                <p className="tm-card-position">{r.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {reviews.length > visibleCount && (
        <div className="tm-dots">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              className={`tm-dot ${i === current ? 'tm-dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      <div className="tm-share">
        <img
          src={isMobile ? rainbowCatMobile : rainbowCat}
          alt="Rainbow Cat"
          className="tm-share-img"
        />
        <div className="tm-share-content">
          <h3 className="tm-share-title">Share Your Experience</h3>
          <p className="tm-share-desc">
            We'd love to hear your feedback about our service. Your testimonial helps us grow and serve you better.
          </p>
          <button className="tm-share-btn" onClick={() => setShowModal(true)}>
            Write your feedback
          </button>
        </div>
      </div>

      {showModal && <FeedbackModal onClose={() => setShowModal(false)} />}
    </section>
  );
}