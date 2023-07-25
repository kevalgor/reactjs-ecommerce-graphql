import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "./style.css";
import {
  setUserAccessToken,
  setUserDetails,
  getUserAccessToken,
  getUserDetails,
} from "../../utils/session";
import CustomTextField from "../../components/customTextField";
import CustomTitle from "../../components/customTitle";
import CustomButton from "../../components/customButton";
import { loginSchema } from "../../validations/loginForm.validations";
import { LOGIN } from "../../graphql/mutations";
import { login } from "../../redux/actions";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAccessToken = getUserAccessToken();
  const userDetails = getUserDetails();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      loginMutation({
        variables: {
          loginInput: {
            email: values.email,
            password: values.password,
          },
        },
      });
      // resetForm();
    },
  });
  useEffect(() => {
    if (userAccessToken && userDetails) {
      navigate("/user/cart");
    }
  }, [navigate, userAccessToken, userDetails]);
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN, {
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      setUserAccessToken(result?.login.token);
      setUserDetails(result?.login);
      dispatch(login(result?.login));
      navigate("/user/cart");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  if (!userAccessToken && !userDetails) {
    return (
      <Box
        className="login-form absolute"
        component="form"
        sx={{
          boxShadow: "#F6AD55 0px 2px 5px -1px, #F6AD55 0px 1px 3px -1px",
          "& > :not(style)": {
            my: 4,
            mx: 2,
            width: { xs: 250, sm: 300, md: 350, lg: 400 },
          },
        }}
        // noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <CustomTitle title="Login" />
        <Box className="flex flex-col">
          <CustomTextField
            fullWidth
            label={"E-mail"}
            name={"email"}
            InputProps={{
              // autoComplete: "new-password",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <EmailIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email ? (
            <Typography className="text-red-600" variant={"body2"}>
              {formik.errors.email}
            </Typography>
          ) : null}
          <CustomTextField
            fullWidth
            label={"Password"}
            name={"password"}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && formik.touched.password ? (
            <Typography className="text-red-600" variant={"body2"}>
              {formik.errors.password}
            </Typography>
          ) : null}
          <CustomButton type={"submit"} name={"Login"} margin={"30px 0 0 0"} />
        </Box>
      </Box>
    );
  }
  return <></>;
};

export default Login;
