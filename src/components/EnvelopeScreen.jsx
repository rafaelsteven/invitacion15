import { CONFIG } from '../config'
import './EnvelopeScreen.css'

export default function EnvelopeScreen({ onOpen, isOpening, family }) {
  return (
    <div className={`envelope-screen ${isOpening ? 'opening' : ''}`}>

      <div className="env-bg-overlay" />

      {/* TOP LEFT botanical corner */}
      <svg className="corner-deco corner-tl" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.88">
          <path d="M 10 10 C 20 60 80 100 140 90 C 100 70 60 40 10 10 Z" fill="#7a3a9a" />
          <path d="M 10 10 C 40 50 90 80 140 90" stroke="#5a1878" strokeWidth="1.5" fill="none" />
          <path d="M 10 10 C 50 30 90 50 100 120 C 70 80 40 50 10 10 Z" fill="#9050b8" />
          <path d="M 10 10 C 45 40 80 70 100 120" stroke="#5a1878" strokeWidth="1.5" fill="none" />
          <path d="M 5 30 C 30 55 60 100 70 150 C 45 110 20 70 5 30 Z" fill="#a868c8" />
          <path d="M 5 30 C 28 68 55 108 70 150" stroke="#6a2888" strokeWidth="1.2" fill="none" />
          <path d="M 40 5 C 50 25 55 60 45 80 C 42 60 38 30 40 5 Z" fill="#b880d8" />
          {/* Golden flowers */}
          <circle cx="138" cy="92" r="6" fill="#f0d060" opacity="0.85" />
          <circle cx="148" cy="86" r="4" fill="#e8c840" opacity="0.75" />
          <circle cx="130" cy="100" r="5" fill="#f5e070" opacity="0.8" />
          <path d="M 60 5 C 65 30 70 60 65 90" stroke="#9050b8" strokeWidth="1.5" fill="none" />
          <path d="M 65 90 C 80 80 100 75 120 85" stroke="#9050b8" strokeWidth="1.2" fill="none" />
        </g>
      </svg>

      {/* TOP RIGHT botanical corner */}
      <svg className="corner-deco corner-tr" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.88" transform="scale(-1,1) translate(-220,0)">
          <path d="M 10 10 C 20 60 80 100 140 90 C 100 70 60 40 10 10 Z" fill="#7a3a9a" />
          <path d="M 10 10 C 40 50 90 80 140 90" stroke="#5a1878" strokeWidth="1.5" fill="none" />
          <path d="M 10 10 C 50 30 90 50 100 120 C 70 80 40 50 10 10 Z" fill="#9050b8" />
          <path d="M 5 30 C 30 55 60 100 70 150 C 45 110 20 70 5 30 Z" fill="#a868c8" />
          <path d="M 40 5 C 50 25 55 60 45 80 C 42 60 38 30 40 5 Z" fill="#b880d8" />
          <circle cx="138" cy="92" r="6" fill="#f0d060" opacity="0.85" />
          <circle cx="148" cy="86" r="4" fill="#e8c840" opacity="0.75" />
          <path d="M 60 5 C 65 30 70 60 65 90" stroke="#9050b8" strokeWidth="1.5" fill="none" />
          <path d="M 65 90 C 80 80 100 75 120 85" stroke="#9050b8" strokeWidth="1.2" fill="none" />
        </g>
      </svg>

      {/* BOTTOM corners */}
      <svg className="corner-deco corner-bl" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.72" transform="scale(1,-1) translate(0,-160)">
          <path d="M 5 10 C 30 40 80 70 120 60 C 85 50 40 25 5 10 Z" fill="#9050b8" />
          <path d="M 5 10 C 35 45 70 65 120 60" stroke="#6a2888" strokeWidth="1.2" fill="none" />
          <path d="M 5 10 C 30 30 55 70 50 110 C 35 80 15 45 5 10 Z" fill="#a868c8" />
        </g>
      </svg>

      <svg className="corner-deco corner-br" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.72" transform="scale(-1,-1) translate(-160,-160)">
          <path d="M 5 10 C 30 40 80 70 120 60 C 85 50 40 25 5 10 Z" fill="#9050b8" />
          <path d="M 5 10 C 35 45 70 65 120 60" stroke="#6a2888" strokeWidth="1.2" fill="none" />
          <path d="M 5 10 C 30 30 55 70 50 110 C 35 80 15 45 5 10 Z" fill="#a868c8" />
        </g>
      </svg>

      {/* Sparkles */}
      {[...Array(14)].map((_, i) => (
        <div key={i} className={`sparkle sparkle-${i + 1}`} />
      ))}

      {/* Main content */}
      <div className="envelope-content">
        <p className="mis-xv-label">Mis XV</p>
        <h1 className="name-title">{CONFIG.quinceañera}</h1>

        {/* Family invitation greeting */}
        <div className="family-invite-block">
          <span className="family-ornament">✦</span>
          <p className="te-invitamos-text">¡Te invitamos, familia!</p>
          <span className="family-ornament">✦</span>
        </div>

        {/* Family name */}
        {family && <p className="family-name-display">{family.nombre}</p>}

        <div
          className={`envelope-wrapper ${isOpening ? 'envelope-open' : ''}`}
          onClick={!isOpening ? onOpen : undefined}
        >
          <EnvelopeSVG isOpening={isOpening} />

          {!isOpening && (
            <div className="envelope-hint">
              <span className="hint-cursor">✦</span>
              <span>Dale click para abrir la invitación</span>
            </div>
          )}
        </div>

        <div className="pases-section">
          <p className="hemos-reservado">Hemos reservado para ti:</p>
          <div className="pases-row">
            {Array.from({ length: family?.cupos ?? 0 }, (_, i) => (
              <div key={i} className="pase-item">
                <span className="pase-num">{i + 1}</span>
                <div className="heart-icon">♡</div>
              </div>
            ))}
          </div>
          <p className="pases-label">Pases en tu honor</p>
        </div>
      </div>
    </div>
  )
}

