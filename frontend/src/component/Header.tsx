import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context';
import axios from 'axios';

const Header: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const { isAuth, currentUserID, setIsAuth, setIsAdmin, setCurrentUserID, isAdmin } = useContext(AuthContext);
    const [profileData, setProfileData] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
      Nickname: '',
      Email: '',
      Password: '',
    });
    const [nickname, setNickname] = useState<string>('');
  
    const handleLogout = (e: React.FormEvent) => {
        setIsAdmin(null);
        setIsAuth(false)
        setCurrentUserID(null);
        localStorage.removeItem('auth');
        e.preventDefault();
      };

    useEffect(() => {
      if (isAuth && currentUserID) {
        const fetchUserProfile = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/users/${currentUserID}`);
            setNickname(response.data.Nickname);
            console.log(response.data);
            setFormData({
              Nickname: response.data.Nickname,
              Email: response.data.Email,
              Password: '', 
            });
          } catch (error) {
            console.error('Ошибка при загрузке профиля пользователя:', error);
          }
        };
        fetchUserProfile();
      }
    }, [id, isAuth, currentUserID]);
  
  
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/news">Новости</Link>
          </li>
          <li>
            <Link to="/FAQ">FAQ</Link>
          </li>
          {isAuth ? (
            <>
              <li>
                <Link to={`/profile/${currentUserID}`}>Добро пожаловать, {nickname}</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/user-management">Управление пользователями</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>Выход</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Вход</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
