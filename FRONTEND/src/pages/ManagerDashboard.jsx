import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { getManagerDashboard, getAllMembers } from "../api/manager";
import { logoutUser } from "../api/auth";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getManagerDashboard();
        setUser(data);
      } catch (err) {
        setError("You must be logged in");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const onLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Logout failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="h-screen">
      <Navbar onLogout={onLogout} username={user?.name} />
      <div className="flex h-[calc(100vh-70px)]">
        <SideBar />
        <div
          id="dashboard-content"
          className=" w-full px-6 py-4 flex z-0 bg-[#f0f6ff]"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
