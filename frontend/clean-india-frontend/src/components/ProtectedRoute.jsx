import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7F2] px-6">
        <div className="flex w-full max-w-xs flex-col items-center text-center">
          <div className="mb-8 flex h-12 w-12 items-center justify-center border border-[#DEDCD3] bg-[#EFEEE6]">
            <span className="text-lg font-extrabold tracking-[-1px] text-[#252820]">
              C<span className="text-[#C65B35]">.</span>
            </span>
          </div>

          <div
            className="mb-5 h-6 w-6 animate-spin border-2 border-[#DEDCD3] border-t-[#626B4F]"
            role="status"
            aria-label="Loading"
          />

          <p className="text-sm font-semibold text-[#252820]">
            Checking your session
          </p>

          <p className="mt-2 text-xs leading-5 text-[#858579]">
            Please wait while we prepare your account.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}