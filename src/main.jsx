/*
// graph ql main file

import React from "react";
import ReactDOM from "react-dom";
import App from './App.jsx';
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client"; // Correct import
import './index.css';

// Apollo Client setup
const client = new ApolloClient({
  uri: "http://192.168.0.116:3001/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
