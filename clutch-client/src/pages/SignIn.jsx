import { SignIn } from "@clerk/clerk-react";

export default function Signin() {
  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center p-4">
      <SignIn 
        routing="path" 
        path="/signin" 
        signUpUrl="/signup" 
        appearance={{
          variables: {
            colorPrimary: '#10B981',
            colorBackground: '#0E1115',
            colorInputBackground: '#090A0F',
            colorText: '#FFFFFF',
            colorTextSecondary: '#6B7280',
            borderRadius: '16px',
          }
        }}
      />
    </div>
  );
}