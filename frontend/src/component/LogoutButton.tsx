import React from "react";
import { AuthContext } from "../context";

const LogoutButton = () => {
    const { isAuth, setIsAuth, isAdmin, setIsAdmin } = React.useContext(AuthContext);
    const handlePostForm = (e: React.FormEvent) => {
      setIsAuth(false);
      setIsAdmin(null);
      localStorage.removeItem('auth');
      localStorage.removeItem('roles');
      e.preventDefault();
    };

  return (
    <button onClick={handlePostForm}>
      LOG OUT
    </button>
  );
};

export default LogoutButton;
