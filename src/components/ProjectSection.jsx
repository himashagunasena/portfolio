import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import "./ProjectSection.css";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const CATEGORIES = [
  "All",
  "Mobile",
  "Web",
  "UI/UX",
  "Illustrations & Digital painting",
  "Branding Design",
];

const CATEGORY_TYPE_MAP = {
  All: null,
  Mobile: ["mobile"],
  Web: ["web"],
  "UI/UX": ["ui", "ui/ux design", "uiux", "ui/ux"],
  "Illustrations & Digital painting": ["art", "illustration", "paint", "digital painting"],
  "Branding Design": ["branding", "brand", "branding design"],
};

export async function fetchProjectsData() {
  const querySnapshot = await getDocs(collection(db, "projects"));

  let data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  data.sort((a, b) => {
    const getTime = (date) => {
      if (!date) return 0;
      if (date?.seconds) {
        return date.seconds * 1000;
      }
      const parsedDate = new Date(date).getTime();
      return Number.isNaN(parsedDate) ? 0 : parsedDate;
    };
    return getTime(b.date) - getTime(a.date);
  });

  return data;
}

export default function ProjectSection({ initialData }) {
  const [projects, setProjects] = useState(initialData || []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(!initialData);
  const [dialogProject, setDialogProject] = useState(null);
  const [visibleCard, setVisibleCard] = useState(null);

  const navigate = useNavigate();
  const cardRefs = useRef([]);

  useEffect(() => {
    if (initialData) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchProjectsData();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  useEffect(() => {
    if (dialogProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialogProject]);

  const allowedTypes = CATEGORY_TYPE_MAP[activeCategory];

  const filteredAll = !allowedTypes
    ? projects
    : projects.filter((project) =>
        allowedTypes.includes((project.type || "").toLowerCase().trim())
      );

  const filtered = filteredAll.slice(0, 6);

  useEffect(() => {
    if (window.innerWidth > 480) {
      setVisibleCard(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let visibleId = null;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleId = entry.target.getAttribute("data-id");
          }
        });

        if (maxRatio > 0.7) {
          setVisibleCard(visibleId);
        }
      },
      { threshold: [0.3, 0.5, 0.7, 0.9] }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [filtered]);

  const handleClick = (project) => {
    setDialogProject(project);
  };

  const handleViewProject = () => {
    if (!dialogProject?.link) return;
    window.open(dialogProject.link, "_blank", "noopener,noreferrer");
  };

  const closeDialog = () => {
    setDialogProject(null);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && dialogProject) {
        closeDialog();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dialogProject]);

  const isFullHeightImage = [
    "digital painting",
    "branding design",
    "branding",
    "brand",
  ].includes((dialogProject?.type || "").toLowerCase().trim());

  return (
    <section className="ps-section" id="portfolio">
      <div className="title">
        <p>My</p>
        <p className="title-second">Projects</p>
      </div>

      <div className="ps-tabs">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`ps-tab ${activeCategory === category ? "ps-tab--active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="ps-loader">
          <Lottie animationData={loadingAnimation} loop />
        </div>
      ) : filtered.length > 0 ? (
        <div className="ps-grid">
          {filtered.map((project, index) => (
            <div
              key={project.id}
              className="ps-card"
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              data-id={project.id}
              onClick={() => handleClick(project)}
            >
              <img
                src={project.imageURL || "/placeholder.png"}
                alt={project.title || "Project"}
                className="ps-card__img"
                draggable="false"
              />

              <div
                className={`ps-card__overlay ${visibleCard === project.id ? "visible" : ""}`}
              >
                <span className="ps-card__tag">{project.type}</span>
                <h3 className="ps-card__title">{project.title}</h3>
                <p className="ps-card__desc">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ps-empty">No projects found.</div>
      )}

      {filteredAll.length > 6 && (
        <div className="ps-show-more">
          <button onClick={() => navigate("/projects")}>Show More</button>
        </div>
      )}

      {dialogProject &&
        createPortal(
          <div className="dialog-overlay" onClick={closeDialog}>
            <div className="dialog-box" onClick={(event) => event.stopPropagation()}>
              <button
                className="dialog-close"
                onClick={closeDialog}
                aria-label="Close project"
              >
                ✕
              </button>

              <img
                src={dialogProject.imageURL || "/placeholder.png"}
                alt={dialogProject.title || "Project"}
                className={`dialog-image ${isFullHeightImage ? "digital-painting-image" : ""}`}
                draggable="false"
                onContextMenu={(event) => {
                  event.preventDefault();
                  alert("Downloading disabled for this image.");
                }}
              />

              <div className="dialog-content">
                <span className="dialog-category">{dialogProject.type}</span>
                <h3>{dialogProject.title}</h3>

                <div
                  className="dialog-text"
                  dangerouslySetInnerHTML={{
                    __html: dialogProject.description || "",
                  }}
                />
              </div>
               {dialogProject.link && (
                  <button className="dialog-project-button" onClick={handleViewProject}>
                    View Project
                    <span>↗</span>
                  </button>
                )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}