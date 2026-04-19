import { useState, useRef, useEffect } from 'react'
import ConfirmModal from './ConfirmModal'
import { CONFIG } from '../config'
import './Invitation.css'

const base = import.meta.env.BASE_URL

const LEAF_COLORS = ['#c9a050', '#8a5c2a', '#5c8a30', '#c06030', '#a0481a']
const LEAF_PATHS = [
  'M10,1 C14,4 16,9 14,15 C12,20 10,21 10,21 C10,21 6,20 5,15 C4,9 6,4 10,1Z',
  'M10,2 Q17,6 16,13 Q13,19 7,17 Q2,11 5,5 Q7,1 10,2Z',
  'M10,1 C13,3 15,7 14,12 C13,17 11,20 10,20 C9,20 7,17 6,12 C5,7 7,3 10,1Z',
  'M10,2 C14,5 15,9 14,14 C13,18 10,21 10,21 C10,21 7,18 6,14 C5,9 6,5 10,2Z',
]

function LeafParticle({ x, y, type, color, duration, drift, rotStart, rotEnd, delay }) {
  return (
    <div
      className="leaf-particle"
      style={{
        left: x,
        top: y,
        '--duration': `${duration}s`,
        '--drift': `${drift}px`,
        '--rot-start': `${rotStart}deg`,
        '--rot-end': `${rotEnd}deg`,
        '--delay': `${delay}s`,
        color,
      }}
    >
      <svg viewBox="0 0 20 22" width="20" height="22" fill="currentColor">
        <path d={LEAF_PATHS[type]} />
        <line x1="10" y1="4" x2="10" y2="18" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      </svg>
    </div>
  )
}

