import { useState, useEffect, useRef } from 'react'
import ConfirmModal from './ConfirmModal'
import { CONFIG } from '../config'
import './Invitation.css'

const base = import.meta.env.BASE_URL

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(isoDate) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const target = new Date(isoDate).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isoDate])
  return t
}

// ─── Mini calendar ────────────────────────────────────────────────────────────
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS   = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

function MiniCalendar({ isoDate }) {
  const d      = new Date(isoDate)
  const month  = d.getMonth()
  const year   = d.getFullYear()
  const event  = d.getDate()
  const first  = new Date(year, month, 1).getDay()
  const offset = first === 0 ? 6 : first - 1
  const total  = new Date(year, month + 1, 0).getDate()
  const cells  = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  return (
    <div className="mini-cal">
      <div className="mini-cal-month">{MONTHS[month]}</div>
      <div className="mini-cal-grid">
        {DAYS.map(n => <div key={n} className="mini-cal-dn">{n}</div>)}
        {cells.map((n, i) => (
          <div key={i} className={`mini-cal-cell ${n === event ? 'mini-cal-event' : ''} ${!n ? 'mini-cal-empty' : ''}`}>
            {n === event ? <><span className="mini-cal-crown" aria-hidden="true">♛</span><span>{n}</span></> : n}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Blue floral corner ───────────────────────────────────────────────────────
function BlueFloral({ cls }) {
  return (
    <svg viewBox="0 0 130 110" xmlns="http://www.w3.org/2000/svg" className={`blue-floral ${cls}`}>
      <path d="M 10 110 C 20 80 40 60 65 48" stroke="#8f68c0" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M 25 110 C 32 82 50 62 72 55" stroke="#7a50b0" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M 0 90 C 18 72 38 60 58 55" stroke="#a080cc" strokeWidth="1" fill="none" opacity="0.35"/>
      {/* Flower 1 */}
      <circle cx="65" cy="48" r="9" fill="#9a70c8" opacity="0.55"/>
      <circle cx="56" cy="46" r="6" fill="#b090d8" opacity="0.5"/>
      <circle cx="74" cy="46" r="6" fill="#b090d8" opacity="0.5"/>
      <circle cx="65" cy="40" r="6" fill="#b090d8" opacity="0.5"/>
      <circle cx="65" cy="56" r="6" fill="#b090d8" opacity="0.5"/>
      <circle cx="65" cy="48" r="4" fill="#ecdeff" opacity="0.9"/>
      {/* Flower 2 */}
      <circle cx="82" cy="38" r="7" fill="#8050b8" opacity="0.5"/>
      <circle cx="75" cy="36" r="5" fill="#a070cc" opacity="0.45"/>
      <circle cx="89" cy="36" r="5" fill="#a070cc" opacity="0.45"/>
      <circle cx="82" cy="31" r="5" fill="#a070cc" opacity="0.45"/>
      <circle cx="82" cy="38" r="3" fill="#f0e0ff" opacity="0.9"/>
      {/* Flower 3 */}
      <circle cx="45" cy="65" r="6" fill="#9a70c8" opacity="0.48"/>
      <circle cx="39" cy="63" r="4" fill="#b090d8" opacity="0.42"/>
      <circle cx="51" cy="63" r="4" fill="#b090d8" opacity="0.42"/>
      <circle cx="45" cy="59" r="4" fill="#b090d8" opacity="0.42"/>
      <circle cx="45" cy="65" r="2.5" fill="#f0e0ff" opacity="0.9"/>
      {/* Buds */}
      <circle cx="90" cy="52" r="4" fill="#a070cc" opacity="0.4"/>
      <circle cx="30" cy="82" r="3" fill="#9a70c8" opacity="0.35"/>
      <circle cx="95" cy="65" r="3" fill="#b090d8" opacity="0.35"/>
      {/* Leaves */}
      <path d="M 60 55 Q 48 52 42 44" stroke="#6a4a8a" fill="#7a5a9a" strokeWidth="0.8" opacity="0.3"/>
      <path d="M 72 45 Q 78 36 74 28" stroke="#6a4a8a" fill="none" strokeWidth="0.8" opacity="0.25"/>
    </svg>
  )
}

// ─── Intersection observer hook ──────────────────────────────────────────────
function useInView() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// ─── Section divider ─────────────────────────────────────────────────────────
function Divider({ gem = '✦' }) {
  return (
    <div className="inv-divider">
      <span className="inv-div-line" />
      <span className="inv-div-gem">{gem}</span>
      <span className="inv-div-line" />
    </div>
  )
}

// ─── Google Calendar URL ─────────────────────────────────────────────────────
function calendarUrl(isoDate, title, location) {
  const fmt = s => s.replace(/[-:]/g, '').replace('T', 'T').slice(0, 15) + '00'
  const start = fmt(isoDate)
  const end   = fmt(new Date(new Date(isoDate).getTime() + 5 * 3600000).toISOString())
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&location=${encodeURIComponent(location)}`
}

// ─── Moments of the night ─────────────────────────────────────────────────────
const MOMENTS = [
  { icon: '👸', label: 'Recepción'      },
  { icon: '🏰', label: 'Ceremonia'      },
  { icon: '🍽️', label: 'Cena'           },
  { icon: '💃', label: 'Baile Sorpresa' },
  { icon: '🎊', label: 'Hora Loca'      },
  { icon: '🎵', label: 'Show Orquesta'  },
]

function MomentsSection() {
  const [ref, visible] = useInView()
  return (
    <section className="inv-moments-sec" ref={ref}>
      <div className="inv-inner">
        <p className="inv-sec-title">ESA NOCHE VIVIRÁS</p>
        <p className="inv-moments-sub script">momentos que no olvidarás</p>
        <div className="inv-moments-grid">
          {MOMENTS.map((m, i) => (
            <div
              key={i}
              className={`inv-moment-card ${visible ? 'inv-moment-visible' : ''}`}
              style={{ '--delay': `${i * 0.1}s` }}
            >
              <span className="inv-moment-icon">{m.icon}</span>
              <span className="inv-moment-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Invitation({ family }) {
  const [showModal, setShowModal] = useState(false)
  const countdown = useCountdown(CONFIG.eventDateTime)
  const calUrl    = calendarUrl(CONFIG.eventDateTime, `XV Años — ${CONFIG.quinceañera}`, CONFIG.salon)
  const pad = n => String(n).padStart(2, '0')

  return (
    <div className="invitation">
      {showModal && family && (
        <ConfirmModal family={family} onClose={() => setShowModal(false)} />
      )}

      {/* ── HERO PORTADA ──────────────────────────────────────────── */}
      <section className="inv-hero-sec">
        <img src={base + 'foto1.jpg'} alt={CONFIG.quinceañera} className="inv-hero-img" />
        <div className="inv-hero-overlay" />
        <div className="inv-hero-top">
          <span className="inv-hero-crown">♛</span>
          <p className="inv-hero-mis15">MIS XV AÑOS</p>
        </div>
        <p className="inv-hero-name script">{CONFIG.nombreQuince}</p>
      </section>

      {/* ── FRASE + CALENDARIO ────────────────────────────────────── */}
      <section className="inv-quote-sec">
        <BlueFloral cls="bf-bl" />
        <BlueFloral cls="bf-br" />
        <div className="inv-inner">
          <p className="inv-quote">{CONFIG.frase}</p>
          <Divider />
          <p className="inv-reserva-label">RESERVA ESTE DÍA</p>
          <MiniCalendar isoDate={CONFIG.eventDateTime} />
        </div>
      </section>

      {/* ── COUNTDOWN ─────────────────────────────────────────────── */}
      <section className="inv-countdown-sec">
        <p className="inv-countdown-title script">¡Tan solo faltan!</p>
        <div className="inv-countdown-grid">
          {[
            { v: pad(countdown.days),    l: 'DÍAS' },
            { v: pad(countdown.hours),   l: 'HORAS' },
            { v: pad(countdown.minutes), l: 'MINUTOS' },
            { v: pad(countdown.seconds), l: 'SEGUNDOS' },
          ].map(({ v, l }, i, arr) => (
            <>
              <div key={i} className="inv-cd-unit">
                <span className="inv-cd-num">{v}</span>
                <span className="inv-cd-label">{l}</span>
              </div>
              {i < arr.length - 1 && <span key={`sep-${i}`} className="inv-cd-sep" aria-hidden="true">:</span>}
            </>
          ))}
        </div>
      </section>

      {/* ── PADRES ────────────────────────────────────────────────── */}
      <section className="inv-parents-sec">
        <BlueFloral cls="bf-tr" />
        <div className="inv-inner">
          <p className="inv-bendicion script">Con la Bendición de mis...</p>
          <div className="inv-fam-block">
            <p className="inv-fam-role">PADRES</p>
            <p className="inv-fam-name">{CONFIG.padre}</p>
            <p className="inv-fam-name">{CONFIG.madre}</p>
          </div>
        </div>
      </section>

      {/* ── TÍTULO ────────────────────────────────────────────────── */}
      <section className="inv-title-sec">
        <div className="inv-inner">
          <p className="inv-tenemos">Tenemos el agrado de invitarte a...</p>
          <h2 className="inv-mis15 script">Mis 15 Años</h2>
          <div className="inv-event-photo-wrap">
            <img src={base + 'foto2.jpg'} alt={CONFIG.quinceañera} className="inv-event-photo" />
          </div>
        </div>
      </section>

      {/* ── FECHA + LUGAR ─────────────────────────────────────────── */}
      <section className="inv-date-sec">
        <BlueFloral cls="bf-tl" />
        <BlueFloral cls="bf-br" />
        <div className="inv-inner">
          <div className="inv-date-box">
            <span className="inv-date-icon">📅</span>
            <div className="inv-date-parts">
              <span className="inv-date-diasemana">{CONFIG.diaSemana}</span>
              <span className="inv-date-num">{CONFIG.dia}</span>
              <span className="inv-date-mes">{CONFIG.mes}</span>
              <span className="inv-date-year">{CONFIG.año}</span>
            </div>
          </div>
          <a className="inv-btn-outline" href={calUrl} target="_blank" rel="noopener noreferrer">
            Agregar Fecha
          </a>
          <div className="inv-venue-header">
            <Divider gem="📍" />
            <p className="inv-venue-title">RECEPCIÓN</p>
          </div>
          <p className="inv-venue-name">{CONFIG.salon}</p>
          <p className="inv-venue-addr">{CONFIG.direccion}</p>
          <p className="inv-venue-hora">🕗 {CONFIG.hora}</p>
          <a className="inv-btn-solid" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">
            📍 VER UBICACIÓN
          </a>
        </div>
      </section>

      {/* ── MOMENTOS DE LA NOCHE ──────────────────────────────────── */}
      <MomentsSection />

      {/* ── DRESS CODE ────────────────────────────────────────────── */}
      <section className="inv-dresscode-sec">
        <BlueFloral cls="bf-bl" />
        <BlueFloral cls="bf-br" />
        <div className="inv-inner">
          <Divider gem="♛" />
          <p className="inv-dresscode-label">CÓDIGO DE VESTIMENTA</p>
          <p className="inv-dresscode-val script">{CONFIG.dressCode}</p>
          {CONFIG.dressCodeNota && <p className="inv-dresscode-note">{CONFIG.dressCodeNota}</p>}
          <div className="inv-dresscode-colors">
            <p className="inv-dresscode-colors-title">Para mantener la armonía de colores de la noche, les pedimos evitar el color</p>
            <div className="inv-dresscode-swatches">
              <span className="inv-swatch inv-swatch-lila">
                <span className="inv-swatch-dot" />
                Lila
              </span>
              <span className="inv-swatch inv-swatch-jade">
                <span className="inv-swatch-dot" />
                Verde Jade
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MESA DE REGALOS ───────────────────────────────────────── */}
      <section className="inv-gifts-sec">
        <BlueFloral cls="bf-tl" />
        <BlueFloral cls="bf-br" />
        <div className="inv-inner">
          <p className="inv-sec-title">MESA DE REGALOS</p>
          <p className="inv-gifts-text">{CONFIG.regaloTexto}</p>
        </div>
      </section>

      {/* ── CONFIRMACIÓN ──────────────────────────────────────────── */}
      <section className="inv-confirm-sec">
        <div className="inv-inner">
          <p className="inv-sec-title">CONFIRMACIÓN DE ASISTENCIA</p>
          {family && (
            <div className="inv-family-tag">
              <span className="inv-family-name">{family.nombre}</span>
              <span className="inv-family-cupos">
                {family.cupos} cupo{family.cupos !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <p className="inv-confirm-text">
            Sin ti este momento no sería igual. Agradecemos tu confirmación pero
            también entendemos si por alguna razón no puedes asistir. Por favor
            confírmanos antes del <strong>{CONFIG.fechaLimite}</strong>.
          </p>
          <button
            className="inv-btn-solid"
            onClick={e => { e.stopPropagation(); setShowModal(true) }}
          >
            ✓ CONFIRMAR ASISTENCIA
          </button>
          <p className="inv-footer-name script">{CONFIG.quinceañera}</p>
        </div>
      </section>
    </div>
  )
}
