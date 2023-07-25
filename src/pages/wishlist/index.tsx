import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import CustomCard from "../../components/customCard";
import CustomTitle from "../../components/customTitle";
import { getUserAccessToken } from "../../utils/session";
import { GET_WISHLIST } from "../../graphql/queries";
import { fetchWishlist } from "../../redux/actions";

const Wishlist = () => {
  const dispatch = useDispatch();
  const userAccessToken = getUserAccessToken();

  const [getWishlistQuery, { loading: getWishlistQueryLoading }] = useLazyQuery(
    GET_WISHLIST,
    {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
      fetchPolicy: "no-cache",
      onCompleted: (result) => {
        dispatch(fetchWishlist(result?.getWishlist));
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    }
  );

  useEffect(() => {
    getWishlistQuery();
  }, [getWishlistQuery]);

  const wishlist = useSelector((state: any) => {
    return state.wishlistReducer.wishlist;
  });
  return (
    <Box sx={{ margin: "90px auto", maxWidth: 1560 }}>
      <CustomTitle title="Wishlist" />
      {wishlist && wishlist.length ? (
        <Box className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 place-items-center">
          {wishlist.map((product: any) => {
            return (
              <Box key={product?._id}>
                <CustomCard productListType={2} product={product} />
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

export default Wishlist;
