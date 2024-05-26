import React, { useState } from 'react';
import axios from 'axios';
import { axiosConfig } from './axiosConfig';

interface Props {
  messageID: number;
}

const ReplyForm: React.FC<Props> = ({ messageID }) => {
  const [replyText, setReplyText] = useState<string>('');

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('auth');
      if (!authToken) {
        console.error('Токен авторизации отсутствует');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/developeranswers/add',
        {
          Text: replyText,
          UserMessageID: messageID,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(response.data);

      setReplyText('');
    } catch (error) {
      console.error('Ошибка при отправке ответа разработчика:', error);
    }
  };

  return (
    <form onSubmit={handleSubmitReply}>
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Введите ответ"
      />
      <button type="submit">Отправить</button>
    </form>
  );
};

export default ReplyForm;
