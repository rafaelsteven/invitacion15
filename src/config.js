// ============================================================
// CONFIGURACIÓN — edita aquí todos los datos del evento
// ============================================================

export const CONFIG = {
  // ── Evento ──────────────────────────────────────────────
  nombreQuince: 'Anahi',
  quinceañera:  'Anahi Rafaela Calderón Vera',
  padre:        'Cesar Calderón',
  madre:        'Lady Vera',

  // Fecha — para el countdown usa formato ISO
  eventDateTime: '2026-06-27T20:00:00',
  mes:          'JUNIO',
  diaSemana:    'SÁBADO',
  dia:          '27',
  hora:         '8:00 P.M.',
  año:          '2026',

  // Venue
  salon:        'rio eventos',
  direccion:    'Av. Narcisa de jesus - Distrito',
  mapsUrl:      'https://maps.google.com/?q=-2.084605,-79.895172',

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
  dressCode:       'Elegante',
  dressCodeNota:   'Les pedimos asistir elegantes para hacer de esta noche algo especial.',

  // Regalos
  regaloTexto: 'Nada me hará más feliz que celebrar este momento junto a ti. Si deseás acompañarme con un regalo, agradeceré tu aporte en un sobre durante la fiesta.',
  vapeUrl:     '',

  // Confirmación
  fechaLimite:  '01 de junio',

  // Frase de la quinceañera
  frase: 'Hay momentos en la vida que representan un antes y un después. El comienzo y el fin de una etapa, y lo que los hace realmente especial son las personas con las que se comparten. Quiero que tú seas una de ellas.',

  // ── Google Sheets ────────────────────────────────────────
  sheetId:      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRrk-5QblcJhsJNbJjlUKggpipSQTKQqDzq-Ywxl0nK1oOv7WUD_GwQNN5zZkwEIurVHVt1G9j7CWBP/pub?gid=0&single=true&output=csv',
  scriptUrl:    'https://script.google.com/macros/s/AKfycby7VgTU6_qVRsNbCqV0hTig5EVJIdE_UlD-pUE5ZiRhE2lKA3MekBqoNbpuqocNOx_o1g/exec',
  whatsappNumber: '593958784775',
}
