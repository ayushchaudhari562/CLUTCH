import { SignIn } from "@clerk/clerk-react";

export default function Signin() {
  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center p-4">
      <SignIn routing="path" path="/signin" signUpUrl="/signup" />
    </div>
  );
}