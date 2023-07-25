import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      _id
      name
      email
      mobile
      address
      deliveryAddress
      token
    }
  }
`;

export const UPDATE_USER_INFORMATION = gql`
  mutation UpdateUserInformation(
    $userId: String!
    $updateUserInformationInput: UpdateUserInformationInput!
  ) {
    updateUserInformation(
      userId: $userId
      updateUserInformationInput: $updateUserInformationInput
    )
  }
`;

export const ADD_PRODUCT_TO_CART = gql`
  mutation AddProductToCart($addProductToCartInput: AddProductToCartInput!) {
    addProductToCart(addProductToCartInput: $addProductToCartInput)
  }
`;

export const UPDATE_CART_PRODUCT = gql`
  mutation UpdateCartProduct(
    $cartId: String!
    $updateCartProductInput: UpdateCartProductInput!
  ) {
    updateCartProduct(
      cartId: $cartId
      updateCartProductInput: $updateCartProductInput
    )
  }
`;

export const DELETE_CART_PRODUCT = gql`
  mutation DeleteCartProduct($cartId: String!) {
    deleteCartProduct(cartId: $cartId)
  }
`;

export const ADD_PRODUCT_TO_WISHLIST = gql`
  mutation AddProductToWishlist(
    $addProductToWishlistInput: AddProductToWishlistInput!
  ) {
    addProductToWishlist(addProductToWishlistInput: $addProductToWishlistInput)
  }
`;

export const DELETE_WISHLIST_PRODUCT = gql`
  mutation DeleteWishlistProduct($wishlistId: String!) {
    deleteWishlistProduct(wishlistId: $wishlistId)
  }
`;

export const ORDER_NOW = gql`
  mutation CompleteOrder($completeOrderInput: CompleteOrderInput!) {
    completeOrder(completeOrderInput: $completeOrderInput)
  }
`;
