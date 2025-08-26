import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const admin = localStorage.getItem("admin"); // or check cookies
  if (!admin) {
    return <Navigate to="/adminlog" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
