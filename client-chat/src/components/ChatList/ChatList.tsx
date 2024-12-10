import { FC, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './ChatList.module.css';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux-hooks';
import { getChats } from '../../redux/telegram/telegram.thunks';
import {
  selectChats,
  selectIsLoading,
} from '../../redux/telegram/telegram.selectors';
import { IChat } from '../../common/types/telegram';

const ChatList: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const chats = useAppSelector(selectChats);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);
  if (isLoading) return <div>Loading...</div>;
  return (
    <ul className={styles.list_wrap}>
      {chats.length > 0 &&
        chats.map((chat: IChat) => (
          <li className={styles.item} key={chat.id}>
            <Link to={`${chat.id}`} state={{ from: location }}>
              <h3 className={styles.chat_title}>{chat.name}</h3>
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default ChatList;
