import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import RootLayout from '@/app/layout';
import HomePage from '@/app/page';
import LoginPage from '@/app/login/page';
import AdminLayout from '@/app/admin/layout';
import StudentLayout from '@/app/student/layout';
import FacultyLayout from '@/app/faculty/layout';

// Admin Pages
import AdminDashboard from '@/app/admin/dashboard/page';
import AdminAnalytics from '@/app/admin/analytics/page';
import AdminAnalyticsPlacement from '@/app/admin/analytics-placement/page';
import AdminPlacements from '@/app/admin/placements/page';
import AdminRegistrations from '@/app/admin/registrations/page';
import AdminConsolidatedSheet from '@/app/admin/consolidated-sheet/page';
import AdminOfferStatement from '@/app/admin/offer-statement/page';
import AdminStudents from '@/app/admin/students/page';
import AdminReports from '@/app/admin/reports/page';
import AdminDrives from '@/app/admin/drives/page';
import AdminPlacementAToZ from '@/app/admin/placement-a-to-z/page';
import AdminIndustryInstitute from '@/app/admin/industry-institute-interaction/page';
import AdminCareerGuidance from '@/app/admin/career-guidance/page';
import AdminConsultantHR from '@/app/admin/consultant-hr-data/page';
import AdminServiceNow from '@/app/admin/servicenow-modules/page';
import AdminHelpDesk from '@/app/admin/help-desk/page';
import AdminCareerConnect from '@/app/admin/career-connect/page';
import AdminLinkedInSoftSkills from '@/app/admin/linkedin-softskills/page';
import AdminTrainingAssessments from '@/app/admin/training-assessments/page';
import AdminBootcampInfosys from '@/app/admin/bootcamp-infosys/page';
import AdminInterviewPrep from '@/app/admin/interview-prep/page';
import AdminMidMarksSyllabus from '@/app/admin/mid-marks-syllabus/page';
import AdminAicteRiseup from '@/app/admin/aicte-riseup/page';
import AdminAIAutomation from '@/app/admin/ai-automation/page';
import { AIAutomationService } from '@/lib/ai-automation-service';

// Section Login Pages
import PlacementDrivesLogin from '@/app/login/placement-drives/page';
import CareerGuidanceLogin from '@/app/login/career-guidance/page';
import TrainingAssessmentsLogin from '@/app/login/training-assessments/page';
import ServiceNowLogin from '@/app/login/servicenow/page';
import HelpDeskLogin from '@/app/login/help-desk/page';

// Section Layouts
import PlacementDrivesLayout from '@/app/placement-drives/layout';
import CareerGuidanceLayout from '@/app/career-guidance/layout';
import TrainingAssessmentsLayout from '@/app/training-assessments/layout';
import ServiceNowLayout from '@/app/servicenow/layout';
import HelpDeskLayout from '@/app/help-desk/layout';

// Section Dashboard Pages
import PlacementDrivesDashboard from '@/app/placement-drives/dashboard/page';
import CareerGuidanceDashboard from '@/app/career-guidance/dashboard/page';
import TrainingAssessmentsDashboard from '@/app/training-assessments/dashboard/page';
import ServiceNowDashboard from '@/app/servicenow/dashboard/page';
import HelpDeskDashboard from '@/app/help-desk/dashboard/page';

// Student Pages
import StudentDashboard from '@/app/student/dashboard/page';
import StudentDrives from '@/app/student/drives/page';
import StudentApplications from '@/app/student/applications/page';
import StudentDocuments from '@/app/student/documents/page';
import StudentInterviewPrep from '@/app/student/interview-prep/page';
import StudentFeedback from '@/app/student/feedback/page';
import StudentPlacements from '@/app/student/placements/page';
import StudentProfile from '@/app/student/profile/page';
import StudentSupport from '@/app/student/support/page';
import StudentSchedule from '@/app/student/schedule/page';
import StudentResumeBuilder from '@/app/student/resume-builder/page';

// Faculty Pages
import FacultyDashboard from '@/app/faculty/dashboard/page';
import FacultyStudents from '@/app/faculty/students/page';
import FacultyTrainings from '@/app/faculty/trainings/page';
import FacultyAssignments from '@/app/faculty/assignments/page';
import FacultyResources from '@/app/faculty/resources/page';
import FacultyReports from '@/app/faculty/reports/page';

const queryClient = new QueryClient();

