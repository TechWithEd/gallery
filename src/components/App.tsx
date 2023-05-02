import { Route, Routes } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import PageNotFound from "./pages/PageNotFound";
import SignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import "./App.css";
import Profile from "./authentication/Profile";
import Dashboard from "./authentication/Dashboard";

export default function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard user={currentUser} />} />
        <Route path="/profile" element={<Profile user={currentUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
