const EditUserModal = ({ show, user, onChange, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96 shadow">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <input
          type="text"
          value={user.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Name"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full p-2 mb-3 border rounded bg-gray-100"
        />
        <select
          value={user.role}
          onChange={(e) => onChange("role", e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="member">Member</option>
          <option value="manager">Manager</option>
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
