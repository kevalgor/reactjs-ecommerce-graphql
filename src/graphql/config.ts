import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import fetch from "cross-fetch";

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  fetch,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    return { headers };
  });
  return forward(operation);
});

export const gqlClient = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache(),
});
