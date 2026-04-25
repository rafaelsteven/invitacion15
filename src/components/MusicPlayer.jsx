import { useState, useEffect, useRef } from 'react'
import './MusicPlayer.css'

export default function MusicPlayer({ audioRef, playing, onToggle }) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [showVol, setShowVol] = useState(false)
  const [dragging, setDragging] = useState(false)
  const volRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => { if (!dragging) setCurrentTime(audio.currentTime) }
    const onLoaded = () => setDuration(audio.duration)
    const onEnded = () => { audio.currentTime = 0; audio.play() }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    if (audio.duration) setDuration(audio.duration)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audioRef, dragging])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (volRef.current && !volRef.current.contains(e.target)) setShowVol(false)
    }
    if (showVol) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showVol])

  const seek = (e) => {
    const val = Number(e.target.value)
    audioRef.current.currentTime = val
    setCurrentTime(val)
  }

  const skip = (secs) => {
    const audio = audioRef.current
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + secs, duration))
  }

  const changeVolume = (e) => {
    const val = Number(e.target.value)
    audioRef.current.volume = val
    setVolume(val)
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="music-player">
      {/* Disco giratorio */}
      <div className={`music-disc ${playing ? 'spinning' : ''}`}>
        <div className="music-disc-inner" />
      </div>

      {/* Centro: título + barra */}
      <div className="music-center">
        <p className="music-song-title">♪ Taylor Swift - Daylight</p>
        <div className="music-progress-row">
          <span className="music-time">{fmt(currentTime)}</span>
          <div className="music-slider-wrap">
            <div className="music-slider-track">
              <div className="music-slider-fill" style={{ width: `${progress}%` }} />
            </div>
            <input
              type="range"
              className="music-range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onMouseDown={() => setDragging(true)}
              onTouchStart={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              onTouchEnd={() => setDragging(false)}
              onChange={seek}
            />
          </div>
          <span className="music-time">{fmt(duration)}</span>
        </div>

        {/* Controles */}
        <div className="music-controls">
          <button className="music-btn" onClick={() => skip(-15)} aria-label="Retroceder 15s">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              <text x="8" y="14" fontSize="6" fill="currentColor" fontFamily="sans-serif">15</text>
            </svg>
          </button>

          <button className="music-btn music-btn-play" onClick={onToggle} aria-label={playing ? 'Pausar' : 'Reproducir'}>
            {playing
              ? <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              : <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>

          <button className="music-btn" onClick={() => skip(15)} aria-label="Adelantar 15s">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
              <text x="8" y="14" fontSize="6" fill="currentColor" fontFamily="sans-serif">15</text>
            </svg>
          </button>
        </div>
      </div>

      {/* Volumen */}
      <div className="music-vol-wrap" ref={volRef}>
        <button
          className="music-btn music-vol-icon"
          onClick={() => setShowVol(v => !v)}
          aria-label="Volumen"
        >
          {volume === 0
            ? <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            : volume < 0.5
            ? <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          }
        </button>
        {showVol && (
          <div className="music-vol-popup">
            <input
              type="range"
              className="music-range music-vol-range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={changeVolume}
            />
          </div>
        )}
      </div>
    </div>
  )
}
