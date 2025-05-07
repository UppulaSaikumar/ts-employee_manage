import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Pagination,
  IconButton,
  Tooltip,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import { EmployeeTableProps } from "../models/employeeModel/Employee";
import { Edit, Delete, Visibility, Search } from "@mui/icons-material";

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onView,
}: EmployeeTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 5;
  const filteredEmployees = employees
  .filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      String(emp.empid)?.toLowerCase().includes(query) ||
      emp.fullname?.toLowerCase().includes(query) ||
      emp.designation?.toLowerCase().includes(query) ||
      emp.department?.toLowerCase().includes(query)
    );
  })
  .sort((a, b) => {
    return Number(a.empid) - Number(b.empid);
  });


  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Employee Directory
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search by empid, name, designation, or department..."
        fullWidth
        sx={{ mb: 3 }}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer
        component={Paper}
        elevation={6}
        sx={{
          borderRadius: 4,
          overflowX: "auto",
          boxShadow: 5,
          backgroundColor: "#fff",
        }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "primary.main",
                "& th": {
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textAlign: "center",
                  py: 2,
                },
              }}
            >
              {[
                "Profile",
                "ID",
                "Name",
                "Designation",
                "Department",
                "Salary",
                "Actions",
              ].map((head) => (
                <TableCell key={head}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <TableRow
                  key={employee.empid}
                  sx={{
                    transition: "background-color 0.2s",
                    backgroundColor:
                      index % 2 === 0 ? "grey.50" : "common.white",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                    },
                  }}
                >
                  <TableCell align="center">
                    <Avatar
                      alt={employee.fullname}
                      src={employee.profile as string}
                      sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        border: "2px solid #ccc",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1">
                      {employee.empid}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="500">
                      {employee.fullname}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{employee.designation}</TableCell>
                  <TableCell align="center">{employee.department}</TableCell>
                  <TableCell align="center">
                    <Typography color="success.main" fontWeight={600}>
                      ₹{employee.salary}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton
                        onClick={() => onView(employee.empid)}
                        color="info"
                        // title="View"
                        aria-label="view"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => onEdit(employee.empid)}
                        color="primary"
                        // title="Edit"
                        aria-label="edit"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => onDelete(employee.empid)}
                        color="error"
                        // title="Delete"
                        aria-label="delete"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredEmployees.length > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default EmployeeTable;
