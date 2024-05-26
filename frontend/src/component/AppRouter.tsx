import React from 'react';
import { AuthContext } from '../context/index';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loader from './UI/Loader/Loader';
import MessagesAndAnswers from '../pages/messagesAndAnswers/MessagesAndAnswers';
import Login from '../pages/Login';
import UserProfile from '../pages/UserProfile';
import Header from './Header';
import UserManagement from '../pages/UserManagement';
import NewsPage from '../pages/News/NewsPage';
import NewsDetailPage from '../pages/News/NewsDetailPage';
import NewsEditorPage from '../pages/News/NewsEditorPage';

const AppRouter = () => {
  const { isAuth, isLoading, isAdmin } = React.useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<MessagesAndAnswers />} />
        <Route path="/FAQ" element={<MessagesAndAnswers />} />
        {!isAuth ? (
          <Route path="/login" element={<Login />} />
        ) : (
          <>
            <Route path="/user-management" element={isAdmin ? <UserManagement /> : <Navigate to="/FAQ" replace />} />
            <Route path="*" element={<Navigate to="/FAQ" replace />} />
            <Route path="/profile/:id" element={<UserProfile />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/FAQ" replace />} />
        {/* Добавляем маршрут для страницы всех новостей */}
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        {isAdmin && (
          <>
            <Route path="/news/edit/:id" element={<NewsEditorPage />} />
            <Route path="/news/add" element={<NewsEditorPage />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default AppRouter;
