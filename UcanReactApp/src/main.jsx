/* eslint-disable no-unused-vars */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Routing
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
//Routes
import Root from "./routes/Root";
import Home from "./routes/home";
import About from "./routes/about";
import Services from "./routes/services";
import Contact from "./routes/contact";
import Terms from "./routes/terms";
import NotFound from "./routes/NotFound";
import TutorAccess from "./routes/tutorAccess";
import TutorApplication from "./routes/tutorApplication";
import StudentAccess from "./routes/studentAccess";
import AdminAccess from "./routes/adminAccess";
import ResetPassword from "./routes/resetPassword";
import Account from "./routes/account";
import StudentDashboard from "./routes/studentDashboard";
import TutorDashboard from "./routes/tutorDashboard";
import TutorTutoringRequests from "./routes/tutorTutoringRequests";
import AdminDashboard from "./routes/adminDashboard";
import AdminContactMessages from "./routes/adminContactMessages";
import AdminTutorApplications from "./routes/adminTutorApplications";
import AdminTutoringRequests from "./routes/adminTutoringRequests";

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
        path: "services",
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
        path: "tutor-access",
        element: <TutorAccess />,
      },
      {
        path: "tutor-application",
        element: <TutorApplication />,
      },
      {
        path: "admin-access",
        element: <AdminAccess />,
      },
      {
        path: "student-access",
        element: <StudentAccess />,
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
        path: "student-dashboard",
        element: (
          <RoleProtectedRoute allowedRole="student">
            <StudentDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "tutor-dashboard",
        element: (
          <RoleProtectedRoute allowedRole="tutor">
            <TutorDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "tutor-tutoring-requests",
        element: (
          <RoleProtectedRoute allowedRole="tutor">
            <TutorTutoringRequests />
          </RoleProtectedRoute>
        ),
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
        path: "admin-tutor-applications",
        element: (
          <RoleProtectedRoute allowedRole="admin">
            <AdminTutorApplications />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "admin-tutoring-requests",
        element: (
          <RoleProtectedRoute allowedRole="admin">
            <AdminTutoringRequests />
          </RoleProtectedRoute>
        ),
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
