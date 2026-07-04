// ============================================================
// CONFIGURACIÓN — edita aquí todos los datos del evento
// ============================================================

export const CONFIG = {
  // ── Evento ──────────────────────────────────────────────
  nombreQuince: 'Ashley',
  quinceañera:  'Ashley Rosaura Numerable Moreira',
  padre:        'Jorge Numerable',
  madre:        'Ines Moreira',

  // Fecha — para el countdown usa formato ISO
  eventDateTime: '2026-08-29T17:00:00',
  mes:          'Agosto',
  diaSemana:    'SÁBADO',
  dia:          '29',
  hora:         '5:00 P.M.',
  año:          '2026',

  // Venue
  salon:        'Casa de mis padres',
  direccion:    '',
  mapsUrl:      '',

  // Itinerario
  itinerario: [
    { hora: '08:30 PM', evento: 'RECEPCIÓN',       icon: '👸' },
    { hora: '09:30 PM', evento: 'CEREMONIA',        icon: '🏰' },
    { hora: '10:30 PM', evento: 'CENA',             icon: '🍽️' },
    { hora: '10:45 PM', evento: 'APERTURA BAR',     icon: '🍸' },
    { hora: '11:30 PM', evento: 'BAILE SORPRESA',   icon: '💃' },
    { hora: '01:00 AM', evento: 'HORA LOCA',        icon: '🎊' },
    { hora: '02:00 AM', evento: 'SHOW ORQUESTA',    icon: '🎵' },
    { hora: '04:30 AM', evento: 'FIN DE FIESTA',    icon: '🎆' },
  ],

  // Dress code
  dressCode:       'Como te sientas comodo',
  dressCodeNota:   'Lo más importante es que te sientas cómod@ y disfrutes de esta noche tan especial con nosotros.',

  // Regalos
  regaloTexto: 'Nada me hará más feliz que celebrar este momento junto a ti. Si deseás acompañarme con un regalo, agradeceré tu aporte en efectivo',
  vapeUrl:     '',

  // Confirmación
  fechaLimite:  '08 de junio',

  // Frase de la quinceañera
  frase: 'Con inmensa alegría, te invitamos a celebrar un momento inolvidable: mis quince años. Tu presencia hará de este día un recuerdo aún más especial.',

  // ── Google Sheets ────────────────────────────────────────
  sheetId:      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRrk-5QblcJhsJNbJjlUKggpipSQTKQqDzq-Ywxl0nK1oOv7WUD_GwQNN5zZkwEIurVHVt1G9j7CWBP/pub?gid=0&single=true&output=csv',
  scriptUrl:    'https://script.google.com/macros/s/AKfycby7VgTU6_qVRsNbCqV0hTig5EVJIdE_UlD-pUE5ZiRhE2lKA3MekBqoNbpuqocNOx_o1g/exec',
  whatsappNumber: '593967635515',
}
