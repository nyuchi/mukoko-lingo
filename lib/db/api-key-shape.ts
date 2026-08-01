/**
 * Maps the real `platform.apiKeys` document shape (UUID `_id`, camelCase
 * fields, `ownerEntityId`/`createdByPersonId`) to and from the API's flat
 * snake_case key shape — the contract the web admin UI (`apiKeysApi`)
 * already consumes, unchanged since the old Lingo-local `api_keys`
 * collection.
 */

import { randomUUID } from 'crypto'
import * as crypto from 'crypto'
import type { PlatformApiKey } from './types'
import { LINGO_SURFACE_CONTEXT } from './types'

export interface ApiKeySummary {
  id: string
  name: string
  organization_id: string
  key_prefix: string
  scopes: string[]
  last_used_at: string | null
  created_at: string | null
  expires_at: string | null
  is_active: boolean
}

export function toApiKeySummary(doc: PlatformApiKey): ApiKeySummary {
  return {
    id: doc._id,
    name: doc.name,
    organization_id: doc.ownerEntityId,
    key_prefix: doc.keyPrefix,
    scopes: doc.scopes ?? [],
    last_used_at: doc.lastUsedAt ? new Date(doc.lastUsedAt).toISOString() : null,
    created_at: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    expires_at: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : null,
    is_active: doc.isActive,
  }
}

export function toApiKeySummaries(docs: PlatformApiKey[]): ApiKeySummary[] {
  return docs.map(toApiKeySummary)
}

export function generateApiKey(): string {
  const prefix = 'mk_live_'
  const secret = crypto.randomBytes(32).toString('hex')
  return `${prefix}${secret}`
}

/**
 * Keyed hash (HMAC-SHA256) rather than a bare SHA-256 digest. The API key
 * itself is a 256-bit random value, so brute-forcing the digest is already
 * infeasible — but a bare hash is still reversible via a precomputed table
 * if the verifier's database ever leaks; keying it to a server-side secret
 * (never stored alongside `keyHashedSecret`) defeats that regardless.
 */
export function hashApiKey(key: string): string {
  const pepper = process.env.API_KEY_HASH_SECRET
  if (!pepper) {
    throw new Error('API_KEY_HASH_SECRET must be set to hash API keys')
  }
  return crypto.createHmac('sha256', pepper).update(key).digest('hex')
}

/**
 * Build a full, schema-compliant `platform.apiKeys` document from flat
 * admin input (create). `_id` is a UUID string. Lingo's org-issued
 * developer keys are always `keyType: 'external'` and always carry the
 * `lingo` surfaceContext.
 */
export function buildApiKeyDoc(params: {
  name: string
  ownerEntityId: string
  createdByPersonId: string
  scopes?: string[]
  expiresInDays?: number | null
}): { doc: PlatformApiKey; plainKey: string } {
  const now = new Date()
  const plainKey = generateApiKey()
  const keyHashedSecret = hashApiKey(plainKey)
  const keyPrefix = plainKey.substring(0, 12) + '...'
  const expiresAt = params.expiresInDays
    ? new Date(now.getTime() + params.expiresInDays * 24 * 60 * 60 * 1000)
    : null

  const doc: PlatformApiKey = {
    _id: randomUUID(),
    _schemaVersion: 'v3.1',
    keyType: 'external',
    ownerEntityId: params.ownerEntityId,
    ownerPersonId: null,
    createdByPersonId: params.createdByPersonId,
    name: params.name,
    keyPrefix,
    keyHashedSecret,
    scopes: params.scopes && params.scopes.length > 0 ? params.scopes : ['read'],
    surfaceContext: LINGO_SURFACE_CONTEXT,
    isActive: true,
    billingReferenceId: null,
    planTier: null,
    expiresAt,
    lastUsedAt: null,
    monthlyRequestCount: 0,
    monthlyRequestLimit: null,
    revokedAt: null,
    revokedReason: null,
    rotationSchedule: null,
    createdAt: now,
    updatedAt: now,
  }

  return { doc, plainKey }
}
