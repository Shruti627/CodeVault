import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function SellerRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    alert("Please login first");
    return <Navigate to="/login" />;
  }

  if (user.role !== "seller") {
    alert("Please register as a seller to upload projects");
    return <Navigate to="/register-seller" />;
  }

  return children;
}
