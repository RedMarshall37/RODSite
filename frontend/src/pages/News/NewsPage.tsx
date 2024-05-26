import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context';
import { format } from 'date-fns';

interface News {
  ID: number;
  Header: string;
  ImageName: string;
  Text: string;
  PublicationDate: string; // Поле даты публикации как строка
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const { isAuth, isLoading, isAdmin } = React.useContext(AuthContext);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get<News[]>('http://localhost:5000/news');
      // Сортируем новости по дате публикации в порядке убывания
      const sortedNews = response.data.sort((a, b) => new Date(b.PublicationDate).getTime() - new Date(a.PublicationDate).getTime());
      setNews(sortedNews);
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту новость?');
    if (!confirmed) return;

    try {
      const authToken = localStorage.getItem('auth');
      if (!authToken) {
        console.error('Токен авторизации отсутствует');
        return;
      }
      await axios.delete(`http://localhost:5000/news/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // Обновляем список новостей после удаления
      fetchNews();
    } catch (error) {
      console.error('Ошибка при удалении новости:', error);
    }
  };

  return (
    <div>
      <h1>Все новости</h1>
      <Link to="/news/add">Добавить новость</Link>
      {news.map((item) => (
        <div key={item.ID}>
          <Link to={`/news/${item.ID}`}>Открыть</Link>
          <h3>{item.Header}</h3>
          {item.ImageName && <img src={`http://localhost:5000/images/${item.ImageName}`} alt={item.Header} />}
          <p>{item.Text}</p>
          <p>{format(new Date(item.PublicationDate), 'dd-MM-yyyy HH:mm:ss')}</p> {/* Форматирование даты */}
          {isAdmin && (
            <div>
              <button onClick={() => handleDelete(item.ID)}>Удалить</button>
              <Link to={`/news/edit/${item.ID}`}>Редактировать</Link>
            </div>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default NewsPage;
