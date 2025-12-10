import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdminRequest, getRequesterStudentId } from '@/lib/server-auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const driveId = searchParams.get('driveId')
    const studentId = searchParams.get('studentId')

    let query = supabaseAdmin.from('registrations').select('*')
    if (driveId) query = query.eq('driveId', driveId)
    if (studentId) query = query.eq('studentId', studentId)

    const { data, error } = await query
    if (error) throw error
    return Response.json({ success: true, data })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // allow creation if requester student id header matches body.studentId or admin key provided
    const requester = getRequesterStudentId(request)
    if (!isAdminRequest(request) && (!requester || requester !== body.studentId)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const payload = {
      ...body,
      submittedAt: new Date().toISOString(),
    }
    const { data, error } = await supabaseAdmin.from('registrations').insert([payload]).select().single()
    if (error) throw error
    return Response.json({ success: true, data }, { status: 201 })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || String(err) }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return Response.json({ success: false, error: 'Missing id' }, { status: 400 })

    // Authorization: admin or owner (student)
    const requester = getRequesterStudentId(request)
    const existing = await supabaseAdmin.from('registrations').select('studentId').eq('id', id).single()
    if (existing.error) throw existing.error
    const ownerId = existing.data?.studentId
    if (!isAdminRequest(request) && (!requester || requester !== ownerId)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin.from('registrations').update(updates).eq('id', id).select().single()
    if (error) throw error
    return Response.json({ success: true, data })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || String(err) }, { status: 400 })
  }
}
 