import type { Metadata } from "next";
import SigninClient from "./SigninClient";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your DropCast account to manage event bookings, photographer listings, and QR photo galleries.",
  robots: { index: false },
};

export default function SigninPage() {
  return <SigninClient />;
}
