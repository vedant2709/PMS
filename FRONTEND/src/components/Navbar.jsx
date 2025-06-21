import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import SearchBar from "./SearchBar";
import { useEffect, useRef, useState } from "react";
import Avatar from "boring-avatars";
import AvatarInitials from "./AvatarInitials";

const Navbar = ({ onLogout, username }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);

  // ☑️ Close the menu if you click outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav
      id="navbar"
      className="bg-white w-full px-6 py-3 flex justify-between items-center z-50"
    >
      <div id="logo" className="w-10 flex items-center gap-3">
        <img src={logo} alt="" className="object-cover" />
        <h1 className="text-2xl font-medium text-[#0B3051]">TaskNest</h1>
      </div>
      {/* Search Bar */}
      <div className="flex w-1/2 justify-between gap-16 items-center">
        <SearchBar />
        <div id="profile" className="flex items-center gap-3">
          <div>
            <p className="text-sm">{username}</p>
            <p className="text-sm text-gray-500">Gujarat, India</p>
          </div>
          <AvatarInitials
            ref={avatarRef}
            name={username}
            onClick={() => setOpen((prev) => !prev)}
          />
          {/* 🔽 Pop‑up menu */}
          {open && (
            <div
              ref={menuRef}
              className="absolute right-2 top-18 w-40 bg-white shadow-lg p-2 z-50"
            >
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-md hover:bg-blue-100 cursor-pointer rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
