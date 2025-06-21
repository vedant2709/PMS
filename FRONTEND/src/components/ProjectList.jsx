import { useEffect, useState } from "react";
import { getAllProjects } from "../api/project";
import toast from "react-hot-toast";
import ProjectCard from "./ProjectCard";

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getAllProjects();
        setProjects(data);
      } catch (error) {
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  if (projects.length === 0)
    return <p className="text-center text-zinc-500">No projects found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;
