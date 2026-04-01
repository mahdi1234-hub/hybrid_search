// Legacy Supabase server client - replaced by Prisma + JWT auth
// Kept as stub to prevent import errors from remaining references

export async function createClient() {
  throw new Error('Supabase is not configured. Using email OTP auth instead.')
}
