import { Request } from "express";
export type Employee = {
    empid:number;
    fullname: string;
    email: string;
    password: string;
};
  
export interface smallReq extends Request{
    email?:string
}