import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "@firebase/auth";
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import CenteredContainer from "../components/ui/CenteredContainer";
import LoadingScreen from "../components/pages/LoadingScreen";
import { auth } from "../firebase/firebase";

type AuthProviderProps = {
  children: any;
};

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: Dispatch<User | null>;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUpError: undefined | string;
  setSignUpError: Dispatch<undefined | string>;
  signInError: undefined | string;
  setSignInError: Dispatch<undefined | string>;
};

const AuthContext = createContext({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [signUpError, setSignUpError] = useState<string | undefined>();
  const [signInError, setSignInError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  async function signup(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSignUpError(undefined);
      location.pathname = "/";
    } catch {
      setSignUpError("Email already in use");
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSignInError(undefined);
      location.pathname = "/";
    } catch {
      setSignInError("Failed to log in");
    }
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        signup,
        login,
        signUpError,
        setSignUpError,
        signInError,
        setSignInError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
