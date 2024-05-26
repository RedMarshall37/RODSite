// import {createContext, Dispatch, SetStateAction} from 'react'
import * as React from 'react';

interface IAuthContext {
  isAuth: Boolean | null;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean | null>>;
  isAdmin: Boolean | null;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean | null>>;
  isLoading: Boolean | null;
  setCurrentUserID: React.Dispatch<React.SetStateAction<number | null>>;
  currentUserID: number | null;
}
export const AuthContext = React.createContext<IAuthContext>({
  isAuth: null,
  setIsAuth: () => {},
  isAdmin:null,
  setIsAdmin: () => {},
  isLoading: null,
  setCurrentUserID: () => {},
  currentUserID: null,
});
