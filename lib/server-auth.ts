// Minimal server-side authorization helpers
// NOTE: This is a pragmatic short-term solution. Replace with Supabase Auth verification for production.

export function isAdminRequest(request: Request): boolean {
  try {
    const adminKey = process.env.ADMIN_API_KEY || ''
    const header = request.headers.get('x-admin-secret') || ''
    return !!adminKey && header === adminKey
  } catch (err) {
    return false
  }
}

export function getRequesterStudentId(request: Request): string | null {
  try {
    const id = request.headers.get('x-student-id')
    return id || null
  } catch (err) {
    return null
  }
}
