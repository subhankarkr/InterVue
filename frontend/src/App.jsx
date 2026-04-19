import { 
  SignInButton, 
  SignOutButton, 
  SignedIn, 
  SignedOut,
  UserButton,
  useUser
} from '@clerk/clerk-react';
import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProblemsPage from './pages/ProblemsPage';



function App() {
  const {isSignedIn}=useUser();
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/problems" element={isSignedIn ? <ProblemsPage/> : <Navigate to="/" />} />
    </Routes>
    <Toaster />
    </>
    
  );
}

export default App;