function EnvelopeSVG({ isOpening }) {
  return (
    <svg
      className={`envelope-svg ${isOpening ? 'opening' : ''}`}
      viewBox="0 0 300 210"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="envBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a8f0" />
          <stop offset="100%" stopColor="#b080d8" />
        </linearGradient>
        <linearGradient id="envFlapGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0c0f8" />
          <stop offset="100%" stopColor="#c898e8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="150" cy="205" rx="120" ry="6" fill="rgba(80,20,120,0.15)" />

      {/* Envelope body */}
      <rect x="5" y="55" width="290" height="148" rx="10" ry="10" fill="url(#envBodyGrad)" />

      {/* Bottom fold */}
      <polygon points="5,203 150,125 295,203" fill="#9860c8" />
      {/* Left flap */}
      <polygon points="5,55 150,125 5,203" fill="#a870d0" />
      {/* Right flap */}
      <polygon points="295,55 150,125 295,203" fill="#a870d0" />

      {/* Top flap */}
      <g className={`env-flap ${isOpening ? 'env-flap-open' : ''}`} style={{ transformOrigin: '150px 55px' }}>
        <polygon points="5,55 295,55 150,130" fill="url(#envFlapGrad)" />
        <polygon points="5,55 295,55 150,130" fill="none" stroke="#9060b8" strokeWidth="1" />
      </g>

      {/* Wax seal */}
      <circle cx="150" cy="128" r="22" fill="#7a3aaa" />
      <circle cx="150" cy="128" r="18" fill="#8a48b8" />
      <text x="150" y="135" textAnchor="middle" fill="#f0d060" fontSize="20" fontFamily="serif">♡</text>

      {/* Decorative dashed border */}
      <rect x="5" y="55" width="290" height="148" rx="10" ry="10"
        fill="none" stroke="#b080d0" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.65" />
    </svg>
  )
}
