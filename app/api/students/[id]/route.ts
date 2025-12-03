import { getStudent } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const student = await getStudent(id)

    if (!student) {
      return Response.json({ success: false, error: "Student not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: student })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch student" }, { status: 500 })
  }
}
