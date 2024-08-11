import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputField from "../InputField";
import { useState } from "react";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useNavigate, useParams } from "react-router-dom";
import * as AuthService from "../../../services/AuthService";
import { useDispatch } from "react-redux";
import { signSuccess } from "../../../redux/slides/accessSlice";
import { message } from "antd";

const defaultTheme = createTheme();

export default function ConfirmOTP() {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useParams();

  const mutation = useMutationHook((data) => {
    const res = AuthService.sendOTP(data);
    console.log("res", res);
    return res;
  });

  const inputFullWidth = {
    width: "100%",
  };

  const handleSubmit = (event) => {
    mutation.mutate(
      {
        email: email,
        oneTimePassword: otp,
      },
      {
        onSuccess: () => {
          message.success("Successful Authentication").toString();
          dispatch(signSuccess({}));
          navigate("/auth");
        },
        onError: (error) => {
          message.error(`Errors ${error.message}`).toString();
        },
      }
    );
  };

  const handleOnChangeOTP = (value) => {
    setOtp(value);
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
              Sended OTP, check your Email
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
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
