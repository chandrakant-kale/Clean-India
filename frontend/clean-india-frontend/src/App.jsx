import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import AuthNavbar from "./components/AuthNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";

import Register from "./pages/enterance/Register";
import WorkerRegister from "./pages/enterance/WorkerRegister";
import OwnerRegister from "./pages/enterance/OwnerRegister";
import Login from "./pages/enterance/Login";

import Rewards from "./pages/Rewards";
import Contact from "./pages/Contact";
import Help from "./pages/Help";

import Profile from "./pages/AfterLogin/Profile";
import History from "./pages/AfterLogin/History";
import Dashboard from "./pages/AfterLogin/Dashboard";
import WorkerVerify from "./pages/AfterLogin/WorkerVerify";
import OwnerCoupons from "./pages/AfterLogin/OwnerCoupons";
import WorkersMonitoring from "./pages/AfterLogin/WorkersMonitoring";
import WorkerShiftControl from "./pages/AfterLogin/WorkerShiftControl";
import WorkerStartShift from "./pages/AfterLogin/WorkerStartShift";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function AppContent() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col bg-[#F8F7F2] text-[#252820]">
        {/* Global page background */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[#F8F7F2]"
        />

        {/* Navigation */}
        {user ? <AuthNavbar /> : <Navbar />}

        {/* Application notifications */}
        <ToastContainer />

        {/* Main page content */}
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/worker-register" element={<WorkerRegister />} />
            <Route path="/owner-register" element={<OwnerRegister />} />
            <Route path="/login" element={<Login />} />

            <Route path="/rewards" element={<Rewards />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker-verify"
              element={
                <ProtectedRoute>
                  <WorkerVerify />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner-coupons"
              element={
                <ProtectedRoute>
                  <OwnerCoupons />
                </ProtectedRoute>
              }
            />

            <Route
              path="/workers-monitoring"
              element={
                <ProtectedRoute>
                  <WorkersMonitoring />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker-shift"
              element={
                <ProtectedRoute>
                  <WorkerShiftControl />
                </ProtectedRoute>
              }
            />

            <Route
              path="/worker-start-shift"
              element={
                <ProtectedRoute>
                  <WorkerStartShift />
                </ProtectedRoute>
              }
            />

            {/* Unknown routes */}
            <Route
              path="*"
              element={
                <section className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#626B4F]">
                    Error 404
                  </p>

                  <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Page not found.
                  </h1>

                  <p className="mt-4 max-w-md text-sm leading-7 text-[#696A61]">
                    The page you are looking for may have moved or does not
                    exist.
                  </p>

                  <a
                    href="/"
                    className="mt-7 inline-flex items-center gap-3 rounded-lg bg-[#30382B] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#48533E]"
                  >
                    Return home <span aria-hidden="true">→</span>
                  </a>
                </section>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;