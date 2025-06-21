import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllProjects } from "../api/project";
import CreateProject from "./CreateProject";

function ProjectPage() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <Breadcrumb />
          <Link
            to={"createProject"}
            className={`text-xl px-3 py-1 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 ${
              path.includes("createProject") && "hidden"
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

export default ProjectPage;
