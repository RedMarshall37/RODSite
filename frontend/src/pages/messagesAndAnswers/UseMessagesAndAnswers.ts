import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context';
import { Message, User, DeveloperAnswer } from './MessageTypes';

const useMessagesAndAnswers = () => {
    const { isAuth, isAdmin, setIsAdmin, setIsAuth } = useContext(AuthContext);
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [messagesToDelete, setMessagesToDelete] = useState<number[]>([]);
    const [answersToDelete, setAnswersToDelete] = useState<number[]>([]);
    const [newMessageText, setNewMessageText] = useState<string>('');
    const [replyForms, setReplyForms] = useState<{ [key: number]: boolean }>({});
    const [updateFrameVariable, setUpdateFrame] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessagesAndAnswers = async () => {
            console.log("reloading");
            const authToken = localStorage.getItem('auth');
            try {
                const messagesResponse = await axios.get(
                    isAdmin
                        ? 'http://localhost:5000/usersmessages'
                        : 'http://localhost:5000/usersmessages/withanswers', {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            },
                        });
                const messages: Message[] = messagesResponse.data;

                let filteredMessages = messages;
                if (isAdmin) {
                    filteredMessages.sort((a, b) => new Date(b.DateTime).getTime() - new Date(a.DateTime).getTime());
                }

                const userIds = filteredMessages.map((message: Message) => message.UserID);
                const developerIds = filteredMessages.reduce<number[]>((acc: number[], message: Message) => {
                    message.developerAnswers.forEach((answer: DeveloperAnswer) => {
                        acc.push(answer.UserID);
                    });
                    return acc;
                }, []);

                const allUserIds = Array.from(new Set([...userIds, ...developerIds]));

                const usersData = await Promise.all(
                    allUserIds.map((userId) => axios.get(`http://localhost:5000/users/${userId}`))
                );

                const usersMap = usersData.reduce<{ [key: number]: User }>((acc, userResponse: any) => {
                    acc[userResponse.data.ID] = userResponse.data;
                    return acc;
                }, {});

                const messagesWithUsers = filteredMessages.map((message: Message) => ({
                    ...message,
                    user: usersMap[message.UserID],
                    developerAnswers: message.developerAnswers.map((answer: DeveloperAnswer) => ({
                        ...answer,
                        user: usersMap[answer.UserID]
                    }))
                }));

                setCurrentMessages(messagesWithUsers);
                console.log(messagesWithUsers);

                if (isAuth) {
                    const currentUserId = parseInt(localStorage.getItem('currentUserID') || '0', 10);
                    if (currentUserId) {
                        const currentUserResponse = await axios.get(`http://localhost:5000/users/${currentUserId}`);
                        setCurrentUser(currentUserResponse.data);
                    }
                }
            } catch (error) {
                console.error('There was an error fetching the data:', error);
            }
        };

        fetchMessagesAndAnswers();
    }, [isAuth, isAdmin, updateFrameVariable]);

    const UpdateFrame = () => {
        setUpdateFrame(!updateFrameVariable);
    }

    const AddNewCurrentMessage = (newCurrentMessage: Message) => {
        setCurrentMessages(prevMessages => [...prevMessages, newCurrentMessage]);
    }

    const handleSubmitReply = async (e: React.FormEvent, messageID: number) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const text = formData.get('Text') as string;

        try {
            const authToken = localStorage.getItem('auth');
            if (!authToken) {
                console.error('Токен авторизации отсутствует');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/developeranswers/add',
                {
                    Text: text,
                    UserMessageID: messageID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            const updatedMessages = currentMessages.map((message) => {
                if (message.ID === messageID) {
                    return {
                        ...message,
                        developerAnswers: [
                            ...message.developerAnswers,
                            {
                                ID: response.data.ID,
                                Text: text,
                                DateTime: response.data.DateTime,
                                UserID: response.data.UserID,
                                user: response.data.user,
                            },
                        ],
                    };
                }
                return message;
            });

            setCurrentMessages(updatedMessages);
            console.log(updatedMessages);
            setReplyForms({ ...replyForms, [messageID]: false });
        } catch (error) {
            console.error('Ошибка при отправке ответа разработчика:', error);
        }
    };

    const openReplyForm = (messageID: number) => {
        setReplyForms({ ...replyForms, [messageID]: true });
    };

    const closeReplyForm = (messageID: number) => {
        setReplyForms({ ...replyForms, [messageID]: false });
    };

    const handlePostForm = (e: React.FormEvent) => {
        setIsAdmin(null);
        setIsAuth(false)
        setCurrentUser(null);
        localStorage.removeItem('auth');
        e.preventDefault();
    };

    const handleNewMessageTextChange = (text: string) => {
        setNewMessageText(text);
    };

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

            const newMessageWithUserAndAnswers: Message = {
                ...newMessage,
                user: currentUser,
                developerAnswers: []
            };

            AddNewCurrentMessage(newMessageWithUserAndAnswers);

            setNewMessageText('');

            alert('Ваше сообщение успешно отправлено. Администратор скоро прочитает ваш вопрос и ответит на него.');
        } catch (error) {
            console.error('Ошибка при добавлении сообщения:', error);
        }
    };

    const handleDeleteMessageButtonClick = async (messageID: number) => {
        setMessagesToDelete([...messagesToDelete, messageID]);
        handleDeleteMessageConfirmation(messageID);
    };
    const handleDeleteAnswerButtonClick = async (answerID: number) => {
        setAnswersToDelete([...answersToDelete, answerID]);
        handleDeleteAnswerConfirmation(answerID);
    };

    const handleDeleteAnswerConfirmation = async (answerID: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот ответ?')) {
            try {
                const authToken = localStorage.getItem('auth');
                if (!authToken) {
                    console.error('Токен авторизации отсутствует');
                    return;
                }

                await axios.delete(`http://localhost:5000/developeranswers/${answerID}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                const updatedMessages = currentMessages.map((message) => {
                    if (message.developerAnswers) {
                        return {
                            ...message,
                            developerAnswers: message.developerAnswers.filter((answer) => answer.ID !== answerID)
                        };
                    }
                    return message;
                });

                setCurrentMessages(updatedMessages);
                UpdateFrame();
            } catch (error) {
                console.error('Ошибка при удалении ответа:', error);
            }
        }
    };

    const handleDeleteMessageConfirmation = async (messageID: number) => {
        if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
            try {
                const authToken = localStorage.getItem('auth');
                if (!authToken) {
                    console.error('Токен авторизации отсутствует');
                    return;
                }

                await axios.delete(`http://localhost:5000/usersmessages/${messageID}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                setCurrentMessages(currentMessages.filter((message) => message.ID !== messageID));
                UpdateFrame();
            } catch (error) {
                console.error('Ошибка при удалении сообщения:', error);
            }
        }
    };

    return {
        currentMessages,
        currentUser,
        messagesToDelete,
        handleSubmitReply,
        openReplyForm,
        closeReplyForm,
        setNewMessageText,
        handlePostForm,
        handleSubmitNewMessage,
        handleDeleteMessageButtonClick,
        handleDeleteAnswerButtonClick,
        replyForms,
        AddNewCurrentMessage,
        UpdateFrame
    };
};

export default useMessagesAndAnswers;
