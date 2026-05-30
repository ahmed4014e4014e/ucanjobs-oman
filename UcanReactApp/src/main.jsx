import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Routing
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
//Routes
import Root from "./routes/Root";
import Home from "./routes/home";
import About from "./routes/about";
import Courses from "./routes/courses";
import CourseDetail from "./routes/courseDetail";
import Services from "./routes/services";
import Contact from "./routes/contact";
import Terms from "./routes/terms";
import NotFound from "./routes/NotFound";
import InstructorAccess from "./routes/instructorAccess";
import InstructorApplication from "./routes/instructorApplication";
import LearnerAccess from "./routes/learnerAccess";
import AdminAccess from "./routes/adminAccess";
import ResetPassword from "./routes/resetPassword";
import Account from "./routes/account";
import LearnerDashboard from "./routes/learnerDashboard";
import InstructorDashboard from "./routes/instructorDashboard";
import InstructorLearningRequests from "./routes/instructorLearningRequests";
import AdminDashboard from "./routes/adminDashboard";
import AdminContactMessages from "./routes/adminContactMessages";
import AdminInstructorApplications from "./routes/adminInstructorApplications";
import AdminLearningRequests from "./routes/adminLearningRequests";
import AdminCourses from "./routes/adminCourses";

// Create a Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "courses/:slug",
        element: <CourseDetail />,
      },
      {
        path: "services",
        element: <Courses />,
      },
      {
        path: "legacy-services",
        element: <Services />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "instructor-access",
        element: <InstructorAccess />,
      },
      {
        path: "tutor-access",
        element: <Navigate to="/instructor-access/" replace />,
      },
      {
        path: "instructor-application",
        element: <InstructorApplication />,
      },
      {
        path: "tutor-application",
        element: <Navigate to="/instructor-application/" replace />,
      },
      {
        path: "admin-access",
        element: <AdminAccess />,
      },
      {
        path: "learner-access",
        element: <LearnerAccess />,
      },
      {
        path: "student-access",
        element: <Navigate to="/learner-access/" replace />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
      {
        path: "learner-dashboard",
        element: (
          <RoleProtectedRoute allowedRole="learner">
            <LearnerDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "student-dashboard",
        element: <Navigate to="/learner-dashboard/" replace />,
      },
      {
        path: "instructor-dashboard",
        element: (
          <RoleProtectedRoute allowedRole="instructor">
            <InstructorDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "tutor-dashboard",
        element: <Navigate to="/instructor-dashboard/" replace />,
      },
      {
        path: "instructor-learning-requests",
        element: (
          <RoleProtectedRoute allowedRole="instructor">
            <InstructorLearningRequests />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "tutor-tutoring-requests",
        element: <Navigate to="/instructor-learning-requests/" replace />,
      },
      {
        path: "admin-dashboard",
        element: (
          <RoleProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-contact-messages",
        element: (
          <RoleProtectedRoute allowedRole="admin">
            <AdminContactMessages />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-instructor-applications",
        element: (
          <RoleProtectedRoute allowedRole="admin">
            <AdminInstructorApplications />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-tutor-applications",
        element: <Navigate to="/admin-instructor-applications/" replace />,
      },
      {
        path: "admin-learning-requests",
        element: (
          <RoleProtectedRoute allowedRole="admin">
            <AdminLearningRequests />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-courses",
        element: (
          <RoleProtectedRoute allowedRole="admin">
            <AdminCourses />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-tutoring-requests",
        element: <Navigate to="/admin-learning-requests/" replace />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
