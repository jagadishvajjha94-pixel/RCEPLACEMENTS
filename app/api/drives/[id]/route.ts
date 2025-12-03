import { getPlacementDrive } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const drive = await getPlacementDrive(id)

    if (!drive) {
      return Response.json({ success: false, error: "Drive not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: drive })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch drive" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    // Update placement drive
    return Response.json({ success: true, data: { id, ...body } })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update drive" }, { status: 400 })
  }
}
