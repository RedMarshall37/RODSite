// В файле NewsDetailPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface News {
    ID: number;
    Header: string;
    ImageName: string;
    Text: string;
    PublicationDate: string; // Добавляем поле даты публикации
  }

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get<News>(`http://localhost:5000/news/${id}`);
      setNews(response.data as News);
      console.log(news);
    } catch (error) {
      console.error('Ошибка при загрузке новости:', error);
    }
  };

  return (
    <div>
      {news ? (
        <div>
          <h2>{news.Header}</h2>
          {news.ImageName && <img src={`http://localhost:5000/images/${news.ImageName}`} alt={news.Header} />} {/* Отображение изображения */}
          <p>{news.Text}</p>
          <p>{news.PublicationDate}</p>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};

export default NewsDetailPage;