export default function Invitation({ family }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [leaves, setLeaves] = useState([])
  const [showModal, setShowModal] = useState(false)
  const leafId = useRef(0)
  const scrollRaf = useRef(null)
  const isAutoScrolling = useRef(false)

  useEffect(() => {
    if (isPlaying) {
      isAutoScrolling.current = true
      const SPEED = 55
      let last = null
      const step = (ts) => {
        if (!isAutoScrolling.current) return
        if (last === null) last = ts
        const dt = ts - last
        last = ts
        const maxY = document.documentElement.scrollHeight - window.innerHeight
        const newY = window.scrollY + SPEED * (dt / 1000)
        if (newY >= maxY) {
          window.scrollTo(0, maxY)
          isAutoScrolling.current = false
          return
        }
        window.scrollTo(0, newY)
        scrollRaf.current = requestAnimationFrame(step)
      }
      scrollRaf.current = requestAnimationFrame(step)
    } else {
      isAutoScrolling.current = false
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
    }
    return () => {
      isAutoScrolling.current = false
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
    }
  }, [isPlaying])

  const spawnLeaves = (x, y) => {
    const newLeaves = Array.from({ length: 14 }, () => {
      const id = ++leafId.current
      return {
        id,
        x: x + (Math.random() - 0.5) * 60,
        y,
        type: Math.floor(Math.random() * LEAF_PATHS.length),
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        duration: 2.5 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 160,
        rotStart: Math.random() * 360,
        rotEnd: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.35,
      }
    })
    setLeaves(prev => [...prev, ...newLeaves])
    setTimeout(() => {
      const ids = new Set(newLeaves.map(l => l.id))
      setLeaves(prev => prev.filter(l => !ids.has(l.id)))
    }, 5500)
  }

  const handleInvitationClick = (e) => {
    if (isAutoScrolling.current) {
      isAutoScrolling.current = false
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
      spawnLeaves(e.clientX, e.clientY)
    }
  }

  return (
    <div className="invitation" onClick={handleInvitationClick}>
      {showModal && family && (
        <ConfirmModal family={family} onClose={() => setShowModal(false)} />
      )}
      <div className="leaves-overlay" aria-hidden="true">
        {leaves.map(leaf => <LeafParticle key={leaf.id} {...leaf} />)}
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        {/* Top purple foliage canopy */}
        <svg className="hero-canopy" viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice">
          {/* Left cluster */}
          <path d="M -20 0 C 20 40 80 70 130 60 C 90 45 40 20 -20 0 Z" fill="#5a2080" />
          <path d="M 0 -10 C 30 30 70 65 110 80 C 75 55 35 25 0 -10 Z" fill="#7030a0" />
          <path d="M 20 -10 C 40 25 60 70 55 110 C 40 80 25 40 20 -10 Z" fill="#8840b8" />
          <path d="M -10 20 C 20 55 50 90 45 140 C 28 105 8 65 -10 20 Z" fill="#6a28a0" />
          {/* Glowing lights */}
          <circle cx="130" cy="62" r="5" fill="#f5f0d0" opacity="0.9" />
          <circle cx="115" cy="52" r="3" fill="#f0e880" opacity="0.8" />
          <circle cx="100" cy="70" r="4" fill="#f5f0d0" opacity="0.85" />
          {/* Center */}
          <path d="M 180 -15 C 200 20 220 55 215 90 C 205 65 190 30 180 -15 Z" fill="#8840b8" />
          <path d="M 200 -20 C 225 15 245 50 240 85 C 225 58 210 25 200 -20 Z" fill="#7030a0" />
          <path d="M 220 -10 C 235 30 240 70 230 105 C 218 75 215 38 220 -10 Z" fill="#9858c8" />
          {/* Right cluster */}
          <path d="M 500 0 C 460 40 400 70 350 60 C 390 45 440 20 500 0 Z" fill="#5a2080" />
          <path d="M 480 -10 C 450 30 410 65 370 80 C 405 55 445 25 480 -10 Z" fill="#7030a0" />
          <path d="M 460 -10 C 440 25 420 70 425 110 C 440 80 455 40 460 -10 Z" fill="#8840b8" />
          <path d="M 490 20 C 460 55 430 90 435 140 C 452 105 472 65 490 20 Z" fill="#6a28a0" />
          <circle cx="350" cy="62" r="5" fill="#f5f0d0" opacity="0.9" />
          <circle cx="365" cy="52" r="3" fill="#f0e880" opacity="0.8" />
          <circle cx="378" cy="68" r="4" fill="#f5f0d0" opacity="0.85" />
          {/* Hanging lantern lights - Enredados! */}
          {[80, 150, 240, 330, 400].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="0" x2={x + (i % 2 === 0 ? 5 : -5)} y2="60" stroke="#c9a050" strokeWidth="0.8" opacity="0.5" />
              <rect x={x - 5} y="58" width="10" height="14" rx="3" fill="#f0d060" opacity="0.7" />
              <circle cx={x} cy="65" r="4" fill="#ffe080" opacity="0.8" />
            </g>
          ))}
        </svg>

        {/* Sparkles */}
        <div className="hero-sparkles">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`hero-sparkle hs-${i}`} />
          ))}
        </div>

        {/* Rapunzel figure left */}
        <div className="princess-left">
          <img src={base + 'princesa1.png'} alt="Princesa" className="princess-img" />
        </div>

        {/* Golden branch right */}
        <svg className="golden-branch-right" viewBox="0 0 100 300" xmlns="http://www.w3.org/2000/svg">
          <path d="M 80 5 C 70 80 60 140 75 280" stroke="#c9a050" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M 70 60 C 50 55 30 65 10 58" stroke="#c9a050" strokeWidth="1.5" fill="none" opacity="0.65" />
          <path d="M 72 100 C 55 90 38 100 20 88" stroke="#c9a050" strokeWidth="1.5" fill="none" opacity="0.65" />
          <path d="M 74 150 C 58 140 42 148 25 138" stroke="#c9a050" strokeWidth="1.5" fill="none" opacity="0.6" />
          <ellipse cx="10" cy="58" rx="14" ry="7" fill="#c9a050" opacity="0.5" transform="rotate(-15 10 58)" />
          <ellipse cx="20" cy="88" rx="12" ry="6" fill="#c9a050" opacity="0.5" transform="rotate(-10 20 88)" />
          <ellipse cx="25" cy="138" rx="13" ry="6" fill="#c9a050" opacity="0.5" transform="rotate(-8 25 138)" />
          {/* Lanterns */}
          <circle cx="10" cy="58" r="3" fill="#ffe080" opacity="0.9" />
          <circle cx="20" cy="88" r="2.5" fill="#ffe080" opacity="0.85" />
        </svg>

        {/* Hero inner */}
        <div className="hero-inner">
          <CrownSVG />

          <div className="music-row">
            <span className="heart-deco">♡</span>
            <button
              className={`music-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => setIsPlaying(p => !p)}
              aria-label="Reproducir música"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <span className="heart-deco">♡</span>
          </div>

          <p className="quote-text">{CONFIG.frase}</p>

          <div className="parents-names">
            <span className="parent-name script">{CONFIG.padre}</span>
            <span className="ampersand">&</span>
            <span className="parent-name script">{CONFIG.madre}</span>
          </div>

          <p className="invite-text">Se complacen en invitarles a celebrar los</p>
          <div className="xv-title script">XV</div>
          <p className="adorada-text">De su adorada hija:</p>
          <h1 className="quinceañera-name script">{CONFIG.quinceañera}</h1>
        </div>
      </section>

      {/* ===== PHOTO SECTION ===== */}
      <section className="photo-section">
        <p className="photo-section-label">— La quinceañera —</p>

        <div className="photo-frame-wrapper">
          {/* Decorative rings */}
          <div className="photo-ring photo-ring-3" />
          <div className="photo-ring photo-ring-2" />
          <div className="photo-ring photo-ring-1" />

          {/* Floating flowers */}
          <div className="photo-flowers">
            <span className="photo-flower pf-1">✿</span>
            <span className="photo-flower pf-2">✾</span>
            <span className="photo-flower pf-3">✿</span>
            <span className="photo-flower pf-4">✾</span>
          </div>

          <div className="photo-circle">
            <img src={base + 'foto_cumple.jpg'} alt={CONFIG.quinceañera} />
          </div>
        </div>

        <p className="photo-name-tag script">{CONFIG.quinceañera}</p>
      </section>

      {/* ===== DATE SECTION ===== */}
      <section className="date-section">
        <svg className="side-branch left-branch" viewBox="0 0 70 240" xmlns="http://www.w3.org/2000/svg">
          <path d="M 60 10 C 50 80 45 150 55 230" stroke="#c9a050" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 52 50 C 35 45 18 55 5 45" stroke="#c9a050" strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 50 110 C 35 100 20 108 5 98" stroke="#c9a050" strokeWidth="1.5" fill="none" opacity="0.55" />
          <ellipse cx="5" cy="45" rx="13" ry="6" fill="#c9a050" opacity="0.5" transform="rotate(-12 5 45)" />
          <ellipse cx="5" cy="98" rx="12" ry="5.5" fill="#c9a050" opacity="0.5" transform="rotate(-8 5 98)" />
        </svg>

        <svg className="side-branch right-branch" viewBox="0 0 70 240" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(-1,1) translate(-70,0)">
            <path d="M 60 10 C 50 80 45 150 55 230" stroke="#c9a050" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 52 50 C 35 45 18 55 5 45" stroke="#c9a050" strokeWidth="1.5" fill="none" opacity="0.55" />
            <path d="M 50 110 C 35 100 20 108 5 98" stroke="#c9a050" strokeWidth="1.5" fill="none" opacity="0.55" />
            <ellipse cx="5" cy="45" rx="13" ry="6" fill="#c9a050" opacity="0.5" transform="rotate(-12 5 45)" />
            <ellipse cx="5" cy="98" rx="12" ry="5.5" fill="#c9a050" opacity="0.5" transform="rotate(-8 5 98)" />
          </g>
        </svg>

        <div className="date-content">
          <div className="butterfly-row">
            <ButterflyIcon /><ButterflyIcon /><ButterflyIcon />
          </div>

          <div className="date-block">
            <div className="date-month">{CONFIG.mes}</div>
            <div className="date-row">
              <span className="date-day-label">{CONFIG.diaSemana}</span>
              <span className="date-num">{CONFIG.dia}</span>
              <span className="date-time">{CONFIG.hora}</span>
            </div>
            <div className="date-year">{CONFIG.año}</div>
          </div>

          <div className="divider-ornament">
            <div className="divider-line" />
            <span className="divider-gem">◆</span>
            <div className="divider-line" />
          </div>

          <div className="venue-block">
            <div className="castle-row">
              <CastleSVG />
              <div className="venue-text">
                <p className="venue-name">{CONFIG.salon}</p>
                <p className="venue-address">{CONFIG.direccion}</p>
              </div>
              <CastleSVG />
            </div>
          </div>

          <a className="green-btn" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">
            <span>📍</span> VER UBICACIÓN
          </a>
        </div>
      </section>

      {/* ===== DRESS CODE SECTION ===== */}
      <section className="dresscode-section">
        <div className="dresscode-butterflies">
          <ButterflyIcon /><ButterflyIcon />
        </div>

        <div className="dresscode-content">
          <p className="section-label">DRESS CODE:</p>
          <div className="dresscode-icons">
            <TieSVG />
            <DressSVG />
          </div>
          <p className="dresscode-title script">{CONFIG.dressCode}</p>
          <p className="dresscode-note">{CONFIG.dressCodeNota}</p>
        </div>

        <div className="princess-right-small">
          <img src={base + 'princesa1.png'} alt="Princesa" className="princess-img princess-img-small" />
        </div>
      </section>

      {/* ===== CONFIRM SECTION ===== */}
      <section className="confirm-section">
        <div className="confirm-content">
          <CalendarSVG />
          {family && (
            <div className="family-tag">
              <span className="family-tag-label">Invitados especiales</span>
              <span className="family-tag-name">{family.nombre}</span>
              <span className="family-tag-cupos">{family.cupos} cupo{family.cupos !== 1 ? 's' : ''} reservado{family.cupos !== 1 ? 's' : ''}</span>
            </div>
          )}
          <p className="confirm-text">
            Por favor, confirme su asistencia antes<br />
            del <strong>{CONFIG.fechaLimite}.</strong>
          </p>
          <button
            className="green-btn confirm-btn"
            onClick={e => { e.stopPropagation(); setShowModal(true) }}
          >
            <span>✓</span> CONFIRMAR
          </button>
          <p className="gift-text">
            Tu presencia en este día tan especial es el mejor regalo,
            pero si deseas obsequiarme un detalle, una contribución en
            efectivo será recibida con mucho cariño y gratitud.
          </p>
          <div className="lluvia-block">
            <div className="lluvia-envelope">
              <LluviaSobreSVG />
            </div>
            <p className="lluvia-label">LLUVIA DE SOBRES</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER SECTION ===== */}
      <section className="footer-section">
        <svg className="castle-silhouette" viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
          <g opacity="0.1" fill="#5a1e88">
            <rect x="140" y="60" width="200" height="120" />
            <rect x="160" y="40" width="40" height="30" />
            <rect x="220" y="20" width="40" height="50" />
            <rect x="280" y="40" width="40" height="30" />
            <rect x="100" y="80" width="50" height="100" />
            <rect x="330" y="80" width="50" height="100" />
            {[142,158,174,190,206,222,238,254,270,286,302,318].map((x, i) => (
              <rect key={i} x={x} y="55" width="8" height="10" />
            ))}
          </g>
        </svg>

        <svg className="footer-foliage-svg" viewBox="0 0 480 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
          <path d="M -10 100 C 20 60 50 40 80 70 C 50 50 20 30 -10 60 Z" fill="#7030a0" opacity="0.7" />
          <path d="M 30 100 C 45 65 70 45 95 60 C 70 45 45 30 30 65 Z" fill="#8840b8" opacity="0.65" />
          <path d="M 380 100 C 400 60 430 40 450 65 C 430 48 400 30 380 60 Z" fill="#7030a0" opacity="0.7" />
          <path d="M 420 100 C 435 68 455 48 475 62 C 455 48 435 33 420 65 Z" fill="#8840b8" opacity="0.65" />
          <path d="M 200 100 C 215 75 235 60 250 72 C 235 60 215 48 200 72 Z" fill="#8840b8" opacity="0.5" />
        </svg>

        <p className="te-esperamos script">¡Te esperamos!</p>
        <div className="footer-hearts">
          <span>♡</span><span>♡</span><span>♡</span>
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   SVG COMPONENTS — Paleta Lila / Enredados
   ============================================================ */

function CrownSVG() {
  return (
    <svg viewBox="0 0 130 80" xmlns="http://www.w3.org/2000/svg" className="crown-svg">
      <defs>
        <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d870" />
          <stop offset="100%" stopColor="#c09030" />
        </linearGradient>
      </defs>
      <polygon points="10,65 30,20 65,48 100,20 120,65" fill="url(#crownGold)" />
      <polygon points="10,65 30,20 65,48 100,20 120,65" fill="none" stroke="#a07820" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="8" y="62" width="114" height="10" rx="5" fill="url(#crownGold)" stroke="#a07820" strokeWidth="1" />
      <circle cx="65" cy="46" r="7" fill="#c050a0" stroke="#a07820" strokeWidth="1" />
      <circle cx="30" cy="22" r="5" fill="#8050e0" stroke="#a07820" strokeWidth="1" />
      <circle cx="100" cy="22" r="5" fill="#a050d0" stroke="#a07820" strokeWidth="1" />
      <circle cx="62" cy="43" r="2.5" fill="rgba(255,255,255,0.6)" />
      <circle cx="28" cy="20" r="1.8" fill="rgba(255,255,255,0.5)" />
      <circle cx="98" cy="20" r="1.8" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

function RapunzelSVG({ small }) {
  const w = small ? 100 : 150
  return (
    <svg viewBox="0 0 180 500" xmlns="http://www.w3.org/2000/svg" style={{ width: w, height: 'auto' }}>
      {/* ---- BIG PURPLE DRESS SKIRT ---- */}
      <ellipse cx="90" cy="420" rx="82" ry="52" fill="#8a40b8" opacity="0.88" />
      <ellipse cx="90" cy="375" rx="68" ry="72" fill="#9a50c8" opacity="0.92" />
      {/* Highlights */}
      <ellipse cx="60" cy="385" rx="20" ry="58" fill="#c098e0" opacity="0.38" />
      <ellipse cx="122" cy="380" rx="16" ry="52" fill="#c098e0" opacity="0.32" />
      {/* Ruffles */}
      <path d="M 15 415 Q 52 398 90 408 Q 128 398 165 415" stroke="#7030a8" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M 20 440 Q 55 425 90 432 Q 125 425 160 440" stroke="#7030a8" strokeWidth="2" fill="none" opacity="0.4" />
      {/* ---- BODICE ---- */}
      <ellipse cx="90" cy="298" rx="36" ry="58" fill="#8a40b8" />
      <path d="M 64 268 Q 90 255 116 268" stroke="#6a2098" strokeWidth="1.5" fill="none" />
      {/* ---- ARMS ---- */}
      <path d="M 56 278 Q 38 286 30 306 Q 28 316 36 322" stroke="#d4a882" strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M 124 278 Q 142 286 150 306 Q 152 316 144 322" stroke="#d4a882" strokeWidth="15" fill="none" strokeLinecap="round" />
      {/* ---- NECK ---- */}
      <rect x="81" y="230" width="18" height="22" rx="8" fill="#d4a882" />
      {/* ---- HEAD ---- */}
      <ellipse cx="90" cy="205" rx="28" ry="30" fill="#c8956a" />
      {/* ---- LONG BLONDE HAIR (Rapunzel!) ---- */}
      {/* Hair flows down the side */}
      <path d="M 78 210 C 65 240 55 290 48 350 C 44 390 46 430 50 480" stroke="#e8c840" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M 76 212 C 62 245 52 300 46 360 C 42 400 44 440 48 480" stroke="#f0d840" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Hair on head */}
      <ellipse cx="90" cy="185" rx="28" ry="18" fill="#e8c840" />
      <ellipse cx="70" cy="198" rx="12" ry="20" fill="#e8c840" />
      <ellipse cx="110" cy="195" rx="10" ry="18" fill="#d4b030" />
      {/* Braid/bun detail */}
      <circle cx="90" cy="170" r="14" fill="#e8c840" />
      <path d="M 78 170 Q 90 162 102 170" stroke="#c8a820" strokeWidth="2" fill="none" />
      {/* ---- FACE ---- */}
      <ellipse cx="82" cy="205" rx="4" ry="4.5" fill="#0d0804" />
      <ellipse cx="98" cy="205" rx="4" ry="4.5" fill="#0d0804" />
      <circle cx="80.5" cy="203" r="1.5" fill="white" opacity="0.7" />
      <circle cx="96.5" cy="203" r="1.5" fill="white" opacity="0.7" />
      <path d="M 75 198 Q 82 195 86 197" stroke="#1a0e05" strokeWidth="1.5" fill="none" />
      <path d="M 94 197 Q 98 195 105 198" stroke="#1a0e05" strokeWidth="1.5" fill="none" />
      <path d="M 84 215 Q 90 222 96 215" stroke="#9a4030" strokeWidth="2" fill="#c06050" />
      <circle cx="76" cy="212" r="5.5" fill="#e0705a" opacity="0.3" />
      <circle cx="104" cy="212" r="5.5" fill="#e0705a" opacity="0.3" />
      {/* ---- FLOWER in hair ---- */}
      <circle cx="105" cy="178" r="7" fill="#e060a0" />
      <circle cx="105" cy="178" r="4" fill="#f0a0c0" />
      {/* ---- TIARA ---- */}
      <path d="M 68 180 L 75 168 L 82 176 L 90 162 L 98 176 L 105 168 L 112 180" stroke="#c9a050" strokeWidth="2.5" fill="none" />
      <circle cx="90" cy="162" r="4.5" fill="#c9a050" />
      <circle cx="75" cy="168" r="3" fill="#c9a050" />
      <circle cx="105" cy="168" r="3" fill="#c9a050" />
    </svg>
  )
}

function CastleSVG() {
  return (
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="castle-svg">
      <g fill="#8a40b8">
        <rect x="10" y="45" width="60" height="35" />
        <rect x="8" y="30" width="20" height="25" />
        <rect x="52" y="30" width="20" height="25" />
        <rect x="30" y="22" width="20" height="28" />
        {[10,22,34,46,58].map((x, i) => <rect key={i} x={x} y="38" width="8" height="8" />)}
        {[8,18].map((x, i) => <rect key={i} x={x} y="24" width="7" height="7" />)}
        {[52,62].map((x, i) => <rect key={i} x={x} y="24" width="7" height="7" />)}
        {[30,40].map((x, i) => <rect key={i} x={x} y="16" width="7" height="7" />)}
        <path d="M 30 80 L 30 58 Q 40 50 50 58 L 50 80 Z" fill="#6a1898" />
        <rect x="14" y="36" width="8" height="10" rx="4" fill="#d0a8f0" />
        <rect x="58" y="36" width="8" height="10" rx="4" fill="#d0a8f0" />
        <rect x="34" y="28" width="8" height="10" rx="4" fill="#d0a8f0" />
      </g>
    </svg>
  )
}

function TieSVG() {
  return (
    <svg viewBox="0 0 48 100" xmlns="http://www.w3.org/2000/svg" className="dresscode-svg">
      <defs>
        <linearGradient id="tieGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a28a0" />
          <stop offset="100%" stopColor="#9858c8" />
        </linearGradient>
      </defs>
      <polygon points="24,2 34,8 30,18 24,16 18,18 14,8" fill="#5a1888" />
      <polygon points="18,17 30,17 34,50 24,90 14,50" fill="url(#tieGrad)" />
    </svg>
  )
}

function DressSVG() {
  return (
    <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="dresscode-svg" style={{ width: 50 }}>
      <defs>
        <linearGradient id="dressGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a50c8" />
          <stop offset="100%" stopColor="#7030a8" />
        </linearGradient>
      </defs>
      <rect x="24" y="4" width="10" height="22" rx="5" fill="#8840b8" />
      <rect x="46" y="4" width="10" height="22" rx="5" fill="#8840b8" />
      <path d="M 18 22 Q 40 14 62 22 L 58 44 Q 40 38 22 44 Z" fill="#9a50c8" />
      <path d="M 20 43 Q 4 62 2 96 L 78 96 Q 76 62 60 43 Q 40 50 20 43 Z" fill="url(#dressGrad)" />
    </svg>
  )
}

function CalendarSVG() {
  return (
    <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" className="calendar-svg">
      <rect x="5" y="18" width="80" height="68" rx="8" fill="none" stroke="#8a40b8" strokeWidth="2.5" />
      <rect x="5" y="18" width="80" height="22" rx="8" fill="#8a40b8" />
      <rect x="5" y="30" width="80" height="10" fill="#8a40b8" />
      <line x1="28" y1="10" x2="28" y2="26" stroke="#8a40b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="62" y1="10" x2="62" y2="26" stroke="#8a40b8" strokeWidth="3" strokeLinecap="round" />
      {[22, 38, 54].map(x =>
        [50, 65, 78].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#8a40b8" opacity="0.55" />
        ))
      )}
      <circle cx="65" cy="62" r="17" fill="#8a40b8" />
      <path d="M 56 62 L 63 70 L 76 52" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LluviaSobreSVG() {
  return (
    <svg viewBox="0 0 110 82" xmlns="http://www.w3.org/2000/svg" className="lluvia-svg">
      <defs>
        <linearGradient id="sobreBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c080e8" />
          <stop offset="100%" stopColor="#8a3ab8" />
        </linearGradient>
        <linearGradient id="sobreFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#daa8f8" />
          <stop offset="100%" stopColor="#b070d8" />
        </linearGradient>
        <filter id="sobreShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(60,0,100,0.35)" />
        </filter>
      </defs>

      {/* Envelope body */}
      <rect x="4" y="22" width="102" height="56" rx="7" ry="7" fill="url(#sobreBody)" filter="url(#sobreShadow)" />

      {/* Side folds */}
      <polygon points="4,22 55,54 4,78" fill="#9850c8" />
      <polygon points="106,22 55,54 106,78" fill="#9850c8" />
      {/* Bottom fold */}
      <polygon points="4,78 55,50 106,78" fill="#7830a8" />

      {/* Top flap (open) */}
      <polygon points="4,22 106,22 55,56" fill="url(#sobreFlap)" />
      <polygon points="4,22 106,22 55,56" fill="none" stroke="#c898e8" strokeWidth="0.8" />

      {/* Decorative border dashes */}
      <rect x="4" y="22" width="102" height="56" rx="7" ry="7"
        fill="none" stroke="rgba(220,180,255,0.55)" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* Wax seal */}
      <circle cx="55" cy="55" r="14" fill="#6a20a0" />
      <circle cx="55" cy="55" r="10.5" fill="#7a30b0" />
      <circle cx="55" cy="55" r="9" fill="none" stroke="#c9a050" strokeWidth="1" />
      <text x="55" y="60" textAnchor="middle" fill="#f0d060" fontSize="11" fontFamily="serif">♡</text>

      {/* Gold sparkles around envelope */}
      <circle cx="18" cy="16" r="2.5" fill="#f0d060" opacity="0.75" />
      <circle cx="92" cy="13" r="2" fill="#f0d060" opacity="0.7" />
      <circle cx="5" cy="50" r="1.8" fill="#f0d060" opacity="0.6" />
      <circle cx="105" cy="60" r="2" fill="#f0d060" opacity="0.65" />
      {/* Stars */}
      <text x="8" y="20" fill="#f0d060" fontSize="8" opacity="0.7">✦</text>
      <text x="96" y="18" fill="#f0d060" fontSize="7" opacity="0.65">✦</text>

      {/* Small paper peeking out */}
      <rect x="36" y="8" width="38" height="24" rx="3" fill="#f5eeff" opacity="0.9" />
      <line x1="42" y1="14" x2="68" y2="14" stroke="#c090e0" strokeWidth="1.2" opacity="0.6" />
      <line x1="42" y1="19" x2="68" y2="19" stroke="#c090e0" strokeWidth="1.2" opacity="0.6" />
      <line x1="42" y1="24" x2="60" y2="24" stroke="#c090e0" strokeWidth="1.2" opacity="0.6" />
    </svg>
  )
}

function ButterflyIcon() {
  return (
    <svg viewBox="0 0 64 44" xmlns="http://www.w3.org/2000/svg" className="butterfly-svg">
      <path d="M 32 22 Q 14 4 6 14 Q -2 24 32 22 Z" fill="#b870e0" opacity="0.75" />
      <path d="M 32 22 Q 50 4 58 14 Q 66 24 32 22 Z" fill="#b870e0" opacity="0.75" />
      <path d="M 32 22 Q 14 30 12 40 Q 10 48 32 24 Z" fill="#9050c0" opacity="0.65" />
      <path d="M 32 22 Q 50 30 52 40 Q 54 48 32 24 Z" fill="#9050c0" opacity="0.65" />
      <ellipse cx="32" cy="23" rx="2.5" ry="7" fill="#4a1070" />
      <path d="M 31 17 Q 26 10 22 8" stroke="#4a1070" strokeWidth="1" fill="none" />
      <path d="M 33 17 Q 38 10 42 8" stroke="#4a1070" strokeWidth="1" fill="none" />
      <circle cx="22" cy="8" r="1.5" fill="#4a1070" />
      <circle cx="42" cy="8" r="1.5" fill="#4a1070" />
    </svg>
  )
}
