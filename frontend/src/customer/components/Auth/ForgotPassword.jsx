import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputField from "../InputField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as AuthService from "../../../services/AuthService";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { forgotSuccess } from "../../../redux/slides/accessSlice";

const defaultTheme = createTheme();

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const mutation = useMutationHook((data) => {
    const res = AuthService.sendOTP2(data);
    return res;
  });

  const navigate = useNavigate();

  const inputFullWidth = {
    width: "100%",
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleForgot = (event) => {
    event.preventDefault();
    mutation.mutate(
      {
        email: email,
      },
      {
        onSuccess: () => {
          message.success("Sended OTP");
          dispatch(
            forgotSuccess({
              email: email,
            })
          );
          navigate(`/otp/change/${"forgot"}`);
        },
        onError: (error) => {
          message.error(`Errors ${error.message}`);
        },
      }
    );
  };

  return (
    <div
      className="bg-gradient-to-r from-gray-100 to-gray-400"
      style={{
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
              Forgot Password
            </Typography>
            <form onSubmit={handleForgot}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputField
                    value={email}
                    label={"Email Address"}
                    name={"email"}
                    type={"email"}
                    style={inputFullWidth}
                    handleOnChange={handleOnChangeEmail}
                  />
                </Grid>
              </Grid>
              <Button
                disabled={!email.length}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleForgot}
              >
                Send OTP
              </Button>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
