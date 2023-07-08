"use client";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, API, Auth } from "aws-amplify";
import awsExports from "../src/aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
import Button from "@mui/material/Button";

Amplify.configure({ ...awsExports, ssr: true });
Auth.configure(awsconfig);

const withAuthenticatorOptions = {
  hideSignUp: false,
};

export default withAuthenticator(function Home({ signOut, user }) {
  return (
    <main className="">
      <h1>HOME</h1>
      <h1>Logged in as {user?.username}.</h1>
      <div>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    </main>
  );
}, withAuthenticatorOptions);
