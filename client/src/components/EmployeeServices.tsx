/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "./http-service/api";
import { API_LIST } from "./http-service/list";
import { Employee } from "../models/employeeModel/Employee";
import { User } from "../models/authModel/AuthModel";

export const GETEMPLOYEES = () => {
  return HttpClient.get(API_LIST.GETEMPLOYEES);
};

export const ADDEMPLOYEE = (payload: Employee|any) => {
  return HttpClient.post(API_LIST.ADDEMPLOYEE, payload);
};

export const UPDATEEMPLOYEE = (payload: Partial<Employee>|any) => {
  return HttpClient.put(API_LIST.EDITEMPLOYEE, payload.empid, payload);
};

export const DELETEEMPLOYEE = (payload:number) => {
  return HttpClient.delete(API_LIST.DELETEEMPLOYEE,payload);
};

export const LOGIN = (payload:Partial<User>) => {
    return HttpClient.post(API_LIST.LOGIN,payload)
}

export const REGISTER = (payload:User) => {
  return HttpClient.post(API_LIST.REGISTER,payload);
}

export const LOGOUT = (payload:any)=>{
  return HttpClient.post(API_LIST.LOGOUT,payload);
}