import * as React from "react";
import { Button, FormControl, FormControlLabel, Checkbox, InputLabel, OutlinedInput, TextField, InputAdornment, Link, Alert, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { LOGIN } from "../components/EmployeeServices";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { EmpCon } from "../context/Empcontext";
import { User } from "../models/authModel/AuthModel";
// import { LOGOUT } from "../components/EmployeeServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const providers = [{ id: "credentials", name: "Email and Password" }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/login" variant="body2">
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/login" variant="body2">
      Forgot password?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

function Subtitle() {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity="warning">
      We are investigating an ongoing outage.
    </Alert>
  );
}

function AgreeWithTerms() {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="tandc"
          value="true"
          color="primary"
          sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
        />
      }
      slotProps={{
        typography: {
          fontSize: 14,
        },
      }}
      color="textSecondary"
      label="I agree with the T&C"
    />
  );
}

export default function SlotsSignIn() {
  const empCtx = useContext(EmpCon);
  const navigate = useNavigate();
  const theme = useTheme();
  React.useEffect(() => {
    // LOGOUT(null);
  }, []);

  return (
    <AppProvider theme={theme}>
      <SignInPage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signIn={async (_provider, formData: FormData): Promise<any> => {
          const user: Partial<User> = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          };
          try {
            const response = await LOGIN(user);
            console.log("login response",response);
            empCtx!.setIsAuthenticated(true, response.data.fullname);
            if (response.status === 200) {
              console.log("===>>",response.data);
              sessionStorage.setItem("Employee", response.data.fullname);
              sessionStorage.setItem("auth-emp", "true");
              sessionStorage.setItem("empid", response.data.empid);
              sessionStorage.setItem("role", response.data.role);
              setTimeout(() => {
                sessionStorage.clear();
                console.log("sessionStorage cleared after 1 hour.");
              }, 3600000);
            }
            if (response.data.message === "Login successful") {
              toast.success("Login successful!");
              setTimeout(() => {
                navigate(`/`);
              }, 1000);
            } else {
              console.error("Invalid credentials");
              toast.error("Wrong credentials. Please try again.");
            }
          } catch (error) {
            console.error("Error during login:", error);
            toast.error("Invalid Email or password");
          }
        }}
        slots={{
          title: Title,
          subtitle: Subtitle,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
          rememberMe: AgreeWithTerms,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        providers={providers}
      />
      <ToastContainer />
    </AppProvider>
  );
}
