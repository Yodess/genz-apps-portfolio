import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

type Sql = NeonQueryFunction<false, false>

// Initialisation paresseuse : neon() lève une erreur à la construction si la
// chaîne de connexion est vide. On diffère donc l'appel jusqu'à la première
// requête afin que le build (qui importe ce module sans exécuter de requête)
// n'échoue pas — les requêtes échouent toujours au runtime si DATABASE_URL manque.
let _sql: Sql | null = null
function getSql(): Sql {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      console.warn('[db] DATABASE_URL non défini — les requêtes échoueront au runtime.')
    }
    _sql = neon(process.env.DATABASE_URL || '')
  }
  return _sql
}

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  getSql()(strings, ...values)) as unknown as Sql

export type RequestStatus = 'new' | 'read' | 'replied' | 'archived'

export interface ContactRequest {
  id: number
  name: string
  email: string
  project_type: string
  budget: string | null
  description: string
  status: RequestStatus
  created_at: string
}

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_requests (
      id           SERIAL PRIMARY KEY,
      name         TEXT NOT NULL,
      email        TEXT NOT NULL,
      project_type TEXT NOT NULL,
      budget       TEXT,
      description  TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'new',
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_requests_created
    ON contact_requests (created_at DESC)
  `
}

export async function insertRequest(data: {
  name: string
  email: string
  projectType: string
  budget?: string | null
  description: string
}) {
  await ensureSchema()
  const rows = await sql`
    INSERT INTO contact_requests (name, email, project_type, budget, description)
    VALUES (${data.name}, ${data.email}, ${data.projectType}, ${data.budget || null}, ${data.description})
    RETURNING id, created_at
  `
  return rows[0] as { id: number; created_at: string }
}

export async function listRequests(): Promise<ContactRequest[]> {
  await ensureSchema()
  const rows = await sql`
    SELECT id, name, email, project_type, budget, description, status, created_at
    FROM contact_requests
    ORDER BY created_at DESC
  `
  return rows as ContactRequest[]
}

export async function updateRequestStatus(id: number, status: RequestStatus) {
  await ensureSchema()
  await sql`UPDATE contact_requests SET status = ${status} WHERE id = ${id}`
}
