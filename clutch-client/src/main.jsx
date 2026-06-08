import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react";

import App from './App.jsx'

const Publish_key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if(!Publish_key)
{
  throw new Error ("missing Publish_key");
  
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={Publish_key}>
      <App />
    </ClerkProvider>
    
  </StrictMode>,
)
