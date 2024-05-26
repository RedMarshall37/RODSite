import React, { useState } from 'react';
import axios from 'axios';
import useMessagesAndAnswers from './UseMessagesAndAnswers';

const NewMessageForm: React.FC = () => {
    const { AddNewCurrentMessage, currentUser ,UpdateFrame } = useMessagesAndAnswers();
    const [newMessageText, setNewMessageText] = useState<string>('');

    const handleSubmitNewMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const authToken = localStorage.getItem('auth');
            if (!authToken) {
                console.error('Токен авторизации отсутствует');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/usersmessages/add',
                { Text: newMessageText },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            const newMessage = response.data;
            const newMessageWithUser = {
                ...newMessage,
                user: currentUser,
                developerAnswers: []
            };

            AddNewCurrentMessage(newMessageWithUser);

            setNewMessageText('');
            UpdateFrame();

            alert('Ваше сообщение успешно отправлено. Администратор скоро прочитает ваш вопрос и ответит на него.');
        } catch (error) {
            console.error('Ошибка при добавлении сообщения:', error);
        }
    };

    return (
        <form onSubmit={handleSubmitNewMessage}>
            <textarea
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Напишите свой вопрос или предложение"
            />
            <button type="submit">Отправить</button>
        </form>
    );
};

export default NewMessageForm;
