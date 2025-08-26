import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import AdvanceQrcontainer from "./components/AdvanceQrcontainer";
import NavBar from "./components/NavBar";
import QrMainContainer from "./components/QrMainContainer";
import QRFrame from "./components/QrFrame";
import Footer from "./components/Footer";
import ProtectedRoute from "./function/ProtectedRoute";
import AdminProtectedRoute from "./function/AdminProtectedRoute";
import Login from "./components/login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import ContactUs from "./components/ContanctUs";
import QrResult from "./components/QrResult";
import Priceing from "./components/Pricing";
import AdminQrData from "./components/AdminQrData";
import AdminLogin from "./components/AdminLogin";
import AdminNavbar from "./components/AdminNavBar";
import AdminUsersInfo from "./components/AdminUsersInfo";
import AdminPayLog from "./components/AdminPayLog";
import AuditLogs from "./components/AuditLogs";

function LayoutWithNavFooter() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

function AdminNavAndFooter() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutWithNavFooter />}>
          <Route path="/" element={<QrMainContainer />} />
          <Route path="/advancedQR" element={<AdvanceQrcontainer />} />
          <Route path="/qrFrame" element={<QRFrame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/pricing" element={<Priceing />} />
        </Route>

        <Route element={<AdminNavAndFooter />}>
          <Route
            path="/adminqrdata"
            element={
              <AdminProtectedRoute>
                <AdminQrData />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/adminuserinfo"
            element={
              <AdminProtectedRoute>
                <AdminUsersInfo />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/adminpaylog"
            element={
              <AdminProtectedRoute>
                <AdminPayLog />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/auditlogs"
            element={
              <AdminProtectedRoute>
                <AuditLogs />
              </AdminProtectedRoute>
            }
          />
        </Route>

        <Route path="/adminlog" element={<AdminLogin />} />
        <Route path="/qrresult/:id" element={<QrResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
