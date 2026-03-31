import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/ChatPage";
// Components
import Navbar from "./components/Navbar";

// Route Guards
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterBuyer from "./pages/RegisterBuyer";
import RegisterSeller from "./pages/RegisterSeller";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Projects from "./pages/Projects";
import UploadProject from "./pages/UploadProject";
import MyProjects from "./pages/MyProjects";


// Admin
import AdminLayout from "./admin/AdminLayout";
import Sellers from "./admin/Sellers";
import AdminProjects from "./admin/AdminProjects";
import Buyers from "./admin/Buyers";
import MyPurchases from "./pages/MyPurchases";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global UI */}
        <Navbar />
        <Toaster position="top-center" />

        <Routes>
         <Route
  path="/ai-chat/:chatId?"
  element={
    <ProtectedRoute roles={["buyer", "seller"]}>
      <ChatPage />
    </ProtectedRoute>
  }
/>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterBuyer />} />
          <Route path="/register-seller" element={<RegisterSeller />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          


      

          {/* Logged-in users */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute roles={["buyer", "seller", "admin"]}>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route path="/my-purchases" element={<MyPurchases />} />
          {/* Seller only */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute roles={["seller"]}>
                <UploadProject />
              </ProtectedRoute>
            }
          />
          <Route
         path="/my-projects"
         element={
         <ProtectedRoute roles={["seller"]}>
          <MyProjects />
          </ProtectedRoute>
           }
              />


          {/* Admin layout + nested routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="sellers" element={<Sellers />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="buyers" element={<Buyers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
