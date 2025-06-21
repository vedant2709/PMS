import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteProject,
  getProjectById,
  getTasks,
  updateProjectById,
} from "../api/project";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { X } from "lucide-react"; // Close/remove icon
import TaskCard from "../components/TaskCard";

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    members: [],
  });

  // Define this below the useState
  const handleRemoveMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member._id !== id),
    }));
  };

  console.log(formData);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await getProjectById(projectId);
        setProject(data);
        setFormData({
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          members: data.members,
        });
      } catch (error) {
        toast.error("Failed to load project details");
      }
    };

    const fetchTasks = async () => {
      try {
        const { data } = await getTasks(projectId);
        console.log(data);
        setTasks(data);
      } catch (error) {
        toast.error("Failed to load project details");
      }
    };

    fetchTasks();
    fetchProject();
  }, [projectId]);

  const handleUpdate = async () => {
    try {
      const { data } = await updateProjectById(projectId, formData);
      toast.success("Project updated successfully!");
      setProject(data); // refresh view
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      members: project.members,
    });
    setEditMode(false);
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      navigate("/manager/dashboard/project"); // go back to project list
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleCreateTask = () => {
    navigate(`/manager/dashboard/project/${projectId}/tasks/create`);
  };

  if (!project) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow-md relative space-y-4 h-[calc(100vh-150px)] overflow-auto">
      {/* Edit Icon */}
      {!editMode && (
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={() => setEditMode(true)}
            className="text-zinc-500 hover:text-blue-600"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-zinc-500 hover:text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={handleCreateTask}
          >
            Create Task
          </button>
        </div>
      )}
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
                onClick={handleDeleteProject}
                className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      {editMode ? (
        <input
          className="text-2xl font-bold w-full border p-2 rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      ) : (
        <h1 className="text-2xl font-bold text-zinc-800">{project.name}</h1>
      )}
      {/* Description */}
      {editMode ? (
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      ) : (
        <p className="text-zinc-600">{project.description}</p>
      )}
      {/* Dates */}
      <div className="flex gap-4">
        <div className="flex flex-col text-sm">
          <span className="text-zinc-500">Start Date</span>
          {editMode ? (
            <input
              type="date"
              value={formData.startDate.slice(0, 10)}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="border p-1 rounded"
            />
          ) : (
            <span>{new Date(project.startDate).toLocaleDateString()}</span>
          )}
        </div>
        <div className="flex flex-col text-sm">
          <span className="text-zinc-500">End Date</span>
          {editMode ? (
            <input
              type="date"
              value={formData.endDate.slice(0, 10)}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="border p-1 rounded"
            />
          ) : (
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
      {/* Status */}
      <div className="text-sm font-medium mt-2">
        Status:{" "}
        {editMode ? (
          <select
            className="border p-1 rounded ml-2"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        ) : (
          <span className="inline-block px-2 py-1 bg-zinc-100 rounded-full ml-1">
            {project.status}
          </span>
        )}
      </div>

      <div className="w-1/3 px-3 py-2 border-[1.5px] border-zinc-300 mt-3 rounded-md bg-white">
        <p className="text-sm font-semibold mb-2 text-zinc-600">
          Project Members:
        </p>
        <div className="space-y-2">
          {formData?.members?.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-100 transition"
            >
              {/* Left: Avatar + name + role */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold uppercase">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-800">
                    {member.name}
                  </span>
                  {member.role && (
                    <span className="text-xs text-zinc-500 capitalize">
                      {member.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Remove button */}
              {editMode && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-zinc-400 hover:text-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex-col">
        <p className="text-xl font-semibold">Tasks</p>
        <div className="w-full flex gap-5 mt-2 flex-wrap">
          {tasks?.map((task, index) => (
            <TaskCard task={task} />
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      {editMode && (
        <div className="flex gap-3 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
