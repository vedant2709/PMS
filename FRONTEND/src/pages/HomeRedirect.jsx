import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getProfile } from "../api/auth";

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data } = await getProfile();

        // Assuming user object contains role
        if (data.role === "admin") {
          console.log("Inside admin");
          navigate("/admin/dashboard");
        } else if (data.role === "member") {
          navigate("/member/dashboard");
        } else if (data.role === "manager") {
          navigate("/manager/dashboard");
        } else {
          navigate("/login"); // fallback
        }
      } catch (err) {
        navigate("/login");
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  return <div>Redirecting...</div>; // Optional loader
};

export default HomeRedirect;
