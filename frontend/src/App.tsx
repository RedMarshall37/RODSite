import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './component/AppRouter';
import { AuthContext } from './context';

function App() {
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [isLoading, setLoading] = React.useState(true);
  const [currentUserID, setCurrentUserID] = React.useState<number | null>(null);

  React.useEffect(() => {
    console.log('App component mounted');
    const auth = localStorage.getItem('auth');
    setIsAuth(auth ? true : false);
    setIsAdmin(localStorage.getItem('isAdmin') ? true : null);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        isAdmin,
        setIsAdmin,
        isLoading,
        setCurrentUserID,
        currentUserID
      }}
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
