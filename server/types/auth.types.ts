import { Request } from "express";
export type User = {
    fullname: string;
    email: string;
    password: string;
};
  
export interface smallReq extends Request{
    email?:string
}