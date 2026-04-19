// ============================================================
// APPS SCRIPT — Pega este código en Google Sheets
// Extensiones → Apps Script → pega y guarda → Implementar
// ============================================================

function doGet(e) {
  const id         = e.parameter.id
  const confirmado = e.parameter.confirmado

  if (!id || !confirmado) {
    return responder({ error: 'Faltan parámetros' })
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  const data  = sheet.getDataRange().getValues()

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(id).trim()) {
      sheet.getRange(i + 1, 4).setValue(confirmado) // Columna D = Confirmado
      return responder({ success: true, familia: data[i][1] })
    }
  }

  return responder({ error: 'Familia no encontrada' })
}

function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
