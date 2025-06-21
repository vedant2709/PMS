import { useEffect, useState } from "react";
import { getMemberDashboard, logoutUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getMemberDashboard();
        setUser(data);
      } catch (err) {
        setError("You must be logged in");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Logout failed. Please try again.";
      setError(message);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <button
        onClick={handleLogout}
        className="px-3 py-1 font-medium text-white text-xl bg-red-600 absolute right-5 top-5 rounded-md cursor-pointer"
      >
        Logout
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-sm">
        <h1>Member Dashbord</h1>
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-500 mt-4">Role: {user?.role}</p>
      </div>
    </div>
  );
};

export default MemberDashboard;
