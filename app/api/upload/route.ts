export async function POST(request: Request) {
  try {
    // Basic auth: allow admin or student header. Replace with Supabase Auth verification later.
    const { isAdminRequest, getRequesterStudentId } = await import('@/lib/server-auth')
    if (!isAdminRequest(request) && !getRequesterStudentId(request)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const formData = await (request as any).formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // upload to Supabase storage bucket 'uploads'
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = `uploads/${Date.now()}_${(file as any).name}`

    const { data, error } = await (await import('@/lib/supabase-server')).supabaseAdmin.storage.from('uploads').upload(filename, buffer, { upsert: true })
    if (error) throw error

    const { publicUrl } = (await import('@/lib/supabase-server')).supabaseAdmin.storage.from('uploads').getPublicUrl(data.path)

    return Response.json(
      {
        success: true,
        data: {
          fileName: data.path,
          url: publicUrl,
          size: file.size,
          type: file.type,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json({ success: false, error: (error as any)?.message || 'Upload failed' }, { status: 400 })
  }
}
