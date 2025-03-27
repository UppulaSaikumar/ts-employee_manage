import * as React from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { LOGIN } from "./src/components/EmployeeServices";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { EmpCon } from "./src/context/Empcontext";

const providers = [{ id: "credentials", name: "Email and Password" }];

interface User {
  fullname: string;
  email: string;
  password: string;
}

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
    <Link href="/register" variant="body2">
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/register" variant="body2">
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
  const empCtx=useContext(EmpCon);
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={async(provider:any, formData:FormData): Promise<any> => {
          alert(
            `Logging in with "${provider.name}" and credentials: ${formData.get(
              "email"
            )}, ${formData.get("password")}, and checkbox value: ${formData.get(
              "tandc"
            )}`
          );
          const user: Partial<User> = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          };
          console.log("Signing in as:", user);
            try {
              const response = await LOGIN(user);
              console.log("Response from login:", response);
              empCtx!.setIsAuthenticated(true, response.data.fullname[0].fullname);
              if(response.data.message === 'successfull'){
                localStorage.setItem("Employee",response.data.fullname[0].fullname);
                localStorage.setItem("auth-emp",'true');
              }
              if (response.status === 200) {
                console.log("Response from login:", response);
                alert("Login successful!");
                navigate('/');
              } else {
                console.error("Invalid credentials");
                alert("Wrong credentials. Please try again.");
              }
            } catch (error) {
              console.error("Error during login:", error);
              alert("An error occurred while logging in. Please try again.");
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
    </AppProvider>
  );
}
