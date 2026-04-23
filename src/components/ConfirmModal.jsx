import { useState } from 'react'
import { createPortal } from 'react-dom'
import { recordConfirmation } from '../hooks/useFamilyData'
import { CONFIG } from '../config'
import './ConfirmModal.css'

export default function ConfirmModal({ family, onClose }) {
  const [loading, setLoading] = useState(false)

  const handleChoice = async (asiste) => {
    setLoading(true)
    await recordConfirmation(family.id, asiste)

    const msg = asiste
      ? `Hola! Confirmo mi asistencia a los XV de ${CONFIG.quinceañera} 🎉\nFamilia: ${family.nombre}\nCupos: ${family.cupos} persona${family.cupos !== 1 ? 's' : ''}`
      : `Hola! Lamentablemente no podré asistir a los XV de ${CONFIG.quinceañera} 😢\nFamilia: ${family.nombre}`

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    onClose()
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-crown">♛</div>
        <h2 className="modal-title script">¿Confirmas tu asistencia?</h2>

        <div className="modal-family-info">
          <p className="modal-family-name">{family.nombre}</p>
          <p className="modal-cupos">{family.cupos} cupo{family.cupos !== 1 ? 's' : ''} reservado{family.cupos !== 1 ? 's' : ''}</p>
        </div>

        <p className="modal-subtitle">
          Más que una fiesta, esta noche es un recuerdo que quiero guardar para siempre.
        </p>

        <div className="modal-buttons">
          <button
            className="modal-btn modal-btn-yes"
            onClick={() => handleChoice(true)}
            disabled={loading}
          >
            <span>✓</span> Sí, asistiré
          </button>
          <button
            className="modal-btn modal-btn-no"
            onClick={() => handleChoice(false)}
            disabled={loading}
          >
            <span>✗</span> No podré asistir
          </button>
        </div>

        <p className="modal-whatsapp-note">Se abrirá WhatsApp para completar la confirmación</p>
      </div>
    </div>,
    document.body
  )
}
