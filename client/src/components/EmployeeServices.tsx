import { HttpClient } from "./http-service/api";
import { API_LIST } from "./http-service/list";

// type employee = {
//   empId: any;
//   fullName: string;
//   designation: string;
//   department: string;
//   salary: any;
// };

interface Employee {
  empId: number;
  fullName: string;
  designation: string;
  department: string;
  salary: number;
}

interface User{
    fullname: string,
    email: string,
    password: string
}

export const GETEMPLOYEES = () => {
  return HttpClient.get(API_LIST.GETEMPLOYEES);
};

export const ADDEMPLOYEE = (payload: Employee) => {
  return HttpClient.post(API_LIST.ADDEMPLOYEE, payload);
};

export const UPDATEEMPLOYEE = (payload: Employee) => {
  return HttpClient.put(API_LIST.EDITEMPLOYEE, payload.empId, payload);
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