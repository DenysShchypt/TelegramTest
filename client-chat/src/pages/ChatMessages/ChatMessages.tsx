import { FC, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { BackLink } from '../../components/BackLink/BackLink';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux-hooks';
import { getMessages } from '../../redux/telegram/telegram.thunks';
import { IChat, IMessage } from '../../common/types/telegram';
import {
  selectChats,
  selectIsLoading,
  selectMessages,
} from '../../redux/telegram/telegram.selectors';
import styles from './ChatMessages.module.css';

const ChatMessages: FC = () => {
  const dispatch = useAppDispatch();
  const dataMessages = useAppSelector(selectMessages);
  const getAllChats = useAppSelector(selectChats);
  const isLoading = useAppSelector(selectIsLoading);
  const { id } = useParams();
  const location = useLocation();
  const backLinkHref = location.state?.from ?? '/chats';

  const getCurrentChat = id
    ? getAllChats.find((chat: IChat) => +chat.id === +id)
    : '';

  const groupedMessages = dataMessages.reduce(
    (acc: Record<string, IMessage[]>, message: IMessage) => {
      const date = new Date(message.date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(message);
      return acc;
    },
    {}
  );

  useEffect(() => {
    if (id) dispatch(getMessages(+id));
  }, [dispatch, id]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <BackLink to={backLinkHref}>Back to chats</BackLink>
      <div>
        <h2 className={styles.chat_title}>
          You are reading chat {getCurrentChat?.name}
        </h2>
        <div>
          {Object.keys(groupedMessages).map((date) => (
            <div key={date} className={styles.date_group}>
              <h3 className={styles.date_header}>{date}</h3>
              <ul className={styles.chat_wrap}>
                {groupedMessages[date].map((message: IMessage) => (
                  <li key={message.id} className={styles.message_wrap}>
                    <p>{message.text}</p>
                    <span className={styles.message_time}>
                      {new Date(message.date).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
