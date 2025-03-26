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

  // Get the employee data from location state if it's available
  useEffect(() => {
    if (empId !== undefined && location.state?.employee) {
      const employeeToEdit = location.state.employee;
      setEmployee(employeeToEdit);
    }
  }, [empId, location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: name === "empId" ? (value ? Number(value) : "") : value,
    }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !employee.empId ||
      !employee.fullName ||
      !employee.designation ||
      !employee.department ||
      !employee.salary
    ) {
      alert("Please fill all the fields");
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
        // If it's not an edit (Add new employee)
        response = await ADDEMPLOYEE(payload);
      } else {
        // If it's an edit (Update employee)
        response = await UPDATEEMPLOYEE(payload);
      }
      alert(response.data.message);
      navigate("/"); // After adding or updating, navigate back to the employees list
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
          disabled={empId !== undefined} // Disable for editing
        />
        <br />
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={employee.fullName}
          onChange={handleChange}
        />
        <br />
        <label>Designation</label>
        <input
          type="text"
          name="designation"
          value={employee.designation}
          onChange={handleChange}
        />
        <br />
        <label>Department</label>
        <input
          type="text"
          name="department"
          value={employee.department}
          onChange={handleChange}
        />
        <br />
        <label>Salary</label>
        <input
          type="number"
          name="salary"
          value={employee.salary}
          onChange={handleChange}
        />
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
