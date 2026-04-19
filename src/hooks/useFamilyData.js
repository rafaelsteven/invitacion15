import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CONFIG } from '../config'

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === ',' && !inQuotes) { result.push(current); current = '' }
    else { current += ch }
  }
  result.push(current)
  return result
}

function parseCSV(text) {
  const lines = text.trim().split('\n').filter(Boolean)
  return lines.slice(1).map(line => {
    const cols = parseCSVLine(line)
    return {
      id:         cols[0]?.trim().replace(/^"|"$/g, ''),
      nombre:     cols[1]?.trim().replace(/^"|"$/g, ''),
      cupos:      parseInt(cols[2]?.trim()) || 1,
      confirmado: cols[3]?.trim().replace(/^"|"$/g, ''),
      url:        cols[4]?.trim().replace(/^"|"$/g, ''),
    }
  }).filter(r => r.id)
}

export function useFamilyData() {
  const { familyId } = useParams()
  const [family, setFamily] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!familyId) { setLoading(false); return }

    const csvUrl = CONFIG.sheetId

    fetch(csvUrl)
      .then(r => { if (!r.ok) throw new Error('fetch'); return r.text() })
      .then(csv => {
        const rows = parseCSV(csv)
        const found = rows.find(r => r.id === familyId)
        if (found) setFamily(found)
        else setError('not-found')
      })
      .catch(() => setError('fetch-error'))
      .finally(() => setLoading(false))
  }, [familyId])

  return { family, loading, error, familyId }
}

export async function recordConfirmation(familyId, asiste) {
  const value = asiste ? 'Sí' : 'No'
  try {
    await fetch(`${CONFIG.scriptUrl}?id=${encodeURIComponent(familyId)}&confirmado=${encodeURIComponent(value)}`, {
      method: 'GET',
      mode: 'no-cors',
    })
  } catch {
    // fire-and-forget
  }
}
