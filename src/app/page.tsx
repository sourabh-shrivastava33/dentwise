"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Home page</h1>
      <SignedOut>
        <SignInButton mode="modal">Login</SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>Logout</SignOutButton>
      </SignedIn>
    </div>
  );
}
