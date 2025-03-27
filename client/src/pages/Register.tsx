import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { REGISTER } from "../components/EmployeeServices";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<{ fullname: string; email: string; password: string }>({
    fullname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ fullname: string; email: string; password: string }>({
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

    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullname":
        if (value.trim() === "") {
          newErrors.fullname = "Full Name is required.";
        } else {
          newErrors.fullname = "";
        }
        break;

      case "email":
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (value.trim() === "") {
          newErrors.email = "Email is required.";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address.";
        } else {
          newErrors.email = "";
        }
        break;

      case "password":
        if (value.trim() === "") {
          newErrors.password = "Password is required.";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters long.";
        } else {
          newErrors.password = "";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const response = await REGISTER(user);
      console.log("===", response);
      alert(response.statusText);
      if (response.statusText === 'Created') {
        navigate("/login");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              required
            />
            {errors.fullname && <span className="error">{errors.fullname}</span>}
          </div>
          <br />
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <br />
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <br />
          <div>
            <button type="submit" className="register">Register</button>
            <button type="button" className="sign-in" onClick={() => { navigate('/login') }}>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
