import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getTaskById, updateTask, deleteTask } from "../api/task"; // adjust path
import { Pencil, Trash2 } from "lucide-react";

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await getTaskById(taskId);
        console.log(data);
        setTask(data);
        setFormData({
          title: data[0].title,
          description: data[0].description,
          startDate: data[0].startDate.slice(0, 10),
          endDate: data[0].endDate.slice(0, 10),
          status: data[0].status,
        });
      } catch (error) {
        toast.error("Failed to fetch task");
      }
    };

    fetchTask();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const { data } = await updateTask(taskId, formData);
      toast.success("Task updated");
      setTask(data);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted");
      navigate(-1); // go back to previous page
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (!task) return <div className="p-4 text-gray-500">Loading task...</div>;

  return (
    <div className="p-6 bg-white shadow rounded-md w-full h-[calc(100vh-150px)] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-zinc-800">Task Details</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-md shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Project?</h2>
            <p className="text-sm text-zinc-600">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-1 rounded bg-zinc-200 hover:bg-zinc-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editable or View Mode */}
      <div className="space-y-4">
        <div>
          <label className="font-medium block mb-1">Title</label>
          {isEditing ? (
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          ) : (
            <p>{task[0]?.title}</p>
          )}
        </div>

        <div>
          <label className="font-medium block mb-1">Description</label>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md resize-none"
            />
          ) : (
            <p className="text-zinc-700">{task[0]?.description}</p>
          )}
        </div>

        <div className="flex gap-6">
          <div>
            <label className="font-medium block mb-1">Start Date</label>
            {isEditing ? (
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border px-2 py-1 rounded"
              />
            ) : (
              <p>{new Date(task[0]?.startDate).toLocaleDateString()}</p>
            )}
          </div>
          <div>
            <label className="font-medium block mb-1">End Date</label>
            {isEditing ? (
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border px-2 py-1 rounded"
              />
            ) : (
              <p>{new Date(task[0]?.endDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <div>
          <label className="font-medium block mb-1">Status</label>
          {isEditing ? (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          ) : (
            <p className="capitalize">{task[0]?.status}</p>
          )}
        </div>

        <div>
          <label className="font-medium block mb-1">Project</label>
          <p>{task[0]?.project?.name || "N/A"}</p>
        </div>

        <div>
          <label className="font-medium block mb-1">Assigned To</label>
          <p>{task[0]?.assignedTo?.name || "Unassigned"}</p>
        </div>
      </div>

      {/* Update Button */}
      {isEditing && (
        <div className="mt-6 text-right">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Task
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskDetails;
