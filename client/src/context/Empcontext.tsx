import React, { createContext, useState, useEffect } from "react";

interface EmpContextType {
  name: string;
  setName: (name: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authStatus: boolean,fullname:string|null) => void;
}

export const EmpCon = createContext<EmpContextType | undefined>(undefined);

export const EmpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  
  useEffect(() => {
    const storedEmployee = localStorage.getItem("Employee");
    const authStatus = localStorage.getItem("auth-emp") === "true";
    if (authStatus && storedEmployee) {
      setName(storedEmployee);
      setIsAuthenticated(true);
    }
  }, []);

  const setAuth = (status: boolean, fullname: string|null) => {
    setIsAuthenticated(status);
    if (status && fullname) {
      setName(fullname);
      localStorage.setItem("Employee", fullname);
      localStorage.setItem("auth-emp", "true");
    } else {
      setName("");
      localStorage.removeItem("Employee");
      localStorage.removeItem("auth-emp");
    }
  };

  return (
    <EmpCon.Provider value={{ name, setName, isAuthenticated,setIsAuthenticated:setAuth }}>
      {children}
    </EmpCon.Provider>
  );
};
