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
import { useNavigate, useParams } from "react-router-dom";
import * as AuthService from "../../../services/AuthService";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSuccess,
  forgotSuccess,
  signSuccess,
} from "../../../redux/slides/accessSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { message } from "antd";

const defaultTheme = createTheme();

export default function ConfirmOTPChange() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forwhat } = useParams();
  console.log("forwhat", forwhat);
  const auth = useSelector((state) => state.auth.login.currentUser);
  const change = useSelector((state) => state.access.change.currentUser);
  const forgot = useSelector((state) => state.access.forgot.currentUser);

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

  const mutation = useMutationHook((data) => {
    const res = AuthService.changePassword(auth?.accessToken, data, axiosJWT);
    return res;
  });
  const mutationForgot = useMutationHook((data) => {
    const res = AuthService.forgotPassword(data);
    return res;
  });

  const inputFullWidth = {
    width: "100%",
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

  const handleOnChangeOTP = (value) => {
    setOtp(value);
  };

  const handleSendOTP = () => {
    if (forwhat === "changePassword") {
      mutation.mutate(
        {
          email: change?.email,
          password: password,
          newPassword: newPassword,
          newPasswordConfirm: confirmPassword,
          oneTimePassword: otp,
        },
        {
          onSuccess: () => {
            message.success("Đổi mật khẩu thành công");
            dispatch(changeSuccess({}));
            navigate(`/`);
          },
          onError: (error) => {
            message.error(`Lỗi ${error.message}`);
          },
        }
      );
    } else {
      mutationForgot.mutate(
        {
          email: forgot?.email,
          newPassword: newPassword,
          newPasswordConfirm: confirmPassword,
          oneTimePassword: otp,
        },
        {
          onSuccess: () => {
            message.success("Đổi mật khẩu thành công");
            dispatch(forgotSuccess({}));
            navigate(`/login`);
          },
          onError: (error) => {
            message.error(`Lỗi ${error.message}`);
          },
        }
      );
    }
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
            <form onSubmit={handleSendOTP}>
              <Grid container spacing={2}>
                {forwhat === "changePassword" ? (
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
                ) : (
                  <></>
                )}
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
                <Grid item xs={12}>
                  <InputField
                    value={otp}
                    label={"OTP"}
                    name={"otp"}
                    type={"text"}
                    style={inputFullWidth}
                    handleOnChange={handleOnChangeOTP}
                  />
                </Grid>
              </Grid>
              {forwhat === "changePassword" ? (
                <Button
                  disabled={
                    !password.length ||
                    !newPassword.length ||
                    !confirmPassword.length ||
                    !(newPassword === confirmPassword)
                  }
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSendOTP}
                >
                  Check
                </Button>
              ) : (
                <Button
                  disabled={
                    !newPassword.length ||
                    !confirmPassword.length ||
                    !(newPassword === confirmPassword)
                  }
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSendOTP}
                >
                  Check
                </Button>
              )}
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
