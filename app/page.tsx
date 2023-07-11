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
  hideSignUp: true,
};

export default withAuthenticator(function Home({ signOut, user }) {
  return (
    <main className="">
      <ProductList actionLink="/product-details"></ProductList>
      <div className="flex flex-row justify-end">
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    </main>
  );
}, withAuthenticatorOptions);
