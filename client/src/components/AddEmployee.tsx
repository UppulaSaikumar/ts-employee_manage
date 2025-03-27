import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ADDEMPLOYEE, UPDATEEMPLOYEE } from "./EmployeeServices";
import "./AddEmployee.css";

interface Employee {
  empId: any;
  fullName: string;
  designation: string;
  department: string;
  salary: any;
}

const AddEmployee: React.FC = () => {
  const { empId } = useParams<{ empId?: any }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [employee, setEmployee] = useState<Employee>({
    empId: "",
    fullName: "",
    designation: "",
    department: "",
    salary: "",
  });

  const [errors, setErrors] = useState({
    empId: "",
    fullName: "",
    designation: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    if (empId !== undefined && location.state?.employee) {
      const employeeToEdit = location.state.employee;
      setEmployee(employeeToEdit);
    }
  }, [empId, location.state]);

  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "empId":
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "Employee ID should be a positive number.";
        }
        break;
      case "fullName":
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
      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const errorMessage = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: name === "empId" || name === "salary" ? Number(value) : value,
    }));
  };

  const validateFields = () => {
    const newErrors = {
      empId: validateField("empId", employee.empId),
      fullName: validateField("fullName", employee.fullName),
      designation: validateField("designation", employee.designation),
      department: validateField("department", employee.department),
      salary: validateField("salary", employee.salary),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      alert("Please fill all the fields correctly");
      return;
    }

    try {
      let response;
      const payload = {
        ...employee,
        empId: Number(employee.empId),
        salary: Number(employee.salary),
      };

      if (empId === undefined) {
        response = await ADDEMPLOYEE(payload);
      } else {
        response = await UPDATEEMPLOYEE(payload);
      }
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      console.error("Error saving employee data", error);
    }
  };

  return (
    <div>
      <h1>{empId ? "Edit Employee" : "Add Employee"}</h1>
      <form onSubmit={handleAdd}>
        <label>Employee Id</label>
        <input
          type="number"
          name="empId"
          value={employee.empId}
          onChange={handleChange}
          disabled={empId !== undefined}
        />
        {errors.empId && <span className="error">{errors.empId}</span>}
        <br />

        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={employee.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}
        <br />

        <label>Designation</label>
        <input
          type="text"
          name="designation"
          value={employee.designation}
          onChange={handleChange}
        />
        {errors.designation && <span className="error">{errors.designation}</span>}
        <br />

        <label>Department</label>
        <input
          type="text"
          name="department"
          value={employee.department}
          onChange={handleChange}
        />
        {errors.department && <span className="error">{errors.department}</span>}
        <br />

        <label>Salary</label>
        <input
          type="number"
          name="salary"
          value={employee.salary}
          onChange={handleChange}
        />
        {errors.salary && <span className="error">{errors.salary}</span>}
        <br />

        {empId === undefined ? (
          <button className="add-emp" type="submit">
            Add Employee
          </button>
        ) : (
          <button className="edit" type="submit">
            Update Employee
          </button>
        )}
      </form>
    </div>
  );
};

export default AddEmployee;
