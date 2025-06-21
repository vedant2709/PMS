import React, { useState } from "react";
import { register } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(form);
    e.preventDefault();
    try {
      await register(form);
      setForm({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Register
        </button>
        <div className="flex justify-center">
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
