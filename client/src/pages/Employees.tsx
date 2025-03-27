import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GETEMPLOYEES, DELETEEMPLOYEE, LOGOUT } from "../components/EmployeeServices";
import { useContext } from "react";

import { EmpCon } from "../context/Empcontext";

interface Employee {
  empId: any;
  fullName: string;
  designation: string;
  department: string;
  salary: string;
}

const Employees: React.FC = () => {
  const ctx=useContext(EmpCon);
  console.log("tgftgrsakjlfbakj",ctx)
  const navigate = useNavigate();
  const [view, setView] = useState<boolean>(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAdd = () => {
    navigate("/add-employee");
  };

  const handleEdit = (empId: any) => {
    const employeeToEdit = employees.find((employee) => employee.empId === empId);
    console.log("EDITEMPDETAILS",employeeToEdit);
    navigate(`/edit-employee/${empId}`, { state: { employee: employeeToEdit } });
  };
  

  const handleDelete = async (empId: number) => {
    try {
      const response = await DELETEEMPLOYEE(empId);
      alert(response.data.message);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.empId !== empId)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    }
  };

  const handleView = (empId: number) => {
    const emp = employees.find((employee) => employee.empId === empId);
    setViewEmployee(emp || null);
    setView(true);
  };

  const handleLogout = async() => {
    await LOGOUT(null);
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // const response = await axios.get("http://localhost:3000/api/get_employees");
        const isauth=localStorage.getItem("auth-emp")==='true';
        ctx!.setIsAuthenticated(isauth, localStorage.getItem("Employee"));
        const response = await GETEMPLOYEES();
        console.log("after context response",response.data.employees);
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
      <h2>Hello {ctx!.name}</h2>
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
