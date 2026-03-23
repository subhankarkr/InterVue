import { 
  SignInButton, 
  SignOutButton, 
  SignedIn, 
  SignedOut,
  UserButton
} from '@clerk/clerk-react';

import './App.css';

function App() {
  return (
    <>

        <h1>Welcome to InterVue!</h1>
      <SignedOut>
        <SignInButton mode="modal"/>
        <button>Login</button>
      </SignedOut>

      <SignedIn>
        <SignOutButton mode="modal"/>
      </SignedIn>
      <UserButton/>
    </>
  );
}

export default App;