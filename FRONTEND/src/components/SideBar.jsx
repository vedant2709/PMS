import { FaEdit } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { TbFileReport } from "react-icons/tb";
import { GrDocumentPerformance } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <div id="side-bar" className="w-[20%] h-full shadow-lg flex-col px-7">
      <Link to={"project"} className="flex items-center gap-3 py-4">
        <FaEdit size={25} color="#5D7285" />
        <p className="text-lg font-medium text-[#5D7285]">Project</p>
      </Link>
      <Link to={"task"} className="flex items-center gap-3 py-4">
        <FaTasks size={25} color="#5D7285" />
        <p className="text-lg font-medium text-[#5D7285]">Tasks</p>
      </Link>
      <Link to={"work-logs"} className="flex items-center gap-3 py-4">
        <TbFileReport size={25} color="#5D7285" />
        <p className="text-lg font-medium text-[#5D7285]">Work Logs</p>
      </Link>
      <Link to={"performance"} className="flex items-center gap-3 py-4">
        <GrDocumentPerformance size={25} color="#5D7285" />
        <p className="text-lg font-medium text-[#5D7285]">Performance</p>
      </Link>
      <Link to={"settings"} className="flex items-center gap-3 py-4">
        <IoMdSettings size={25} color="#5D7285" />
        <p className="text-lg font-medium text-[#5D7285]">Settings</p>
      </Link>
    </div>
  );
}

export default SideBar;
