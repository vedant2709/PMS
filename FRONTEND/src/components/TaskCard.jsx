import { Calendar, Users } from "lucide-react"; // Optional: for icons
import clsx from "clsx"; // Optional: for conditional styling
import { Link } from "react-router-dom";

const statusColors = {
  "Not Started": "bg-gray-200 text-gray-700",
  "In Progress": "bg-yellow-200 text-yellow-800",
  Completed: "bg-green-200 text-green-800",
};

function TaskCard({ task }) {
  console.log(task.assignedTo.name);
  return (
    <Link
      to={`/manager/dashboard/task/${task._id}`}
      className="p-4 border border-zinc-300 rounded-lg shadow-sm transition hover:shadow-md hover:-translate-y-1 duration-200 bg-white space-y-2 w-[100%]"
    >
      {/* Title + Status */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-zinc-800">{task.title}</h2>
        <span
          className={clsx(
            "text-xs px-2 py-1 rounded-full font-medium",
            statusColors[task.status] || "bg-zinc-200 text-zinc-600"
          )}
        >
          {task.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-600 line-clamp-3 my-2">
        {task.description}
      </p>

      {/* Dates */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(task.startDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(task.endDate).toLocaleDateString()}
        </div>
      </div>

      {/* Project & Assignees */}
      <div className="flex justify-between items-center text-sm mt-2">
        <span className="text-blue-700 font-medium">
          Project: {task.project?.name || "N/A"}
        </span>
        <div className="flex items-center gap-1 text-zinc-600">
          <Users className="w-4 h-4" />
          <span>{task?.assignedTo?.name}</span>
        </div>
      </div>
    </Link>
  );
}

export default TaskCard;