// Initialize AI Automation Service
if (typeof window !== 'undefined') {
  AIAutomationService.initialize();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Login Routes - Outside RootLayout for proper routing */}
            <Route path="/login" element={<RootLayout><LoginPage /></RootLayout>} />
            <Route path="/login/placement-drives" element={<RootLayout><PlacementDrivesLogin /></RootLayout>} />
            <Route path="/login/career-guidance" element={<RootLayout><CareerGuidanceLogin /></RootLayout>} />
            <Route path="/login/training-assessments" element={<RootLayout><TrainingAssessmentsLogin /></RootLayout>} />
            <Route path="/login/servicenow" element={<RootLayout><ServiceNowLogin /></RootLayout>} />
            <Route path="/login/help-desk" element={<RootLayout><HelpDeskLogin /></RootLayout>} />
            
            <Route path="/" element={<RootLayout><Outlet /></RootLayout>}>
              <Route index element={<HomePage />} />
              
              {/* Standalone Section Routes */}
              <Route path="placement-drives" element={<PlacementDrivesLayout><Outlet /></PlacementDrivesLayout>}>
                <Route path="dashboard" element={<PlacementDrivesDashboard />} />
              </Route>
              
              <Route path="career-guidance" element={<CareerGuidanceLayout><Outlet /></CareerGuidanceLayout>}>
                <Route path="dashboard" element={<CareerGuidanceDashboard />} />
              </Route>
              
              <Route path="training-assessments" element={<TrainingAssessmentsLayout><Outlet /></TrainingAssessmentsLayout>}>
                <Route path="dashboard" element={<TrainingAssessmentsDashboard />} />
              </Route>
              
              <Route path="servicenow" element={<ServiceNowLayout><Outlet /></ServiceNowLayout>}>
                <Route path="dashboard" element={<ServiceNowDashboard />} />
              </Route>
              
              <Route path="help-desk" element={<HelpDeskLayout><Outlet /></HelpDeskLayout>}>
                <Route path="dashboard" element={<HelpDeskDashboard />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="admin" element={<AdminLayout><Outlet /></AdminLayout>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="analytics-placement" element={<AdminAnalyticsPlacement />} />
                <Route path="ai-automation" element={<AdminAIAutomation />} />
                <Route path="placements" element={<AdminPlacements />} />
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="consolidated-sheet" element={<AdminConsolidatedSheet />} />
                <Route path="offer-statement" element={<AdminOfferStatement />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="drives" element={<AdminDrives />} />
                <Route path="placement-a-to-z" element={<AdminPlacementAToZ />} />
                <Route path="industry-institute-interaction" element={<AdminIndustryInstitute />} />
                <Route path="career-guidance" element={<AdminCareerGuidance />} />
                <Route path="consultant-hr-data" element={<AdminConsultantHR />} />
                <Route path="servicenow-modules" element={<AdminServiceNow />} />
                <Route path="help-desk" element={<AdminHelpDesk />} />
                <Route path="career-connect" element={<AdminCareerConnect />} />
                <Route path="linkedin-softskills" element={<AdminLinkedInSoftSkills />} />
                <Route path="training-assessments" element={<AdminTrainingAssessments />} />
                <Route path="bootcamp-infosys" element={<AdminBootcampInfosys />} />
                <Route path="interview-prep" element={<AdminInterviewPrep />} />
                <Route path="mid-marks-syllabus" element={<AdminMidMarksSyllabus />} />
                <Route path="aicte-riseup" element={<AdminAicteRiseup />} />
              </Route>

              {/* Student Routes */}
              <Route path="student" element={<StudentLayout><Outlet /></StudentLayout>}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="drives" element={<StudentDrives />} />
                <Route path="applications" element={<StudentApplications />} />
                <Route path="documents" element={<StudentDocuments />} />
                <Route path="interview-prep" element={<StudentInterviewPrep />} />
                <Route path="feedback" element={<StudentFeedback />} />
                <Route path="placements" element={<StudentPlacements />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="support" element={<StudentSupport />} />
                <Route path="schedule" element={<StudentSchedule />} />
                <Route path="resume-builder" element={<StudentResumeBuilder />} />
              </Route>

              {/* Faculty Routes */}
              <Route path="faculty" element={<FacultyLayout><Outlet /></FacultyLayout>}>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="students" element={<FacultyStudents />} />
                <Route path="trainings" element={<FacultyTrainings />} />
                <Route path="assignments" element={<FacultyAssignments />} />
                <Route path="resources" element={<FacultyResources />} />
                <Route path="reports" element={<FacultyReports />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
