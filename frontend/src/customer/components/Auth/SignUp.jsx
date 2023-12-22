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

const defaultTheme = createTheme();

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHook((data) => AuthService.signUp(data));

  // const { data, status } = mutation;

  const navigate = useNavigate();

  const inputFullWidth = {
    width: "100%",
  };

  const handleOnChangeFirstName = (value) => {
    setFirstName(value);
  };
  const handleOnChangeLastName = (value) => {
    setLastName(value);
  };
  const handleOnChangeUserName = (value) => {
    setUserName(value);
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

  const handleSignUp = (event) => {
    event.preventDefault();
    mutation.mutate({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: password,
    },{
      onSuccess:()=>{
        message.success("Đã gửi mã OTP")
      },
      onError:(error)=>{
        message.error(`Lỗi ${error.message}`)
      }
    });
    navigate(`/otp/${encodeURIComponent(email)}`);
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
                <Grid item xs={12} sm={6}>
                  {/* <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  /> */}
                  <InputField
                    value={firstName}
                    label={"First Name"}
                    name={"firstName"}
                    type={"text"}
                    handleOnChange={handleOnChangeFirstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputField
                    value={lastName}
                    label={"Last Name"}
                    name={"lastName"}
                    type={"text"}
                    handleOnChange={handleOnChangeLastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    value={userName}
                    label={"User Name"}
                    name={"userName"}
                    type={"text"}
                    style={inputFullWidth}
                    handleOnChange={handleOnChangeUserName}
                  />
                </Grid>
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
                  !firstName.length ||
                  !lastName.length ||
                  !userName.length ||
                  !confirmPassword.length ||
                  !(password === confirmPassword)
                }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignUp}
              >
                Tiến hành Đăng ký
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
