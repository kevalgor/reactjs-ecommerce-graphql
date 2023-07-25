import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import CustomTitle from "../../components/customTitle";
import CustomTextField from "../../components/customTextField";
import { userProfileSchema } from "../../validations/userProfileForm.validations";
import { GET_USER_INFORMATION } from "../../graphql/queries";
import { UPDATE_USER_INFORMATION } from "../../graphql/mutations";
import { getUserAccessToken, getUserDetails } from "../../utils/session";
import { login } from "../../redux/actions";
import CustomButton from "../../components/customButton";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAccessToken = getUserAccessToken();
  let userDetails: any = getUserDetails();
  if (userDetails) {
    userDetails = JSON.parse(userDetails);
  }
  let userProfileFormInitialValues: {
    name: string;
    email: string;
    mobile: string;
    address: string;
    deliveryAddress: string;
  };
  const [getUserInformationQuery, { loading: getUserInformationQueryLoading }] =
    useLazyQuery(GET_USER_INFORMATION, {
      ...(userAccessToken && {
        context: {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      }),
      fetchPolicy: "no-cache",
      onCompleted: (result) => {
        userProfileFormInitialValues = {
          name: result?.getUserInformation?.name || "",
          email: result?.getUserInformation?.email || "",
          mobile: result?.getUserInformation?.mobile || "",
          address: result?.getUserInformation?.address || "",
          deliveryAddress: result?.getUserInformation?.deliveryAddress || "",
        };
        setUserProfileFormValues(userProfileFormInitialValues);
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    });
  useEffect(() => {
    getUserInformationQuery({
      variables: {
        userId: userDetails?._id || "",
      },
    });
  }, [getUserInformationQuery, userDetails?._id]);
  const [userProfileFormValues, setUserProfileFormValues] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    deliveryAddress: "",
  });
  const formik = useFormik({
    initialValues: userProfileFormValues,
    enableReinitialize: true,
    validationSchema: userProfileSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("values", values);
      updateUserInformationMutation({
        variables: {
          userId: userDetails?._id || "",
          updateUserInformationInput: {
            name: values.name,
            mobile: values.mobile,
            address: values.address,
            deliveryAddress: values.deliveryAddress,
          },
        },
      });
      // resetForm();
    },
  });
  const [
    updateUserInformationMutation,
    { loading: updateUserInformationLoading },
  ] = useMutation(UPDATE_USER_INFORMATION, {
    context: {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    },
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      const userProfileDetails = {
        name: formik.values.name,
        mobile: formik.values.mobile,
      };
      dispatch(login(userProfileDetails));
      toast.success("Profile updated");
      navigate("/products");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  console.log("first", userProfileFormValues);
  return (
    <Box sx={{ margin: "90px 0" }}>
      <CustomTitle title="Profile" />
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
        <Box className="flex flex-col">
          <CustomTextField
            fullWidth
            label={"Name"}
            name={"name"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.errors.name && formik.touched.name ? (
            <Typography className="text-red-600" variant={"body2"}>
              {formik.errors.name}
            </Typography>
          ) : null}
          <CustomTextField
            fullWidth
            label={"E-mail"}
            name={"email"}
            isDisabled
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email ? (
            <Typography className="text-red-600" variant={"body2"}>
              {formik.errors.email}
            </Typography>
          ) : null}
          <CustomTextField
            fullWidth
            label={"Mobile"}
            name={"mobile"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mobile}
          />
          {formik.errors.mobile && formik.touched.mobile ? (
            <Typography className="text-red-600" variant={"body2"}>
              {formik.errors.mobile}
            </Typography>
          ) : null}
          <CustomTextField
            fullWidth
            label={"Address"}
            name={"address"}
            multiline
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
          />
          {formik.errors.address && formik.touched.address ? (
            <Typography className="text-red-600" variant={"body2"}>
              {formik.errors.address}
            </Typography>
          ) : null}
          <CustomTextField
            fullWidth
            label={"Delivery address"}
            name={"deliveryAddress"}
            multiline
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.deliveryAddress}
          />
          {formik.errors.deliveryAddress && formik.touched.deliveryAddress ? (
            <Typography className="text-red-600" variant={"body2"}>
              {formik.errors.deliveryAddress}
            </Typography>
          ) : null}
          <CustomButton type={"submit"} name={"Login"} margin={"30px 0 0 0"} />
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
