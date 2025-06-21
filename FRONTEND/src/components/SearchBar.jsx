import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

function SearchBar() {
  return (
    <div
      id="search-bar"
      className="w-[60%] px-3 py-2 flex items-center gap-3 rounded-md border-[1.5px] border-gray-400"
    >
      <FaMagnifyingGlass size={20}/>
      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full outline-none border-none"
      />
    </div>
  );
}

export default SearchBar;
