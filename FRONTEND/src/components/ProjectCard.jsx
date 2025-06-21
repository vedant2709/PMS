import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { CalendarDays } from "lucide-react";

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { _id, name, endDate, description, status } = project;

  const statusColor = {
    "Not Started": "bg-gray-200 text-gray-700",
    "In Progress": "bg-yellow-200 text-yellow-800",
    Completed: "bg-green-200 text-green-800",
  };

  return (
    <div
      onClick={() => navigate(_id)} // 👈 dynamic route like /project/:projectId
      className="group border border-zinc-300 rounded-xl p-4 shadow-sm transition hover:shadow-md hover:-translate-y-1 duration-200 bg-white cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-zinc-800 mb-1">{name}</h3>
      <div className="flex items-center text-sm text-zinc-500 mb-2">
        <CalendarDays className="w-4 h-4 mr-1" />
        <span>Due: {new Date(endDate).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-zinc-600 mb-3 line-clamp-2">
        {description || "No description provided."}
      </p>
      <div
        className={clsx(
          "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize",
          statusColor[status] || "bg-gray-100 text-gray-600"
        )}
      >
        {status}
      </div>
    </div>
  );
}

export default ProjectCard;
