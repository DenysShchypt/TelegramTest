import { FC, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import styles from './ChatList.module.css';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux-hooks';
import { getChats } from '../../redux/telegram/telegram.thunks';
import {
  selectChats,
  selectIsLoading,
} from '../../redux/telegram/telegram.selectors';
import { IChat } from '../../common/types/telegram';
import SearchChat from '../SearchChat/SearchChat';

const ChatList: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatName = searchParams.get('name') ?? '';
  const dispatch = useAppDispatch();
  const location = useLocation();
  const chats = useAppSelector(selectChats);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (chats.length === 0) dispatch(getChats());
  }, [dispatch, chats]);

  const visibleCats = chats.filter((chat: IChat) =>
    chat.name.toLowerCase().includes(chatName.toLowerCase())
  );

  const updateQueryString = (name: string) => {
    const nextParams: Record<string, string> = {};
    if (name !== '') {
      nextParams.name = name;
    }
    setSearchParams(nextParams);
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <div className={styles.header_chat_wrap}>
        <h2 className={styles.chats_title}>Telegram chats</h2>
        <SearchChat value={chatName} onChange={updateQueryString} />
      </div>
      <ul className={styles.list_wrap}>
        {chats.length > 0 &&
          visibleCats.map((chat: IChat) => (
            <li key={chat.id}>
              <Link
                to={`${chat.id}`}
                state={{ from: location }}
                className={styles.link}
              >
                <h3 className={styles.chat_title}>{chat.name}</h3>
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default ChatList;
