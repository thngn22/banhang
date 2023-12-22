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
import { useDispatch, useSelector } from "react-redux";
import { changeSuccess, signSuccess } from "../../../redux/slides/accessSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { useEffect } from "react";

const defaultTheme = createTheme();

export default function ChangePassword() {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${data}`;
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const mutation = useMutationHook((data) => AuthService.sendOTP2(data));

  // const { data, status } = mutation;

  const navigate = useNavigate();

  const inputFullWidth = {
    width: "100%",
  };

  useEffect(() => {
    if (auth) {
      setEmail(auth?.email);
    }
  }, [auth]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangePassword = (value) => {
    setPassword(value);
  };
  const handleOnChangeNewPassword = (value) => {
    setNewPassword(value);
  };
  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    mutation.mutate(
      {
        email: email,
        password: password,
        newPassword: newPassword,
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
      changeSuccess({
        email: email,
        password: password,
        newPassword: newPassword,
        newPasswordConfirm: confirmPassword,
      })
    );
    navigate(`/otp/${"change"}`);
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
              Đăng ký
            </Typography>
            <form onSubmit={handleSignUp}>
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
                    label={"Password"}
                    name={"password"}
                    type={"password"}
                    style={inputFullWidth}
                    handleOnChange={handleOnChangePassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    value={newPassword}
                    label={"New Password"}
                    name={"newPassword"}
                    type={"password"}
                    style={inputFullWidth}
                    handleOnChange={handleOnChangeNewPassword}
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
                {newPassword !== confirmPassword && (
                  <Typography style={{ color: "red", marginLeft: "16px" }}>
                    ConfirmPassword không trùng khớp
                  </Typography>
                )}
              </Grid>
              <Button
                disabled={
                  !email.length ||
                  !password.length ||
                  !newPassword.length ||
                  !confirmPassword.length ||
                  !(newPassword === confirmPassword)
                }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignUp}
              >
                Gửi mã OTP
              </Button>
            </form>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Bạn đã có tài khoản? Hãy Đăng nhập
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
