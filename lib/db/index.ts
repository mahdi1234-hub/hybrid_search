import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as relations from './relations'
import * as schema from './schema'

// For server-side usage only
// Use restricted user for application if available, otherwise fall back to regular user
const isDevelopment = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.VERCEL_ENV === undefined

// Skip database initialization during build phase to allow
// static page generation without a live database connection.
function getConnectionString(): string {
  const connectionString =
    process.env.DATABASE_RESTRICTED_URL ??
    process.env.DATABASE_URL ??
    (isTest ? 'postgres://user:pass@localhost:5432/testdb' : undefined)

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL or DATABASE_RESTRICTED_URL environment variable is not set'
    )
  }
  return connectionString
}

// SSL configuration: Use environment variable to control SSL
// DATABASE_SSL_DISABLED=true disables SSL completely (for local/Docker PostgreSQL)
// Default is to enable SSL with certificate verification (for cloud databases like Neon, Supabase)
const sslConfig =
  process.env.DATABASE_SSL_DISABLED === 'true'
    ? false // Disable SSL entirely for local PostgreSQL
    : { rejectUnauthorized: true } // Enable SSL with verification for cloud DBs

let _db: ReturnType<typeof drizzle<typeof schema & typeof relations>> | null =
  null

function getDb() {
  if (_db) return _db

  const connectionString = getConnectionString()

  // Log which connection is being used (for debugging)
  if (isDevelopment) {
    console.log(
      '[DB] Using connection:',
      process.env.DATABASE_RESTRICTED_URL
        ? 'Restricted User (RLS Active)'
        : 'Owner User (RLS Bypassed)'
    )
  }

  const client = postgres(connectionString, {
    ssl: sslConfig,
    prepare: false,
    max: 20 // Max 20 connections
  })

  _db = drizzle(client, {
    schema: { ...schema, ...relations }
  })

  // Verify restricted user permissions on startup
  if (process.env.DATABASE_RESTRICTED_URL && !isTest) {
    if (
      typeof window === 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      ;(async () => {
        try {
          const result = await _db!.execute<{ current_user: string }>(
            sql`SELECT current_user`
          )
          const currentUser = result[0]?.current_user

          if (isDevelopment) {
            console.log('[DB] Connection verified as user:', currentUser)
          }

          if (
            currentUser &&
            !currentUser.includes('app_user') &&
            !currentUser.includes('neondb_owner')
          ) {
            console.warn(
              '[DB] Warning: Expected app_user but connected as:',
              currentUser
            )
          }
        } catch (error) {
          console.error('[DB] Failed to verify database connection:', error)
        }
      })()
    }
  }

  return _db
}

// Use a Proxy so that `db` can be imported at the top level without
// eagerly connecting. All property accesses are forwarded to the
// lazily-initialised Drizzle instance.
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop, receiver) {
    const instance = getDb()
    const value = Reflect.get(instance, prop, receiver)
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  }
})

// Helper type for all tables
export type Schema = typeof schema
