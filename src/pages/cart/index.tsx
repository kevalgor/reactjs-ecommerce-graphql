import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import CustomCard from "../../components/customCard";
import CustomTitle from "../../components/customTitle";
import { GET_CART } from "../../graphql/queries";
import { fetchCart } from "../../redux/actions";
import { getUserAccessToken } from "../../utils/session";

const Cart = () => {
  const dispatch = useDispatch();
  const userAccessToken = getUserAccessToken();

  const [getCartQuery, { loading: getCartLoading }] = useLazyQuery(GET_CART, {
    fetchPolicy: "no-cache",
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    onCompleted: (result) => {
      dispatch(fetchCart(result?.getCart));
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    getCartQuery();
  }, [getCartQuery]);

  const cart = useSelector((state: any) => {
    return state.cartReducer.cart;
  });

  return (
    <Box sx={{ margin: "90px auto", maxWidth: 1560 }}>
      <CustomTitle title="Cart" />
      {cart && cart.length ? (
        <Box className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 place-items-center">
          {cart.map((product: any) => {
            return (
              <Box key={product?._id}>
                <CustomCard productListType={1} product={product} />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography className="text-center" variant="body1">
          No records
        </Typography>
      )}
    </Box>
  );
};

export default Cart;
