export async function GET() {
  try {
    const analytics = {
      totalStudents: 4000,
      totalApplications: 8500,
      totalPlacements: 7820,
      placementRate: 92.0,
      averagePackage: 62.3,
      highestPackage: 125,
      lowestPackage: 38,
      activeCompanies: 150,
      activeStudents: 3850,
      pendingApplications: 680,
      monthlyData: [
        { month: "Jan", applications: 1200, placements: 450 },
        { month: "Feb", applications: 1900, placements: 620 },
        { month: "Mar", applications: 2200, placements: 750 },
        { month: "Apr", applications: 2800, placements: 920 },
        { month: "May", applications: 3200, placements: 1100 },
        { month: "Jun", applications: 3500, placements: 1250 },
      ],
      branchDistribution: [
        { branch: "CSE", students: 1200, placements: 1150 },
        { branch: "ECE", students: 800, placements: 730 },
        { branch: "Mechanical", students: 600, placements: 520 },
        { branch: "Civil", students: 400, placements: 320 },
      ],
    }
    return Response.json({ success: true, data: analytics })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
