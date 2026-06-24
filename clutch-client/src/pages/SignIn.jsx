import { SignIn } from "@clerk/clerk-react";

export default function Signin() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignIn routing="path" path="/signin" signUpUrl="/signup" />
    </div>
  );
}