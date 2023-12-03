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
import InputField from "../InputField";
import { useState } from "react";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as UserSerVice from "../../../services/UserService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function ConfirmOTP() {
  const [otp, setOtp] = useState("");
  const email = localStorage.getItem("email");

  const navigate = useNavigate();

  const mutation = useMutationHook((data) => UserSerVice.sendOTP(data));

  const { isSuccess, isError } = mutation;

  const message = "";

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    } else if (isError) {
      message = "Mã OTP sai, mời bạn kiểm tra lại";
    }
  }, [isSuccess, isError]);

  const inputFullWidth = {
    width: "100%",
  };

  const handleSubmit = (event) => {
    mutation.mutate({
      email: email,
      oneTimePassword: otp,
    });

    localStorage.clear()
  };

  const handleOnChangeOTP = (value) => {
    setOtp(value);
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
              Check message OTP in Email
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {message !== "" && (
                <Typography style={{ color: "red", marginLeft: "16px" }}>
                  {message}
                </Typography>
              )}
              <InputField
                value={otp}
                label={"OTP"}
                name={"otp"}
                type={"text"}
                style={inputFullWidth}
                handleOnChange={handleOnChangeOTP}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Check
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
