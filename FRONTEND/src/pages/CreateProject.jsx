import { useEffect, useState } from "react";
import { createProject } from "../api/project";
import { getAllMembers } from "../api/manager";
import { toast } from "react-hot-toast";

function CreateProject() {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "Not Started",
    members: [], // ✅ added
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Extract only the IDs before sending
    const payload = {
      ...formData,
      members: formData.members.map((member) => member._id),
    };

    try {
      await createProject(payload);
      toast.success("Project created successfully!");

      // ✅ Reset form state
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        description: "",
        status: "Not Started",
        members: [],
      });
      setSearchQuery("");
      setFilteredSuggestions([]);
    } catch (error) {
      toast.error("Unable to create project");
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await getAllMembers();
        setMembers(data);
      } catch (error) {
        setError("No members found");
      }
    };

    fetchMembers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    console.log(members);

    const filtered = members.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log(filtered);

    setFilteredSuggestions(filtered);
  }, [searchQuery, formData.members]);

  const handleAddMember = (user) => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, user],
    }));
    setSearchQuery("");
    setFilteredSuggestions([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md bg-white shadow-lg w-full h-[calc(100vh-150px)] overflow-y-auto p-4"
    >
      <div className="row-1 flex w-full justify-between">
        <div className="flex-col w-1/3">
          <p className="text-lg mb-1 font-medium">Project Title</p>
          <input
            type="text"
            name="name"
            value={formData.title}
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
          <p className="text-lg mb-1 font-medium">Project Description</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-[2px] outline-none px-2 text-lg border-[1.5px] border-zinc-500 rounded-md resize-none"
          />
        </div>
      </div>

      <div className="row-3 mt-4 flex justify-between">
        <div className="w-1/2">
          <p className="text-lg mb-1 font-medium">Project Members</p>

          {/* Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search members..."
            className="w-full border-[1.5px] border-zinc-500 rounded-md py-2 px-4 mb-2 outline-none"
          />

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="w-full border border-zinc-300 rounded-md max-h-40 overflow-y-auto bg-white z-10 relative">
              {filteredSuggestions.map((user) => (
                <div
                  key={user.id}
                  className="px-4 py-2 hover:bg-zinc-100 cursor-pointer"
                  onClick={() => handleAddMember(user)}
                >
                  <p className="text-sm font-medium">
                    {user.name}{" "}
                    <span className="text-zinc-400 text-xs">({user.role})</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Selected Members */}
          {formData.members.length !== 0 && (
            <div className="w-full border-[1.5px] border-zinc-500 rounded-md py-2 px-4">
              {formData.members.map((member, index) => (
                <div
                  key={index}
                  className="w-full border-b-[0.5px] border-zinc-300 py-1 flex justify-between items-center"
                >
                  <p className="text-xl font-semibold">{member.name}</p>
                  <p className="text-lg font-medium text-zinc-500 capitalize">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

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
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}

export default CreateProject;
