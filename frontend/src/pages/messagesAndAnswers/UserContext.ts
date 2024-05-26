import { createContext, useContext } from 'react';

interface AuthContextType {
  isAuth: boolean;
  isAdmin: boolean | null;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  isAdmin: null,
  setIsAdmin: () => {},
  setIsAuth: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
