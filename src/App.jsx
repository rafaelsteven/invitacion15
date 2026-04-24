import { useState, useRef, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import EnvelopeScreen from './components/EnvelopeScreen'
import Invitation from './components/Invitation'
import MusicPlayer from './components/MusicPlayer'
import { useFamilyData } from './hooks/useFamilyData'
import './App.css'

const base = import.meta.env.BASE_URL

function InvitationFlow() {
  const [phase, setPhase] = useState('envelope')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)
  const { family, loading, error } = useFamilyData()

  useEffect(() => {
    const audio = new Audio(base + 'musica.mp3')
    audio.loop = true
    audio.volume = 0.7
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  const handleOpen = () => {
    setPhase('opening')
    audioRef.current?.play().catch(() => {})
    setMusicPlaying(true)
    setTimeout(() => setPhase('invitation'), 2000)
  }

  const handleToggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (musicPlaying) {
      audio.pause()
      setMusicPlaying(false)
    } else {
      audio.play().catch(() => {})
      setMusicPlaying(true)
    }
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
      </div>
    )
  }

  if (error === 'not-found') {
    return (
      <div className="app-error">
        <p className="app-error-icon">♛</p>
        <p className="app-error-text">Invitación no encontrada</p>
        <p className="app-error-sub">Verifica que el enlace sea correcto</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <p className="app-error-icon">✦</p>
        <p className="app-error-text">No se pudo cargar la invitación</p>
        <p className="app-error-sub">Por favor recarga la página</p>
      </div>
    )
  }

  return (
    <div className="app">
      {phase !== 'invitation' && (
        <EnvelopeScreen onOpen={handleOpen} isOpening={phase === 'opening'} family={family} />
      )}
      {phase === 'invitation' && <Invitation family={family} />}
      {phase !== 'envelope' && (
        <MusicPlayer audioRef={audioRef} playing={musicPlaying} onToggle={handleToggleMusic} />
      )}
    </div>
  )
}

function NoInvite() {
  return (
    <div className="app-error">
      <p className="app-error-icon">♛</p>
      <p className="app-error-text">Accede con tu enlace personal</p>
      <p className="app-error-sub">Revisa el mensaje que te enviamos</p>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/:familyId" element={<InvitationFlow />} />
        <Route path="/" element={<NoInvite />} />
      </Routes>
    </HashRouter>
  )
}

export default App
