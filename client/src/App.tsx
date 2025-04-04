import "./App.css";
import Employees from "./components/Employees.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import AddEmployee from "./components/AddEmployee.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import CredentialsSignInPage from '../CredentialsSignInPage';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<CredentialsSignInPage />} /> {/* username : ram , password : Ram@123*/}
          <Route
            path="/"
            element={
              // <PrivateRoute>
                <Employees />
              // </PrivateRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              // <PrivateRoute>
                <AddEmployee />
              // </PrivateRoute>
            }
          />
          <Route
            path="/edit-employee/:empId"
            element={
              // <PrivateRoute>
                <AddEmployee />
              // </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;