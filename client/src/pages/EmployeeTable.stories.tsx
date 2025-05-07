import type { Meta, StoryObj } from "@storybook/react";
import EmployeeTable from "./EmployeeTable";
import { Employee } from "../models/employeeModel/Employee";

// Dummy employee data for story preview
const mockEmployees:Employee[] = [
  {
    empid: 1,
    fullname: "Alice Johnson",
    designation: "Software Engineer",
    department: "Development",
    salary: 85000,
    profile: "https://i.pravatar.cc/150?img=1",
    role:"admin"
  },
  {
    empid: 2,
    fullname: "Bob Smith",
    designation: "UI/UX Designer",
    department: "Design",
    salary: 78000,
    profile: "https://i.pravatar.cc/150?img=2",
    role:"admin"
  },
  {
    empid: 3,
    fullname: "Charlie Brown",
    designation: "Product Manager",
    department: "Product",
    salary: 95000,
    profile: "https://i.pravatar.cc/150?img=3",
    role:"admin"
  },
  {
    empid: 4,
    fullname: "Daisy Miller",
    designation: "QA Engineer",
    department: "Testing",
    salary: 70000,
    profile: "https://i.pravatar.cc/150?img=4",
    role:"admin"
  },
  {
    empid: 5,
    fullname: "Ethan Hunt",
    designation: "DevOps Engineer",
    department: "Infrastructure",
    salary: 92000,
    profile: "https://i.pravatar.cc/150?img=5",
    role:"admin"
  },
];

const meta: Meta<typeof EmployeeTable> = {
  title: "Components/EmployeeTable",
  component: EmployeeTable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof EmployeeTable>;

export const Default: Story = {
  args: {
    employees: mockEmployees,
    onEdit: (id: number) => alert(`Edit clicked for ID: ${id}`),
    onDelete: (id: number) => alert(`Delete clicked for ID: ${id}`),
    onView: (id: number) => alert(`View clicked for ID: ${id}`),
  },
};
