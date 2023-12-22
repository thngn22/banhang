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
import { useNavigate } from "react-router-dom";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as UserSerVice from "../../../services/UserService";
import * as AuthService from "../../../services/AuthService";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { forgotSuccess, signSuccess } from "../../../redux/slides/accessSlice";

const defaultTheme = createTheme();

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const mutation = useMutationHook((data) => AuthService.sendOTP2(data));

  const navigate = useNavigate();

  const inputFullWidth = {
    width: "100%",
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangePassword = (value) => {
    setPassword(value);
  };
  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleForgot = (event) => {
    event.preventDefault();
    mutation.mutate(
      {
        email: email,
        newPassword: password,
        newPasswordConfirm: confirmPassword,
      },
      {
        onSuccess: () => {
          message.success("Đã gửi mã OTP");
        },
        onError: (error) => {
          message.error(`Lỗi ${error.message}`);
        },
      }
    );
    dispatch(
      forgotSuccess({
        email: email,
        newPassword: password,
        newPasswordConfirm: confirmPassword,
      })
    );
    navigate(`/otp/${"forgot"}`);
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
              Quên mật khẩu
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
                <Grid item xs={12}>
                  <InputField
                    value={password}
                    label={"New Passowrd"}
                    name={"newPassword"}
                    type={"password"}
                    style={inputFullWidth}
                    handleOnChange={handleOnChangePassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    value={confirmPassword}
                    label={"Confirm Password"}
                    name={"confirmPassword"}
                    type={"password"}
                    style={inputFullWidth}
                    handleOnChange={handleOnChangeConfirmPassword}
                  />
                </Grid>
                {password !== confirmPassword && (
                  <Typography style={{ color: "red", marginLeft: "16px" }}>
                    ConfirmPassword không trùng khớp
                  </Typography>
                )}
              </Grid>
              <Button
                disabled={
                  !email.length ||
                  !password.length ||
                  !confirmPassword.length ||
                  !(password === confirmPassword)
                }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleForgot}
              >
                Gửi mã OTP
              </Button>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
