import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage, type AuthProvider } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { LOGIN } from "./src/components/EmployeeServices";

// preview-start
const providers = [{ id: "credentials", name: "Email and Password" }];
// preview-end

interface User {
  username: string;
  email: string;
  password: string;
}

// Hardcoded user data
// const user: User = {
//   username: "saikumar",
//   email: "saikumar@example.com", // Example email
//   password: "password123", // Example password
// };

const signIn: (provider: AuthProvider, formData: FormData) => void = async (
  provider,
  formData
) => {
  const promise = new Promise<void>((resolve) => {
    setTimeout(async (e: React.FormEvent<HTMLFormElement>) => {
      // e.preventDefault();
      // Displaying the credentials entered for sign-in
      // alert(
      //   `Signing in with "${provider.name}" and credentials: ${formData.get(
      //     "email"
      //   )}, ${formData.get("password")}`
      // );
      const user: Partial<User> = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      console.log("Signing in as:", user);

      try {
        const response = await LOGIN(user);
        console.log("Response from login:", response);
      //   resolve();
      // } catch (error) {
      //   console.error("Error during login:", error);
      //   resolve();
      // }
      if (response.status === 200) {
        console.log("Response from login:", response);
        alert("Login successful!");
      } else {
        console.error("Invalid credentials");
        alert("Wrong credentials. Please try again.");
      }
      resolve();
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please try again.");
      resolve();
    }
    }, 300);
  });
  return promise;
};

export default function CredentialsSignInPage() {
  const theme = useTheme();

  return (
    // preview-start
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          form: { noValidate: true },
        }}
      />
    </AppProvider>
    // preview-end
  );
}
