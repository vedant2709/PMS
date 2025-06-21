import { useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { Link, Outlet, useLocation } from "react-router-dom";

function TasksPage() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <Breadcrumb />
          <Link
            to={"createTask"}
            className={`text-xl px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 ${
              path.includes("createTask") && "hidden"
            }`}
          >
            Create
          </Link>
        </div>
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default TasksPage;
