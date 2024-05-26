import * as React from 'react';
import useMessagesAndAnswers from './UseMessagesAndAnswers';

interface Message {
    ID: number;
    Text: string;
    DateTime: string;
    UserID: number;
    user?: User;
    developerAnswers: DeveloperAnswer[];
}

interface DeveloperAnswer {
    ID: number;
    Text: string;
    DateTime: string;
    UserID: number;
    user?: User;
}

interface User {
    ID: number;
    Nickname: string;
}
interface Props {
    message: Message;
    isAdmin: boolean | null;
}

const Message: React.FC<Props> = ({ message, isAdmin }) => {
    const { handleDeleteMessageButtonClick, openReplyForm, closeReplyForm, handleSubmitReply, replyForms } = useMessagesAndAnswers();

    return (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            {isAdmin && (!message.developerAnswers || message.developerAnswers.length === 0) && (
                <button onClick={() => handleDeleteMessageButtonClick(message.ID)}>Удалить</button>
            )}
            <p><strong>Текст:</strong> {message.Text}</p>
            <p><strong>Дата и время:</strong> {new Date(message.DateTime).toLocaleString()}</p>
            <p><strong>Пользователь:</strong> {message.user?.Nickname}</p>
            <p><strong>Ответы разработчиков:</strong></p>
            <ul>
                {message.developerAnswers && message.developerAnswers.map((answer) => (
                    <li key={answer.ID}>
                        <p><strong>Текст:</strong> {answer.Text}</p>
                        <p><strong>Дата и время:</strong> {new Date(answer.DateTime).toLocaleString()}</p>
                        <p><strong>Пользователь:</strong> {answer.user?.Nickname}</p>
                    </li>
                ))}
            </ul>
            {isAdmin && (
                <>
                    <button onClick={() => openReplyForm(message.ID)}>Ответить</button>
                    {replyForms[message.ID] && (
                        <form onSubmit={(e) => handleSubmitReply(e, message.ID)}>
                            <textarea name="Text" />
                            <button type="submit">Отправить</button>
                            <button type="button" onClick={() => closeReplyForm(message.ID)}>Отмена</button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default Message;
