import "./App.css";
import Employees from "./pages/Employees.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEmployee from "./components/AddEmployee.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import CredentialsSignInPage from "./pages/CredentialsSignInPage.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<CredentialsSignInPage />} />
          {/* username : ram , password : Ram@123*/}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <PrivateRoute>
                <AddEmployee />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-employee/:empid"
            element={
              <PrivateRoute>
                <AddEmployee />
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </>
  );
};

export default App;
