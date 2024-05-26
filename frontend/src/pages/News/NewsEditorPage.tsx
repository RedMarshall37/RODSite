import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface News {
    ID: number;
    Header: string;
    ImageName: string;
    Text: string;
    PublicationDate: string; // Поле даты публикации как строка
}

const NewsEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [news, setNews] = useState<News | null>(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Header: '',
        Text: '',
        ImageName: '',
        PublicationDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'), // Устанавливаем текущую дату в ISO 8601 формате
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (id) {
            fetchNews();
        }
    }, [id]);

    const fetchNews = async () => {
        try {
            const authToken = localStorage.getItem('auth');
            if (!authToken) {
                console.error('Токен авторизации отсутствует');
                return;
            }
            const response = await axios.get<News>(`http://localhost:5000/news/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setNews(response.data);
            setFormData({
                Header: response.data.Header,
                Text: response.data.Text,
                ImageName: response.data.ImageName,
                PublicationDate: format(new Date(response.data.PublicationDate), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
            });
        } catch (error) {
            console.error('Ошибка при загрузке новости:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const authToken = localStorage.getItem('auth');
            if (!authToken) {
                console.error('Токен авторизации отсутствует');
                return;
            }

            const dataToSend = new FormData();
            dataToSend.append('Header', formData.Header);
            dataToSend.append('Text', formData.Text);
            dataToSend.append('PublicationDate', format(new Date(formData.PublicationDate), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'));

            if (selectedFile) {
                dataToSend.append('image', selectedFile);
            }

            if (id) {
                await axios.put(`http://localhost:5000/news/${id}`, dataToSend, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post('http://localhost:5000/news/add', dataToSend, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            navigate('/news');
        } catch (error) {
            console.error('Ошибка при сохранении новости:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div>
            <h2>{id ? 'Редактирование новости' : 'Добавление новости'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Заголовок:</label>
                    <input
                        type="text"
                        name="Header"
                        value={formData.Header}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Изображение:</label>
                    <input
                        type="file"
                        name="ImageName"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <label>Содержание:</label>
                    <textarea
                        name="Text"
                        value={formData.Text}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Дата публикации:</label>
                    <input
                        type="datetime-local"
                        name="PublicationDate"
                        value={formData.PublicationDate}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default NewsEditorPage;
