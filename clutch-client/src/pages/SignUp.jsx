import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center p-4">
      <SignUp 
        routing="path" 
        path="/signup" 
        signInUrl="/signin" 
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
