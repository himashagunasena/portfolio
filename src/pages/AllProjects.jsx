import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../components/ProjectSection.css";
import "./AllProjects.css";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const CATEGORIES = ["All", "Mobile", "Web", "UI/UX", "Illustrations & Digital painting", "Branding Design"];

const CATEGORY_TYPE_MAP = {
  "All": null,
  "Mobile": ["mobile"],
  "Web": ["web"],
  "UI/UX": ["ui", "ui/ux", "uiux"],
  "Illustrations & Digital painting": ["art", "illustration", "paint", "digital painting"],
  "Branding Design": ["branding", "brand"],
};

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [dialogProject, setDialogProject] = useState(null);
  const [visibleCard, setVisibleCard] = useState(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => {
          const getTime = (d) => d?.seconds ? d.seconds * 1000 : new Date(d).getTime();
          return getTime(b.date) - getTime(a.date);
        });
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const allowedTypes = CATEGORY_TYPE_MAP[activeCategory];
  const filtered = projects
    .filter(p => !allowedTypes || allowedTypes.includes((p.type || "").toLowerCase().trim()))
    .filter(p => !search.trim() || p.title?.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (window.innerWidth > 480) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let visibleId = null;
        entries.forEach(entry => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleId = entry.target.getAttribute("data-id");
          }
        });
        if (maxRatio > 0.7) setVisibleCard(visibleId);
      },
      { threshold: [0.3, 0.5, 0.7, 0.9] }
    );
    cardRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [filtered]);

  const handleClick = (p) => {
    const type = (p.type || "").toLowerCase();
    if (["art", "illustration", "paint", "digital painting"].includes(type)) {
      setDialogProject(p);
    } else if (p.link) {
      window.open(p.link, "_blank");
    }
  };

  return (
    <section className="ps-section ap-section">

      <div className="title ap-title">
        <p>All</p><p className="title-second">Projects</p>
      </div>

      {/* Search bar */}
      <div className="ap-search-wrapper">
        <div className="ap-search-box">
          <svg className="ap-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="ap-search-input"
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ap-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="ps-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`ps-tab${activeCategory === cat ? " ps-tab--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="ps-loader">
          <Lottie animationData={loadingAnimation} loop />
        </div>
      ) : filtered.length === 0 ? (
        <div className="ps-empty">No projects found.</div>
      ) : (
        <div className="ps-grid">
          {filtered.map((p, index) => (
            <div
              key={p.id}
              className="ps-card"
              ref={el => cardRefs.current[index] = el}
              data-id={p.id}
              onClick={() => handleClick(p)}
            >
              <img
                src={p.imageURL || "/placeholder.png"}
                alt={p.title}
                className="ps-card__img"
              />
              <div
                className="ps-card__overlay"
                style={{
                  opacity: window.innerWidth > 480 ? undefined : visibleCard === p.id ? 1 : 0,
                  transform: window.innerWidth > 480 ? undefined : visibleCard === p.id ? "translateY(0)" : "translateY(20px)",
                  pointerEvents: window.innerWidth > 480 ? undefined : visibleCard === p.id ? "auto" : "none",
                }}
              >
                <span className="ps-card__tag">{p.type}</span>
                <h3 className="ps-card__title">{p.title}</h3>
                <p className="ps-card__desc">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogProject && (
        <div className="dialog-overlay" onClick={() => setDialogProject(null)}>
          <div className="dialog-box" onClick={e => e.stopPropagation()}>
            <button className="dialog-close" onClick={() => setDialogProject(null)}>✕</button>
            <img
              src={dialogProject.imageURL}
              alt={dialogProject.title}
              className="dialog-image"
              onContextMenu={e => { e.preventDefault(); alert("Downloading disabled for this image."); }}
            />
            <div className="dialog-content">
              <h3>{dialogProject.title}</h3>
              <p className="dialog-text">{dialogProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}