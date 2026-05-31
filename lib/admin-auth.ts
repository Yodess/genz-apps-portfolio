import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'genz_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12h

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s) throw new Error('ADMIN_SESSION_SECRET manquant')
  return s
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export function checkCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || ''
  const adminPassword = process.env.ADMIN_PASSWORD || ''
  if (!adminEmail || !adminPassword) return false
  return safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase()) &&
         safeEqual(password, adminPassword)
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS
  const payload = String(exp)
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = createHmac('sha256', getSecret()).update(payload).digest('hex')
  if (!safeEqual(sig, expected)) return false
  const exp = Number(payload)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  return true
}

export const SESSION_COOKIE = COOKIE_NAME
export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000
