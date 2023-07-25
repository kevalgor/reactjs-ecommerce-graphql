import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import CustomTitle from "../../components/customTitle";
import { GET_ORDERS } from "../../graphql/queries";
import { fetchOrders } from "../../redux/actions";
import { getUserAccessToken } from "../../utils/session";
import CustomTable from "../../components/customTable";

const Orders = () => {
  const dispatch = useDispatch();
  const userAccessToken = getUserAccessToken();

  const [getOrdersQuery, { loading: getOrdersQueryLoading }] = useLazyQuery(GET_ORDERS, {
    fetchPolicy: "no-cache",
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    onCompleted: (result) => {
      dispatch(fetchOrders(result?.getOrders));
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    getOrdersQuery();
  }, [getOrdersQuery]);

  const orders = useSelector((state: any) => {
    return state.orderReducer.orders;
  });

  return (
    <Box sx={{ margin: "90px 0" }}>
      <CustomTitle title="Orders" />
      <CustomTable orders={orders} />
    </Box>
  );
};

export default Orders;
