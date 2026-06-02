import { listRequests, type ContactRequest } from '@/lib/db'
import { listGuildAdmin, type GuildAdmin } from '@/lib/guild'
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

  let guild: GuildAdmin[] = []
  let guildDbError = false
  try {
    guild = await listGuildAdmin()
  } catch (e) {
    console.error('[admin] chargement candidatures guilde échoué:', e)
    guildDbError = true
  }

  return (
    <AdminDashboard
      initialRequests={requests}
      dbError={dbError}
      initialGuild={guild}
      guildDbError={guildDbError}
    />
  )
}
