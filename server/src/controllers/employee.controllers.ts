import { Request, Response } from "express";
import * as employeeService from "../services/employee.services";
import { Employee } from "../types/employee.types";

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.status(200).json({ employees });
    } catch (err) {
        console.error("Error fetching data: ", err);
        res.status(500).send("Error fetching data");
    }
};

export const insert = async (req: Request, res: Response): Promise<void> => {
    console.log("Adding req",req.body);
    const { empid, profile, fullname, designation, department, salary, role } = req.body as Employee;
    if (!empid || !fullname || !designation || !department || !salary || !role) {
        console.log("(!empid || !fullname || !designation || !department || !salary || !role)", empid, fullname, designation, department, salary, role)
        res.status(400).send("All fields are required");
        return;
    }

    try {
        await employeeService.insertEmployee({ empid, profile, fullname, designation, department, salary, role });
        res.status(201).json({ message: "Data saved successfully" });
    } catch (err) {
        console.error("Error saving data: ", err);
        res.status(500).send(err);
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { profile, fullname, designation, department, salary } = req.body as Employee;

    if (!fullname || !designation || !department || !salary) {
        res.status(400).send("All fields are required");
        return;
    }

    try {
        await employeeService.updateEmployee(id, { profile, fullname, designation, department, salary });
        res.status(200).json({ message: "Data updated successfully" });
    } catch (err:any) {
        console.error("Error updating data: ", err);
        if (err.message === "Employee not found") {
            res.status(404).send("Employee not found");
        } else {
            res.status(500).send("Error updating data");
        }
    }
};

export const deletion = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await employeeService.deleteEmployee(id);
        res.status(200).json({ message: "Data deleted successfully" });
    } catch (err) {
        console.error("Error deleting data: ", err);
        res.status(500).send("Error deleting data");
    }
};
