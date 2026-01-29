"use client"

import AdminTrainingAssessments from "@/app/admin/training-assessments/page"
import AdminInterviewPrep from "@/app/admin/interview-prep/page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TrainingAssessmentsDashboard() {
  return (
    <div className="p-8">
      <Tabs defaultValue="training" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="training">Training & Assessments</TabsTrigger>
          <TabsTrigger value="interview-prep">Interview Prep</TabsTrigger>
        </TabsList>
        <TabsContent value="training">
          <AdminTrainingAssessments />
        </TabsContent>
        <TabsContent value="interview-prep">
          <AdminInterviewPrep />
        </TabsContent>
      </Tabs>
    </div>
  )
}
