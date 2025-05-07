import { ReactNode } from "react";

export interface EmpContextType {
    name: string;
    setName: (name: string) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (authStatus: boolean,fullname:string|null) => void;
}

export type PrivateRouteProps = {
    children: ReactNode;
  };