import { useLocation, Link } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname;

  let crumbs = [];

  if (path === "/manager/dashboard/project") {
    crumbs = [{ label: "Projects", to: "/manager/dashboard/project" }];
  } else if (path === "/manager/dashboard/project/createProject") {
    crumbs = [
      { label: "Projects", to: "/manager/dashboard/project" },
      {
        label: "Create Project",
        to: "/manager/dashboard/project/createProject",
      },
    ];
  } else if (path === "/manager/dashboard/tasks") {
    crumbs = [
      { label: "Tasks", to: "/manager/dashboard/tasks" },
    ];
  } else if (path === "/manager/dashboard/tasks/createTask") {
    crumbs = [
      { label: "Tasks", to: "/manager/dashboard/tasks" },
      { label: "Create Task", to: "/manager/dashboard/tasks/createTask" },
    ];
  }

  return (
    <div className="text-sm text-gray-600 items-center">
      <div className="flex items-center space-x-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {isLast ? (
                <span className="capitalize text-blue-600 font-semibold text-xl">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="capitalize text-gray-500 font-semibold text-xl"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </div>
    </div>
  );
}

export default Breadcrumb;
