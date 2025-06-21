import { useEffect, useState } from "react";
import { getAdminDashboard, logoutUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import EditUserModal from "../components/EditUserModal";
import Navbar from "../components/Navbar";
import { getAllUsers, updateUser } from "../api/admin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getAdminDashboard();
        setUser(data);
      } catch (err) {
        setError("You must be logged in");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFieldChange = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUser(selectedUser._id, selectedUser);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setShowModal(true);
  };

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
    <>
      <Navbar onLogout={handleLogout} />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">All Users</h1>
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEditClick(u)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <EditUserModal
          show={showModal}
          user={selectedUser}
          onChange={handleFieldChange}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export default AdminDashboard;
