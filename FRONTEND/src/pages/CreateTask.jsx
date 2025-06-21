import { useEffect, useState } from "react";
import { createTask, getAllProjects } from "../api/project";
import { getAllMembers } from "../api/manager";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Not Started",
    project: "",
    assignedTo: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getAllProjects();
        setProjects(data);
      } catch (error) {
        toast.error("Failed to load projects");
      }
    };

    const fetchMembers = async () => {
      try {
        const { data } = await getAllMembers();
        setMembers(data);
      } catch (error) {
        toast.error("Failed to load members");
      }
    };

    fetchProjects();
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(formData.project, formData);
      toast.success("Task created successfully!");
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "Not Started",
        project: "Select a Project",
        assignedTo: "Select a Member",
      });
      navigate(`/manager/dashboard/project/${formData.project}`)
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md bg-white shadow-lg w-full h-[calc(100vh-150px)] overflow-y-auto p-4"
    >
      <div className="row-1 flex w-full justify-between">
        <div className="flex-col w-1/3">
          <p className="text-lg mb-1 font-medium">Task Name</p>
          <input
            type="text"
            name="title"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-[2px] outline-none px-2 text-lg border-[1.5px] border-zinc-500 rounded-md"
          />
        </div>
        <div className="flex-col w-1/4">
          <p className="text-lg mb-1 font-medium">Start Date</p>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-[2px] outline-none px-2 text-lg border-[1.5px] border-zinc-500 rounded-md"
          />
        </div>
        <div className="flex-col w-1/4">
          <p className="text-lg mb-1 font-medium">End Date</p>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-[2px] outline-none px-2 text-lg border-[1.5px] border-zinc-500 rounded-md"
          />
        </div>
      </div>

      <div className="row-2 mt-4">
        <div className="flex-col w-full">
          <p className="text-lg mb-1 font-medium">Task Description</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-[2px] outline-none px-2 text-lg border-[1.5px] border-zinc-500 rounded-md resize-none"
          />
        </div>
      </div>

      <div className="row-3 flex w-full justify-between mt-4">
        <div className="flex-col w-1/5">
          <p className="text-lg mb-1 font-medium">Status</p>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-[6px] outline-none text-lg border-[1.5px] border-zinc-500 rounded-md"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex-col w-1/3">
          <p className="text-lg mb-1 font-medium">Project</p>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="w-full p-[6px] outline-none text-lg border-[1.5px] border-zinc-500 rounded-md"
          >
            <option value="">Select a Project</option>
            {projects?.map((project, index) => (
              <option key={index} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-col w-1/4">
          <p className="text-lg mb-1 font-medium">Assign To</p>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full p-[6px] outline-none text-lg border-[1.5px] border-zinc-500 rounded-md"
          >
            <option value="">Select a Member</option>
            {projects?.map((project, index) =>
              project?.members?.map((member, index) => (
                <option key={index} value={member._id}>
                  {member.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>
    </form>
  );
}

export default CreateTask;
