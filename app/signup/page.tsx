import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Join DropCast as an event host or photographer. Book vetted creators for your events or list your photography business on our marketplace.",
};

export default function SignupPage() {
  return <SignupClient />;
}
