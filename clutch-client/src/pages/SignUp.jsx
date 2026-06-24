import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignUp routing="path" path="/signup" signInUrl="/signin" />
    </div>
  );
}
