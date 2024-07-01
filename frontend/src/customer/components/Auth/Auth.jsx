import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signInSchema from "../../../validator/signInValidator";
import signUpSchema from "../../../validator/signUpValidator";
import FormSignIn from "./formSignIn";
import FormSignUp from "./formSignUp";
import "./styles.css";
import { useDispatch } from "react-redux";
import * as AuthService from "../../../services/AuthService";
import * as UserSerVice from "../../../services/UserService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { signSuccess } from "../../../redux/slides/accessSlice";

const Auth = () => {
  const [isActive, setIsActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutationSignIn = useMutationHook((data) => AuthService.loginUser(data));
  const { data: dataSignIn, isSuccess } = mutationSignIn;

  const mutationSignUp = useMutationHook((data) => AuthService.signUp(data));

  useEffect(() => {
    if (isSuccess) {
      // navigate("/");
      if (dataSignIn?.accessToken) {
        handleGetProfileUser(dataSignIn?.accessToken);
      }
    }
  }, [isSuccess]);

  const handleGetProfileUser = async (accessToken) => {
    const res = await UserSerVice.getProfileUserInLogin(accessToken);
    const decode = jwtDecode(accessToken);
    const isAdmin = decode.role[0] === "ROLE_ADMINISTRATOR";
    dispatch(loginSuccess({ ...res, accessToken, isAdmin }));
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };
  const handleLoginClick = () => {
    setIsActive(false);
  };

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: errorsSignIn },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: errorsSignUp },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmitSignIn = (data) => {
    const formData = {
      ...data,
    };
    mutationSignIn.mutate(formData, {
      onError: () => {
        message.error("Email or password is wrong").toString();
      },
    });
  };

  const onSubmitSignUp = (data) => {
    const formData = {
      ...data,
    };
    mutationSignUp.mutate(formData, {
      onSuccess: () => {
        message.success("Sended OTP").toString();
        dispatch(signSuccess(formData));
        setTimeout(() => {
          navigate(`/otp/${formData.email}`);
        }, 1000);
      },
      onError: (error) => {
        message.error(`Account already exists`).toString();
      },
    });
  };
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-400 flex items-center justify-center flex-col h-screen">
      <div className={`container ${isActive ? "active" : ""}`}>
        <div className="form-container sign-up">
          <form onSubmit={handleSubmitSignUp(onSubmitSignUp)} className="form">
            <FormSignUp registerSignUp={registerSignUp} errors={errorsSignUp} />
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleSubmitSignIn(onSubmitSignIn)} className="form">
            <FormSignIn registerSignIn={registerSignIn} errors={errorsSignIn} />
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-4xl font-bold tracking-wide mb-4">
                Welcome Back!
              </h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hover:opacity-80" onClick={handleLoginClick}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-4xl font-bold tracking-wide">
                Hello, Friend!
              </h1>
              <p>
                Register with your personal details to use all of site features
              </p>
              <button className="hover:opacity-80" onClick={handleRegisterClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
