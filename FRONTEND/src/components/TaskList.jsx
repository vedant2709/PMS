import React, { useEffect, useState } from "react";
import { getAllTasks } from "../api/task";
import toast from "react-hot-toast";
import TaskCard from "./TaskCard";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await getAllTasks();
        setTasks(data);
      } catch (error) {
        toast.error(error);
      }
    };

    fetchTasks();
  });
  return (
    <div className="w-full flex flex-wrap">
      {tasks?.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
