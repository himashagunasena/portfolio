import React from 'react';
import './CurvedText.css';

export default function CurvedText({ text }) {
  return (
    <div className="curved-text-wrapper">
      <svg viewBox="0 0 800 200" className="curved-text-svg">
        <path
          id="curvePath"
          d="M 50,180 A 380,380 0 0,1 750,180"
          fill="transparent"
        />
        <text>
          <textPath
            href="#curvePath"
            startOffset="50%"
            textAnchor="middle"
            className="curved-text"
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}