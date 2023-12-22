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

const defaultTheme = createTheme();

export default function ConfirmOTP() {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [otp, setOtp] = useState("");
  const signUp = useSelector((state) => state.access.signUp.currentUser);
  const forgot = useSelector((state) => state.access.forgot.currentUser);
  const change = useSelector((state) => state.access.change.currentUser);
  const dispatch = useDispatch();
  const { forwhat } = useParams();
  const navigate = useNavigate();
  console.log("token", auth?.accessToken);

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

  const mutation = useMutationHook((data) => AuthService.sendOTP(data));
  const mutationForgot = useMutationHook((data) =>
    AuthService.forgotPassword(data)
  );
  const mutationChange = useMutationHook((data) =>
    AuthService.changePassword(auth?.accessToken, data, axiosJWT)
  );

  const { isSuccess, isError } = mutation;

  const message = "";

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    } else if (isError) {
      message = "Mã OTP sai, mời bạn kiểm tra lại";
    }

    if (mutationForgot.isSuccess) {
      navigate("/login");
    } else if (mutationForgot.isError) {
      message = "Mã OTP sai, mời bạn kiểm tra lại";
    }

    if (mutationChange.isSuccess) {
      navigate("/");
    } else if (mutationChange.isError) {
      message = "Mã OTP sai, mời bạn kiểm tra lại";
    }
  }, [
    isSuccess,
    isError,
    mutationForgot.isSuccess,
    mutationForgot.isError,
    mutationChange.isSuccess,
    mutationChange.isError,
  ]);

  const inputFullWidth = {
    width: "100%",
  };

  const handleSubmit = (event) => {
    if (forwhat === "signUp") {
      mutation.mutate(
        {
          email: signUp?.email,
          oneTimePassword: otp,
        },
        {
          onSuccess: () => {
            message.success("Xác thực thành công");
            dispatch(signSuccess({}));
            navigate("/");
          },
          onError: (error) => {
            message.error(`Lỗi ${error.message}`);
          },
        }
      );
    } else if (forwhat === "forgot") {
      mutationForgot.mutate(
        {
          email: forgot?.email,
          newPassword: forgot?.newPassword,
          newPasswordConfirm: forgot?.newPasswordConfirm,
          oneTimePassword: otp,
        },
        {
          onSuccess: () => {
            message.success("Xác thực thành công");
            dispatch(forgotSuccess({}));
            navigate("/");
          },
          onError: (error) => {
            message.error(`Lỗi ${error.message}`);
          },
        }
      );
    } else {
      mutationChange.mutate(
        {
          email: change?.email,
          password: change?.password,
          newPassword: change?.newPassword,
          newPasswordConfirm: change?.newPasswordConfirm,
          oneTimePassword: otp,
        },
        {
          onSuccess: () => {
            message.success("Xác thực thành công");
            dispatch(changeSuccess({}));
            navigate("/");
          },
          onError: (error) => {
            message.error(`Lỗi ${error.message}`);
          },
        }
      );
    }
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
              Mã OTP đã được gửi, hãy kiểm tra Email
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
