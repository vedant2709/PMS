import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import HomeRedirect from "./pages/HomeRedirect";
import ManagerDashboard from "./pages/ManagerDashboard";
import ProjectPage from "./pages/ProjectPage";
import TasksPage from "./pages/TasksPage";
import WorkLogPage from "./pages/WorkLogPage";
import PerformancePage from "./pages/PerformancePage";
import SettingsPage from "./pages/SettingsPage";
import CreateProject from "./pages/CreateProject";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./pages/ProjectDetails";
import CreateTask from "./pages/CreateTask";
import TaskList from "./components/TaskList";
import TaskDetails from "./pages/TaskDetails";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Nested routes under /manager/dashboard */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />}>
          <Route path="project" element={<ProjectPage />}>
            <Route index element={<ProjectList />} />
            <Route path="createProject" element={<CreateProject />} />
            <Route path=":projectId" element={<ProjectDetails />} />\
            <Route path=":projectId/tasks/create" element={<CreateTask />} />
          </Route>
          <Route path="task" element={<TasksPage />}>
            <Route path=":taskId" element={<TaskDetails />} />
            <Route index element={<TaskList />} />
            <Route path="createTask" element={<CreateTask />} />
          </Route>
          <Route path="work-logs" element={<WorkLogPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
      </Routes>
    </>
  );
}

export default App;
