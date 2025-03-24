import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Employee {
  empId: string;
  fullName: string;
  designation: string;
  department: string;
  salary: string;
}

const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<boolean>(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAdd = () => {
    navigate("/add-employee");
  };

  const handleEdit = (empId: string) => {
    navigate(`/edit-employee/${empId}`);
  };

  const handleDelete = async (empId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/employee/${empId}`
      );
      alert(response.data.message);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.empId !== empId)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    }
  };

  const handleView = (empId: string) => {
    const emp = employees.find((employee) => employee.empId === empId);
    setViewEmployee(emp || null);
    setView(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/employees");
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Employees Table</h1>
      <button className="add-emp" onClick={handleAdd}>Add Employee</button>
      <button className="log-out" onClick={handleLogout}>Logout</button>
      <br />
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="employee-table">
          <thead className="thead">
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.empId}>
                <td>{employee.empId}</td>
                <td>{employee.fullName}</td>
                <td>{employee.designation}</td>
                <td>{employee.department}</td>
                <td>{employee.salary}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(employee.empId)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(employee.empId)}>
                    Delete
                  </button>
                  <button className="view" onClick={() => handleView(employee.empId)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view && viewEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Employee Details</h2>
            <p>
              <strong>ID:</strong> {viewEmployee.empId}
            </p>
            <p>
              <strong>Name:</strong> {viewEmployee.fullName}
            </p>
            <p>
              <strong>Designation:</strong> {viewEmployee.designation}
            </p>
            <p>
              <strong>Department:</strong> {viewEmployee.department}
            </p>
            <p>
              <strong>Salary:</strong> {viewEmployee.salary}
            </p>
            <button onClick={() => setView(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
