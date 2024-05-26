import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context';
import useMessagesAndAnswers from './UseMessagesAndAnswers';
import NewMessageForm from './NewMessageForm';
import ReplyForm from './ReplyForm';

const MessagesAndAnswers: React.FC = () => {
  const { isAuth, isAdmin } = React.useContext(AuthContext);
  const { currentMessages, currentUser, handleSubmitNewMessage, UpdateFrame, handlePostForm, handleDeleteMessageButtonClick, handleDeleteAnswerButtonClick } = useMessagesAndAnswers();

  return (
    <div>
      {currentUser && (
        <p>
          Добро пожаловать, <Link to={`/profile/${currentUser.ID}`}>{currentUser.Nickname}</Link>
        </p>
      )}
      {!isAuth && <Link to="/login">Регистрация и вход</Link>}
      {isAuth && <button onClick={handlePostForm}>Выйти</button>}
      {isAuth && <NewMessageForm />}
      <p>Вопросы и ответы:</p>
      <div>
        {currentMessages.map((message) => (
          <div key={message.ID} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            {isAdmin && (!message.developerAnswers || message.developerAnswers.length === 0) && (
              <button onClick={() => { handleDeleteMessageButtonClick(message.ID); }}>Удалить</button>
            )}
            <p><strong>Текст:</strong> {message.Text}</p>
            <p><strong>Дата и время:</strong> {new Date(message.DateTime).toLocaleString()}</p>
            <p><strong>Пользователь:</strong> <Link to={`/profile/${message.UserID}`}>{message.user?.Nickname}</Link></p>
            <p><strong>Ответы разработчиков:</strong></p>
            <ul>
              {message.developerAnswers && message.developerAnswers.map((answer) => (
                <li key={answer.ID}>
                  <p><strong>Текст:</strong> {answer.Text}</p>
                  <p><strong>Дата и время:</strong> {new Date(answer.DateTime).toLocaleString()}</p>
                  <p><strong>Пользователь:</strong> <Link to={`/profile/${answer.UserID}`}>{answer.user?.Nickname}</Link></p>
                  <p>{isAdmin && (<button onClick={() => { handleDeleteAnswerButtonClick(answer.ID); }}>Удалить</button>)}</p>
                </li>
              ))}
            </ul>
            {isAdmin && <ReplyForm messageID={message.ID} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesAndAnswers;
