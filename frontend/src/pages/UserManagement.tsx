import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  ID: string;
  Nickname: string;
  Email: string;
  isBanned: boolean;
  isAdmin: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ byBanned: boolean; byAdmin: boolean }>({ byBanned: false, byAdmin: false });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = (field: 'isBanned' | 'isAdmin') => {
    setSort((prevState) => ({
      ...prevState,
      [field === 'isBanned' ? 'byBanned' : 'byAdmin']: !prevState[field === 'isBanned' ? 'byBanned' : 'byAdmin'],
    }));
    setUsers((prevUsers) =>
      [...prevUsers].sort((a, b) =>
        sort[field === 'isBanned' ? 'byBanned' : 'byAdmin']
          ? Number(b[field]) - Number(a[field])
          : Number(a[field]) - Number(b[field])
      )
    );
  };

  const handleToggle = async (id: string, field: 'isBanned' | 'isAdmin', value: boolean) => {
    try {
      const token = localStorage.getItem('auth');
      await axios.put(
        `http://localhost:5000/users/${field}/${id}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error(`Ошибка при обновлении ${field}:`, error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.Nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Управление пользователями</h1>
      <input type="text" value={search} onChange={handleSearch} placeholder="Поиск по нику" />
      <table>
        <thead>
          <tr>
            <th>Ник</th>
            <th>Почта</th>
            <th>
              <button onClick={() => handleSort('isBanned')}>
                Забанен {sort.byBanned ? '▲' : '▼'}
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('isAdmin')}>
                Админ {sort.byAdmin ? '▲' : '▼'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.ID}>
              <td>{user.Nickname}</td>
              <td>{user.Email}</td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isBanned}
                  onChange={() => handleToggle(user.ID, 'isBanned', !user.isBanned)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isAdmin}
                  onChange={() => handleToggle(user.ID, 'isAdmin', !user.isAdmin)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
