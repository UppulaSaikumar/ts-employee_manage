import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
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
      const response = await axios.post("http://localhost:3000/api/login", user);
      console.log("loginres", response.data.token);
      localStorage.setItem("token", response.data.token);
      console.log("===", response);
      alert(response.statusText);
      if (response.data.token === localStorage.getItem("token")) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">UserName</label>
          </div>
          <div>
            <input type="text" id="username" name="username" onChange={handleChange} required />
          </div>
          <br />
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <div>
            <input type="password" id="password" name="password" onChange={handleChange} required />
          </div>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
