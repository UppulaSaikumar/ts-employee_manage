import React, { createContext, useState, useEffect } from "react";
import { EmpContextType } from "../models/contextmodel/Context";
// eslint-disable-next-line react-refresh/only-export-components
export const EmpCon = createContext<EmpContextType | undefined>(undefined);

export const EmpProvider = (
  {
    children
  }: {
    children: React.ReactNode;
  }
) => {
  const [name, setName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  
  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("Employee");
    const authStatus = sessionStorage.getItem("auth-emp") === "true";
    if (authStatus && storedEmployee) {
      setName(storedEmployee);
      setIsAuthenticated(true);
    }
  }, []);

  const setAuth = (status: boolean, fullname: string|null) => {
    setIsAuthenticated(status);
    if (status && fullname) {
      setName(fullname);
      sessionStorage.setItem("Employee", fullname);
      sessionStorage.setItem("auth-emp", "true");
    } else {
      setName("");
      sessionStorage.removeItem("Employee");
      sessionStorage.removeItem("auth-emp");
    }
  };

  return (
    <EmpCon.Provider value={{ name, setName, isAuthenticated,setIsAuthenticated:setAuth }}>
      {children}
    </EmpCon.Provider>
  );
};
