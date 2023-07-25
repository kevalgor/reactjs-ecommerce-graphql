import { gql } from "@apollo/client";

export const GET_USER_INFORMATION = gql`
  query GetUserInformation($userId: String!) {
    getUserInformation(userId: $userId) {
      _id
      address
      deliveryAddress
      email
      mobile
      name
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      _id
      title
      image
      description
      price
      category
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    getCart {
      _id
      product {
        _id
        title
        image
        description
        price
        category
      }
      user {
        _id
        name
        email
      }
      quantity
    }
  }
`;

export const GET_WISHLIST = gql`
  query GetWishlist {
    getWishlist {
      _id
      product {
        _id
        title
        image
        description
        price
        category
      }
      user {
        _id
        name
        email
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      _id
      user {
        _id
        name
        email
        mobile
        address
        deliveryAddress
      }
      product {
        _id
        title
        image
        description
        price
        category
      }
      quantity
      deliveryAddress
      orderStatus
      orderAmount
      discount
      paidAmount
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($orderId: String!) {
    getOrder(orderId: $orderId) {
      _id
      product {
        _id
        title
        description
        image
        price
        category
      }
      user {
        _id
        name
        mobile
        email
        address
        deliveryAddress
      }
      quantity
      deliveryAddress
      orderStatus
      orderAmount
      discount
      paidAmount
    }
  }
`;
