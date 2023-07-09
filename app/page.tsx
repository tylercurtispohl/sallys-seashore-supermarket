"use client";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, API, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
import Button from "@mui/material/Button";
import ProductList from "@/components/ProductList";

Amplify.configure({ ...awsconfig, ssr: true });
Auth.configure(awsconfig);

const withAuthenticatorOptions = {
  hideSignUp: false,
};

export default withAuthenticator(function Home({ signOut, user }) {
  const callProductsApi = async () => {
    const authenticatedUser = await Auth.currentAuthenticatedUser();
    const token = authenticatedUser.signInUserSession.idToken.jwtToken;
    console.log("token: ", token);

    const requestData = {
      headers: {
        Authorization: token,
      },
    };
    const data = await API.get("sallyapi", "/products", requestData);
    console.log("data: ", data);
  };

  return (
    <main className="">
      <ProductList actionLink="/product-details"></ProductList>
      <div>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    </main>
  );
}, withAuthenticatorOptions);
