import { Navigate } from "react-router-dom";
import { getUserAccessToken, getUserDetails } from "../utils/session";

const PrivateRoute = ({ routeName }: any) => {
  const userAccessToken = getUserAccessToken();
  const userDetails = getUserDetails();
  return userAccessToken && userDetails ? routeName : <Navigate to={"/login"} />;
};

export default PrivateRoute;
