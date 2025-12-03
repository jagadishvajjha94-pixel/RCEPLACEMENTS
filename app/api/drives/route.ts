import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { isAdminRequest } from '@/lib/server-auth'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('drives').select('*').order('createdAt', { ascending: false })
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const payload = {
      ...body,
      createdAt: new Date().toISOString(),
    }
    const { data, error } = await supabaseAdmin.from('drives').insert([payload]).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const id = body.id
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const payload = { ...body }
    delete payload.id
    const { data, error } = await supabaseAdmin.from('drives').update(payload).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAdminRequest(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const { error } = await supabaseAdmin.from('drives').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || String(err) }, { status: 500 })
  }
}
