/**
 * Organization API Key Management
 *
 * Allows org admins to self-service create and manage API keys
 * for programmatic access to the Lingo platform.
 *
 * Backed by the shared, ecosystem-wide `platform.apiKeys` collection —
 * not a Lingo-local table. Every key Lingo issues is `keyType: 'external'`
 * with `surfaceContext: 'lingo'`, owned by an `entity.entities` org
 * (`ownerEntityId`).
 *
 * Roles: admin (platform) or org_admin (organization-level)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors } from '../../_lib/cors'
import { requireAuth } from '../../_lib/auth-middleware'
import { classMemberships, platformApiKeys, getDb } from '../../_lib/mongo'
import { buildApiKeyDoc, toApiKeySummaries } from '../../../lib/db/api-key-shape'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return

  try {
    const user = await requireAuth(req)

    // Verify org admin or platform admin
    if (user.role !== 'admin') {
      const membershipsCol = await classMemberships()
      const membership = await membershipsCol.findOne({ person_id: user.personId, role: 'teacher' })

      if (!membership) {
        return res.status(403).json({ error: 'Org admin or platform admin role required' })
      }
    }

    const col = await platformApiKeys()

    if (req.method === 'GET') {
      const keys = await col
        .find({ createdByPersonId: user.personId, surfaceContext: 'lingo' })
        .sort({ createdAt: -1 })
        .toArray()

      return res.status(200).json({ data: toApiKeySummaries(keys) })
    }

    if (req.method === 'POST') {
      const { name, organization_id: ownerEntityId, scopes, expires_in_days: expiresInDays } = req.body || {}
      if (!name || !ownerEntityId) {
        return res.status(400).json({ error: 'name and organization_id are required' })
      }

      // Lightweight existence check — organization_id must reference a real
      // entity.entities document. Not a full authorization check (e.g. we
      // don't verify the caller belongs to that org); see PR description.
      const entitiesCol = (await getDb('entity')).collection('entities')
      const entity = await entitiesCol.findOne({ _id: ownerEntityId })
      if (!entity) {
        return res.status(400).json({ error: 'organization_id does not reference a known entity' })
      }

      const { doc, plainKey } = buildApiKeyDoc({
        name,
        ownerEntityId,
        createdByPersonId: user.personId,
        scopes,
        expiresInDays,
      })

      await col.insertOne(doc as any)

      // Return the plain key only once — it's stored hashed
      return res.status(201).json({
        data: {
          id: doc._id,
          name: doc.name,
          organization_id: doc.ownerEntityId,
          key_prefix: doc.keyPrefix,
          scopes: doc.scopes,
          created_at: doc.createdAt.toISOString(),
          expires_at: doc.expiresAt ? doc.expiresAt.toISOString() : null,
          key: plainKey,
        },
        warning: 'Save this API key — it will not be shown again.',
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return res.status(401).json({ error: 'Unauthorized' })
    if (error.message === 'Forbidden') return res.status(403).json({ error: 'Forbidden' })
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
