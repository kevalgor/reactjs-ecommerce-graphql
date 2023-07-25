import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, Modal, Typography, Card } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import CustomButton from "../customButton";
import { ProductListType } from "../../utils/enum";
import { getUserAccessToken, getUserDetails } from "../../utils/session";
import {
  ADD_PRODUCT_TO_CART,
  UPDATE_CART_PRODUCT,
  DELETE_CART_PRODUCT,
  ADD_PRODUCT_TO_WISHLIST,
  DELETE_WISHLIST_PRODUCT,
  ORDER_NOW,
} from "../../graphql/mutations";
import { GET_CART, GET_ORDERS, GET_WISHLIST } from "../../graphql/queries";
import { fetchCart, fetchOrders, fetchWishlist } from "../../redux/actions";
import "./style.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 1200,
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  boxShadow: "#F6AD55 0px 1px 6px 0px",
};

const ProductModal = ({
  visibleProductModal,
  closeProductModal,
  product,
  productListType,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEdit, setEdit] = useState(false);
  const [quantity, setQuantity] = useState(
    productListType === ProductListType.Cart ? Number(product?.quantity) : 1
  );
  useEffect(() => {
    if (!visibleProductModal) {
      setQuantity(
        productListType === ProductListType.Cart ? Number(product?.quantity) : 1
      );
      setEdit(false);
    }
  }, [product?.quantity, productListType, visibleProductModal]);
  const userAccessToken = getUserAccessToken();
  let userDetails: any = getUserDetails();
  if (userDetails) {
    userDetails = JSON.parse(userDetails);
  }
  const [getCartQuery, { loading: getCartLoading }] = useLazyQuery(GET_CART, {
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      // toast.success("success");
      dispatch(fetchCart(result?.getCart));
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const [getWishlistQuery, { loading: getWishlistQueryLoading }] = useLazyQuery(
    GET_WISHLIST,
    {
      ...(userAccessToken && {
        context: {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      }),
      fetchPolicy: "no-cache",
      onCompleted: (result) => {
        dispatch(fetchWishlist(result?.getWishlist));
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    }
  );
  const [getOrdersQuery, { loading: getOrdersQueryLoading }] = useLazyQuery(
    GET_ORDERS,
    {
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
    }
  );
  const [
    addProductToCartMutation,
    { loading: addProductToCartMutationLoading },
  ] = useMutation(ADD_PRODUCT_TO_CART, {
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      closeProductModal();
      toast.success("Added to cart");
      navigate("/user/cart");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const [
    updateCartProductMutation,
    { loading: updateCartProductMutationLoading },
  ] = useMutation(UPDATE_CART_PRODUCT, {
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      closeProductModal();
      toast.success("Updated to cart");
      setEdit(false);
      getCartQuery();
      navigate("/user/cart");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const [
    deleteCartProductMutation,
    { loading: deleteCartProductMutationLoading },
  ] = useMutation(DELETE_CART_PRODUCT, {
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      closeProductModal();
      toast.success("Removed from cart");
      getCartQuery();
      navigate("/user/cart");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const [
    addProductToWishlistMutation,
    { loading: addProductToWishlistMutationLoading },
  ] = useMutation(ADD_PRODUCT_TO_WISHLIST, {
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      closeProductModal();
      toast.success("Added to wishlist");
      navigate("/user/wishlist");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const [
    deleteWishlistProductMutation,
    { loading: deleteWishlistProductMutationLoading },
  ] = useMutation(DELETE_WISHLIST_PRODUCT, {
    ...(userAccessToken && {
      context: {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    }),
    fetchPolicy: "no-cache",
    onCompleted: (result) => {
      closeProductModal();
      toast.success("Removed from wishlist");
      getWishlistQuery();
      navigate("/user/wishlist");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const [orderNowMutation, { loading: orderNowMutationLoading }] = useMutation(
    ORDER_NOW,
    {
      ...(userAccessToken && {
        context: {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      }),
      fetchPolicy: "no-cache",
      onCompleted: (result) => {
        closeProductModal();
        toast.success("Order booked");
        getOrdersQuery();
        navigate("/user/orders");
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    }
  );
  const activeEditMode = () => {
    setEdit(true);
  };
  const removeEditMode = () => {
    setEdit(false);
    setQuantity(
      productListType === ProductListType.Cart ? Number(product?.quantity) : 1
    );
  };
  const addQuantity = () => {
    if (quantity < 10) {
      setQuantity((quantity) => quantity + 1);
    }
  };
  const removeQuantity = () => {
    if (quantity > 1) {
      setQuantity((quantity) => quantity - 1);
    }
  };
  const addToCart = () => {
    addProductToCartMutation({
      variables: {
        addProductToCartInput: {
          product:
            productListType === ProductListType.Product
              ? product?._id
              : product?.product?._id,
          quantity,
          user: userDetails?._id || "",
        },
      },
    });
  };
  const updateCartProduct = () => {
    updateCartProductMutation({
      variables: {
        cartId: product?._id,
        updateCartProductInput: {
          quantity,
        },
      },
    });
  };
  const deleteCartProduct = () => {
    deleteCartProductMutation({
      variables: {
        cartId: product?._id,
      },
    });
  };
  const addToWishlist = () => {
    addProductToWishlistMutation({
      variables: {
        addProductToWishlistInput: {
          product: product?._id,
          user: userDetails?._id || "",
        },
      },
    });
  };
  const deleteWishlistProduct = () => {
    deleteWishlistProductMutation({
      variables: {
        wishlistId: product?._id,
      },
    });
  };
  const orderNow = (orderId: any) => {
    orderNowMutation({
      variables: {
        completeOrderInput: {
          product:
            productListType === ProductListType.Product
              ? product?._id
              : product?.product?._id,
          user: userDetails?._id || "",
          quantity,
          deliveryAddress: userDetails?.deliveryAddress || "",
          orderAmount:
            productListType === ProductListType.Product
              ? product?.price * quantity
              : product?.product?.price * quantity,
          discount: 0,
          paidAmount:
            productListType === ProductListType.Product
              ? product?.price * quantity
              : product?.product?.price * quantity,
        },
      },
    });
  };
  return (
    <Box>
      <Modal
        open={visibleProductModal}
        onClose={closeProductModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card className="product-card">
            <Box className="product-card-image">
              <img
                src={
                  productListType === ProductListType.Product
                    ? product?.image
                    : product?.product?.image
                }
                alt="product"
              ></img>
            </Box>
            <Box className="product-card-content">
              <Typography gutterBottom variant="h5" component="div">
                {productListType === ProductListType.Product
                  ? product?.title
                  : product?.product?.title}
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "justify" }}
              >
                {productListType === ProductListType.Product
                  ? product?.description
                  : product?.product?.description}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight={"700"}
                sx={{ textAlign: "justify" }}
              >
                {productListType === ProductListType.Product
                  ? product?.price
                  : product?.product?.price}{" "}
                ₹
              </Typography>
              {productListType === ProductListType.Cart ? (
                isEdit ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: "20px 0",
                    }}
                  >
                    <RemoveIcon onClick={removeQuantity} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: "30px", textAlign: "center" }}
                    >
                      {quantity}
                    </Typography>
                    <AddIcon onClick={addQuantity} />
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ margin: "20px 0", fontWeight: "600" }}
                  >
                    Quantity: {quantity}
                  </Typography>
                )
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    margin: "20px 0",
                  }}
                >
                  <RemoveIcon onClick={removeQuantity} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ width: "30px", textAlign: "center" }}
                  >
                    {quantity}
                  </Typography>
                  <AddIcon onClick={addQuantity} />
                </Box>
              )}
              {productListType === ProductListType.Cart ? (
                isEdit ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: {
                        xl: "flex-start",
                        md: "center",
                        sm: "center",
                        xs: "center",
                      },
                    }}
                  >
                    <CustomButton
                      type={"submit"}
                      name={"Save"}
                      backgroundColor={"#1976D0"}
                      hoverColor={"#1962E2"}
                      color={"#FFFFFF"}
                      margin={"5px 5px"}
                      onClick={updateCartProduct}
                    />
                    <CustomButton
                      type={"submit"}
                      name={"Cancel"}
                      backgroundColor={"#FF5555"}
                      hoverColor={"#FF3333"}
                      color={"#FFFFFF"}
                      margin={"5px 5px"}
                      onClick={removeEditMode}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: {
                        xl: "flex-start",
                        md: "center",
                        sm: "center",
                        xs: "center",
                      },
                    }}
                  >
                    <CustomButton
                      type={"submit"}
                      name={"Edit"}
                      backgroundColor={"#1976D0"}
                      hoverColor={"#1962E2"}
                      color={"#FFFFFF"}
                      margin={"5px 5px"}
                      onClick={activeEditMode}
                    />
                    <CustomButton
                      type={"submit"}
                      name={"Delete"}
                      backgroundColor={"#FF5555"}
                      hoverColor={"#FF3333"}
                      color={"#FFFFFF"}
                      margin={"5px 5px"}
                      onClick={deleteCartProduct}
                    />
                    <CustomButton
                      type={"submit"}
                      name={"Order now"}
                      backgroundColor={"#33C433"}
                      hoverColor={"#00B500"}
                      color={"#FFFFFF"}
                      margin={"5px 5px"}
                      onClick={orderNow}
                    />
                  </Box>
                )
              ) : productListType === ProductListType.Wishlist ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: {
                      xl: "flex-start",
                      md: "center",
                      sm: "center",
                      xs: "center",
                    },
                  }}
                >
                  <CustomButton
                    type={"submit"}
                    name={"Add to cart"}
                    backgroundColor={"#1976D0"}
                    hoverColor={"#1962E2"}
                    color={"#FFFFFF"}
                    margin={"5px 5px"}
                    onClick={addToCart}
                  />
                  <CustomButton
                    type={"submit"}
                    name={"Delete"}
                    backgroundColor={"#FF5555"}
                    hoverColor={"#FF3333"}
                    color={"#FFFFFF"}
                    margin={"5px 5px"}
                    onClick={deleteWishlistProduct}
                  />
                  <CustomButton
                    type={"submit"}
                    name={"Order now"}
                    backgroundColor={"#33C433"}
                    hoverColor={"#00B500"}
                    color={"#FFFFFF"}
                    margin={"5px 5px"}
                    onClick={orderNow}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: {
                      xl: "flex-start",
                      md: "center",
                      sm: "center",
                      xs: "center",
                    },
                  }}
                >
                  <CustomButton
                    type={"submit"}
                    name={"Add to cart"}
                    backgroundColor={"#1976D0"}
                    hoverColor={"#1962E2"}
                    color={"#FFFFFF"}
                    margin={"5px 5px"}
                    onClick={addToCart}
                  />
                  <CustomButton
                    type={"submit"}
                    name={"Add to wishlist"}
                    backgroundColor={"#FF7700"}
                    hoverColor={"#FF6600"}
                    color={"#FFFFFF"}
                    margin={"5px 5px"}
                    onClick={addToWishlist}
                  />
                  <CustomButton
                    type={"submit"}
                    name={"Order now"}
                    backgroundColor={"#33C433"}
                    hoverColor={"#00B500"}
                    color={"#FFFFFF"}
                    margin={"5px 5px"}
                    onClick={orderNow}
                  />
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductModal;
