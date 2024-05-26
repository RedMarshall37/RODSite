import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuth, currentUserID } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Nickname: '',
    Email: '',
    Password: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setProfileData(response.data);
        setFormData({
          Nickname: response.data.Nickname,
          Email: response.data.Email,
          Password: '', // Reset password field
        });
      } catch (error) {
        console.error('Ошибка при загрузке профиля пользователя:', error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('auth');
      if (!authToken) {
        console.error('Токен авторизации отсутствует');
        return;
      }

      const requestData = { ...formData };
      // Если это аккаунт текущего пользователя, отправляем пароль
      if (currentUserID && currentUserID === Number(id)) {
        requestData.Password = formData.Password;
      }

      await axios.put(`http://localhost:5000/users/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      alert('Профиль успешно обновлен');
      setEditMode(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  if (!profileData) {
    return <div>Загрузка...</div>;
  }

  const isCurrentUserProfile = currentUserID && currentUserID === Number(id);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      {isAuth && isCurrentUserProfile && (
        <button onClick={() => setEditMode((prev) => !prev)}>
          {editMode ? 'Отмена' : 'Редактировать'}
        </button>
      )}
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Никнейм:</label>
            <input
              type="text"
              name="Nickname"
              value={formData.Nickname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
            />
          </div>
          {/* Показываем поле пароля только для текущего пользователя */}
          {isCurrentUserProfile && (
            <div>
              <label>Пароль:</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
              />
            </div>
          )}
          <button type="submit">Сохранить</button>
        </form>
      ) : (
        <div>
          <p><strong>Никнейм:</strong> {profileData.Nickname}</p>
          <p><strong>Email:</strong> {profileData.Email}</p>
          {/* Показываем информацию об администраторе только для текущего пользователя */}
          {isCurrentUserProfile && profileData.isAdmin && <p>Администратор</p>}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
