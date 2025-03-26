import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REGISTER } from "../components/EmployeeServices";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ fullname: string; email: string; password: string }>({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const response = await axios.post("http://localhost:3000/api/register", user);
      const response = await REGISTER(user)
      console.log("registerres", response.data.token);
      localStorage.setItem("token", response.data.token);
      console.log("===", response);
      alert(response.statusText);
      if (response.data.token === localStorage.getItem("token")) {
        navigate("/");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Regitration failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname">FullName</label>
          </div>
          <div>
            <input type="text" id="fullname" name="fullname" onChange={handleChange} required />
          </div>
          <br />
          <div>
            <label htmlFor="email">Email</label>
          </div>
          <div>
            <input type="text" id="email" name="email" onChange={handleChange} required />
          </div>
          <br />
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <div>
            <input type="password" id="password" name="password" onChange={handleChange} required />
          </div>
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
