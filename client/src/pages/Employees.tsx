import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  GETEMPLOYEES,
  DELETEEMPLOYEE,
  LOGOUT,
} from "../components/EmployeeServices";
import { EmpCon } from "../context/Empcontext";
import { Employee } from "../models/employeeModel/Employee";
import EmployeeTable from "./EmployeeTable";
import EmployeeModal from "../components/EmployeeModal";
import CircularWithValueLabel from "../components/CircularWithValueLabel";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employees = () => {
  const ctx = useContext(EmpCon);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>("");
  const [empID, setEmpID] = useState<number | null>();

  const handleAdd = () => {
    navigate("/add-employee");
  };

  const handleEdit = (empid: number) => {
    if(role!=="admin" && empID!==empid){
      toast.error("You Doesn't have Permissions to Edit");
      return;
    }
    const employeeToEdit = employees.find(
      (employee) => employee.empid === empid
    );
    navigate(`/edit-employee/${empid}`, {
      state: { employee: employeeToEdit },
    });
  };

  const handleDelete = async (empid: number) => {
    if(role!=="admin" && empID!==empid){
      toast.error("You Doesn't have Permissions to Delete");
      return;
    }
    try {
      const response = await DELETEEMPLOYEE(empid);
      toast(response.data.message)
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.empid !== empid)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast("Failed to delete employee.");
    }
  };

  const handleView = (empid: number) => {
    const emp = employees.find((employee) => employee.empid === empid);
    setViewEmployee(emp || null);
    setView(true);
  };

  const handleLogout = async () => {
    await LOGOUT(null);
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const isauth = sessionStorage.getItem("auth-emp") === "true";
        ctx!.setIsAuthenticated(isauth, sessionStorage.getItem("Employee"));
        setRole(sessionStorage.getItem("role"));
        setEmpID(Number(sessionStorage.getItem("empid")));
        const response = await GETEMPLOYEES();
        console.log(response.data)
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    }
    fetchData();
  }, [ctx]);

  return (
    <div>
      <h2>Hello {ctx!.name}</h2>
      {loading ? (
        <CircularWithValueLabel />
      ) : (
        <div>
          {(role==="admin") &&<IconButton
            color="primary"
            onClick={handleAdd}
            title="Add Employee"
            sx={{
              marginRight: 2,
              fontSize: "3rem",
            }}
            aria-label="add employee"
          >
            <AddCircleIcon sx={{ fontSize: "inherit" }} />
          </IconButton>}

          <IconButton
            color="secondary"
            title="logout"
            onClick={handleLogout}
            sx={{
              fontSize: "3rem",
            }}
            aria-label="logout"
          >
            <ExitToAppIcon sx={{ fontSize: "inherit" }} />
          </IconButton>
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      )}

      {view && viewEmployee && (
        <EmployeeModal employee={viewEmployee} onClose={() => setView(false)} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Employees;
