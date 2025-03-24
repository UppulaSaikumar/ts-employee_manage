import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddEmployee.css";

interface Employee {
  empId: string;
  fullName: string;
  designation: string;
  department: string;
  salary: string;
}

const AddEmployee: React.FC = () => {
  const { empId } = useParams<{ empId?: string }>();
  const navigate = useNavigate();
  console.log("llkk=>", empId);
  const [employee, setEmployee] = useState<Employee>({
    empId: "",
    fullName: "",
    designation: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `http://localhost:3000/api/employee/${empId}`
      );
      console.log("---===>", response);
      setEmployee(response.data.employee);
    }
    if (empId !== undefined) {
      fetchData();
    }
  }, [empId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
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
      if (empId === undefined) {
        response = await axios.post("http://localhost:3000/api/employee", employee);
      } else {
        response = await axios.put(`http://localhost:3000/api/employee/${empId}`, employee);
      }
      console.log(response);
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
        <br />
        <label>Full Name</label>
        <input type="text" name="fullName" value={employee.fullName} onChange={handleChange} />
        <br />
        <label>Designation</label>
        <input type="text" name="designation" value={employee.designation} onChange={handleChange} />
        <br />
        <label>Department</label>
        <input type="text" name="department" value={employee.department} onChange={handleChange} />
        <br />
        <label>Salary</label>
        <input type="number" name="salary" value={employee.salary} onChange={handleChange} />
        <br />
        {empId === undefined ? (
          <button className="add-emp" type="submit">Add Employee</button>
        ) : (
          <button className="edit" type="submit">Update Employee</button>
        )}
      </form>
    </div>
  );
};

export default AddEmployee;
