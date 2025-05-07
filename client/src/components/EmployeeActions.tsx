import { EmployeeActionsProps } from "../models/employeeModel/Employee";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const EmployeeActions = (
  {
    empid,
    onEdit,
    onDelete,
    onView
  }: EmployeeActionsProps
) => {
  return (
    <div className="actions">
      <Button
        variant="outlined"
        color="primary"
        startIcon={<EditIcon sx={{ marginLeft: 1 }} />}
        disabled={ sessionStorage.getItem("role") !=="admin" && Number(sessionStorage.getItem("empid")) !== empid}
        onClick={() => onEdit(empid)}
        sx={{ marginRight: 1 }}
      >
      </Button>
      
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon sx={{ marginLeft: 1 }} />}
        disabled={ sessionStorage.getItem("role") !=="admin" && Number(sessionStorage.getItem("empid")) !== empid}
        onClick={() => onDelete(empid)}
        sx={{ marginRight: 1 }}
      >
      </Button>

      <Button
        variant="outlined"
        color="info"
        startIcon={<VisibilityIcon sx={{ marginLeft: 1 }} />}
        onClick={() => onView(empid)}
      >
      </Button>
    </div>
  );
};

export default EmployeeActions;
