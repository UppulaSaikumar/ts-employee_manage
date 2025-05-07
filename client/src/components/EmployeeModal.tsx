import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import { EmployeeModalProps } from "../models/employeeModel/Employee";

const EmployeeModal = ({ employee, onClose }: EmployeeModalProps) => {
  if (!employee) return null;

  return (
    <Dialog open={!!employee} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Employee Details</DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {employee.profile && (
            <Avatar
              src={employee.profile as string}
              alt="Profile"
              sx={{ width: 100, height: 100 }}
            />
          )}
          <Typography><strong>ID:</strong> {employee.empid}</Typography>
          <Typography><strong>Name:</strong> {employee.fullname}</Typography>
          <Typography><strong>Role:</strong> {employee.role}</Typography>
          <Typography><strong>Designation:</strong> {employee.designation}</Typography>
          <Typography><strong>Department:</strong> {employee.department}</Typography>
          <Typography><strong>Salary:</strong> ₹{employee.salary}</Typography>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>Created At:</strong> {employee!.created_at}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Last Updated:</strong> {employee!.updated_at}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeModal;
