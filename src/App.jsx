import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import EnvelopeScreen from './components/EnvelopeScreen'
import Invitation from './components/Invitation'
import { useFamilyData } from './hooks/useFamilyData'
import './App.css'

function InvitationFlow() {
  const [phase, setPhase] = useState('envelope')
  const { family, loading, error } = useFamilyData()

  const handleOpen = () => {
    setPhase('opening')
    setTimeout(() => setPhase('invitation'), 2000)
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
