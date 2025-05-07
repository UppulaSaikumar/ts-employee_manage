/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ADDEMPLOYEE, UPDATEEMPLOYEE, REGISTER } from "./EmployeeServices";
import { Employee } from "../models/employeeModel/Employee";
import { User } from "../models/authModel/AuthModel";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const fileToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

const AddEmployee = () => {
  const { empid } = useParams<{ empid?: any }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [employee, setEmployee] = useState<Employee>({
    empid: "",
    profile: "",
    fullname: "",
    designation: "",
    department: "",
    salary: "",
    role: "employee",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    empid: "",
    fullname: "",
    designation: "",
    department: "",
    salary: "",
    role: "",
    email: "",
    password: "",
  });

  const departments = [
    "Research and Development (R&D)",
    "Security",
    "Quality Assurance (QA)",
    "Operations",
    "Legal",
    "IT/Infrastructure",
    "Finance and Accounting",
    "Human Resources (HR)",
    "Customer Support",
    "Sales",
    "Marketing",
    "Design/UX (User Experience)",
    "Product Management",
    "Software Development/Engineering",
  ];

  useEffect(() => {
    if (empid !== undefined && location.state?.employee) {
      const employeeToEdit = location.state.employee;
      setEmployee(employeeToEdit);
    }
  }, [empid, location.state]);

  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "empid":
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "Employee ID should be a positive number.";
        }
        break;
      case "fullname":
        if (!value.trim()) {
          errorMessage = "Full Name is required.";
        }
        break;
      case "designation":
        if (!value.trim()) {
          errorMessage = "Designation is required.";
        }
        break;
      case "department":
        if (!value.trim()) {
          errorMessage = "Department is required.";
        }
        break;
      case "salary":
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "Salary should be a valid positive number.";
        }
        break;
      case "role":
        if (!value) {
          errorMessage = "Role is required.";
        }
        break;
      case "email":
        if (empid === undefined) {
          if (!value.trim()) {
            errorMessage = "Email is required.";
          } else if (!/^\S+@\S+\.\S+$/.test(value)) {
            errorMessage = "Invalid email format.";
          }
        }
        break;
      case "password":
        if (empid === undefined) {
          if (!value.trim()) {
            errorMessage = "Password is required.";
          } else if (value.length < 6) {
            errorMessage = "Password must be at least 6 characters.";
          }
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };
  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files, type } = e.target as HTMLInputElement;

    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      const base64String = await fileToBase64(file);
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: base64String,
      }));
      return;
    }

    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: name === "empid" || name === "salary" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const newErrors = {
      empid: validateField("empid", employee.empid),
      fullname: validateField("fullname", employee.fullname),
      designation: validateField("designation", employee.designation),
      department: validateField("department", employee.department),
      salary: validateField("salary", employee.salary),
      role: validateField("role", employee.role),
      email:
        empid === undefined ? validateField("email", employee.email || "") : "",
      password:
        empid === undefined
          ? validateField("password", employee.password || "")
          : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employee.role) {
      employee.role = "employee";
    }

    if (!validateFields()) {
      toast.error("Please fill all the fields correctly");
      return;
    }

    const empPayload = {
      empid: Number(employee.empid),
      profile: employee.profile,
      fullname: employee.fullname,
      designation: employee.designation,
      department: employee.department,
      salary: Number(employee.salary),
      role: employee.role,
    };

    try {
      if (empid === undefined) {
        const adminPayload: User = {
          empid: Number(employee.empid),
          fullname: employee.fullname,
          email: employee.email!,
          password: employee.password!,
        };
        await ADDEMPLOYEE(empPayload);
        console.log("Resgister payload", adminPayload);
        await REGISTER(adminPayload);
        toast.success("Employee and admin credentials added successfully.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const response = await UPDATEEMPLOYEE(empPayload);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.error(
        `Employee is already present with emp ID ${empPayload.empid}`
      );
    }
  };

  return (
    <div>
      <h1>{empid ? "Edit Employee" : "Add Employee"}</h1>
      <form onSubmit={handleAdd}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {employee.profile && (
            <img
              src={employee.profile as string}
              alt="Profile Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}

          <label>Profile</label>
          <input
            type="file"
            name="profile"
            onChange={handleInputChange}
            className="form-control fromFilespop"
            accept="image/*"
          />

          <TextField
            label="Employee Id"
            name="empid"
            value={employee.empid}
            onChange={handleInputChange}
            fullWidth
            disabled={empid !== undefined}
            error={!!errors.empid}
            helperText={errors.empid}
          />

          <TextField
            label="Full Name"
            name="fullname"
            value={employee.fullname}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.fullname}
            helperText={errors.fullname}
          />

          <TextField
            label="Designation"
            name="designation"
            value={employee.designation}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.designation}
            helperText={errors.designation}
          />

          {/* <FormControl fullWidth error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={employee.department}
              onChange={handleSelectChange}
              title="department"
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.department}</FormHelperText>
          </FormControl> */}

          <FormControl fullWidth error={!!errors.department}>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={employee.department}
              onChange={handleSelectChange}
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.department}</FormHelperText>
          </FormControl>

          <TextField
            label="Salary"
            name="salary"
            value={employee.salary}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.salary}
            helperText={errors.salary}
          />

          {/* <FormControl fullWidth error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={employee.role}
              onChange={handleSelectChange}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <FormHelperText>{errors.role}</FormHelperText>
          </FormControl> */}

          <FormControl fullWidth error={!!errors.role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={employee.role}
              onChange={handleSelectChange}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <FormHelperText>{errors.role}</FormHelperText>
          </FormControl>

          {empid === undefined && (
            <>
              <TextField
                label="Email"
                name="email"
                value={employee.email}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                label="Password"
                name="password"
                value={employee.password}
                onChange={handleInputChange}
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
            </>
          )}

          <Button type="submit" variant="contained" color="primary">
            {empid === undefined ? "Add Employee" : "Update Employee"}
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddEmployee;
