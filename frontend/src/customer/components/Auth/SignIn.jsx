import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";
import InputField from "../InputField";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as UserSerVice from "../../../services/UserService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useEffect } from "react";
import jwt_decode, { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import userSlide, { updateUser } from "../../../redux/slides/userSlide";
import { loginSuccess } from "../../../redux/slides/authSlice";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const mutation = useMutationHook((data) => UserSerVice.loginUser(data));

  const { data, status, isSuccess, isError } = mutation;

  const inputFullWidth = {
    width: "100%",
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
      if (data?.accessToken) {
        handleGetProfileUser(data?.accessToken);
      }
    }
  }, [isSuccess]);

  const handleGetProfileUser = async (accessToken) => {
    const res = await UserSerVice.getProfileUser(accessToken);
    const decode = jwtDecode(accessToken);
    const isAdmin = decode.role[0] === "ROLE_ADMINISTRATOR";
    dispatch(loginSuccess({ ...res, accessToken, isAdmin }));
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleForgot = () => {
    navigate("/forgot");
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    mutation.mutate({
      email: email,
      password: password,
    });
    console.log("information for sign in", email, password);
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(128, 128, 128, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="xs"
          sx={{ bgcolor: "#fff", padding: "20px", borderRadius: "10px" }}
        >
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {status === "error" && (
              <Typography style={{ color: "red" }}>
                Email hoặc mật khẩu bị sai
              </Typography>
            )}
            <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
              <InputField
                value={email}
                label={"Email Address"}
                name={"email"}
                type={"email"}
                style={inputFullWidth}
                handleOnChange={handleOnChangeEmail}
              />

              <InputField
                value={password}
                label={"Password"}
                name={"password"}
                type={"password"}
                style={inputFullWidth}
                handleOnChange={handleOnChangePassword}
              />

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                sx={{ textAlign: "left", width: "100%" }}
              />
              <Button
                disabled={!email.length || !password.length}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs sx={{ textAlign: "left" }}>
                  <Link
                    variant="body2"
                    component="a"
                    onClick={handleForgot}
                    sx={{ cursor: "pointer" }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    variant="body2"
                    component="a"
                    onClick={handleSignUp}
                    sx={{ cursor: "pointer" }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
