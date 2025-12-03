import { getAllStudents } from "@/lib/db"

export async function GET() {
  try {
    const students = await getAllStudents()
    return Response.json({ success: true, data: students })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Validate and create new student
    const newStudent = {
      id: `student-${Date.now()}`,
      ...body,
      appliedDrives: [],
      selectedDrives: [],
    }
    return Response.json({ success: true, data: newStudent }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create student" }, { status: 400 })
  }
}
