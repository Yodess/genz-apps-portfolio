import { listRequests, type ContactRequest } from '@/lib/db'
import { AdminDashboard } from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  let requests: ContactRequest[] = []
  let dbError = false
  try {
    requests = await listRequests()
  } catch (e) {
    console.error('[admin] chargement demandes échoué:', e)
    dbError = true
  }
  return <AdminDashboard initialRequests={requests} dbError={dbError} />
}
