import * as React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';

// Определение интерфейса для пропсов
interface AuthRouterProps {
  isAuth: boolean;
  redirectTo: string;
}

const AuthRouter: React.FC<AuthRouterProps> = ({ isAuth, redirectTo, ...props }) => {
  if (isAuth) {
    // Если пользователь аутентифицирован и пытается зайти на защищенную страницу, перенаправляем его на страницу redirectTo
    return <Navigate to={redirectTo} replace={true} />;
  } else {
    // Если пользователь не аутентифицирован и пытается зайти на страницу для неаутентифицированных пользователей, позволяем ему доступ
    return <Route {...props} />;
  }
};

export default AuthRouter;
