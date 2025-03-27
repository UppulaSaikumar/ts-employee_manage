import "./App.css";
import Employees from "./pages/Employees.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEmployee from "./components/AddEmployee.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import CredentialsSignInPage from '../CredentialsSignInPage';
import Register from "./pages/Register.tsx";
import { EmpProvider } from "./context/Empcontext.tsx";

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<CredentialsSignInPage />} /> {/* username : ram , password : Ram@123*/}
          <Route
            path="/"
            element={
              <PrivateRoute>
              <EmpProvider>
                <Employees /></EmpProvider>
               </PrivateRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <PrivateRoute>
              <EmpProvider>
                <AddEmployee /></EmpProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-employee/:empId"
            element={
              <PrivateRoute>
              <EmpProvider>
                <AddEmployee />
                </EmpProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/register"
            element={
                <Register />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;