import { FC } from 'react';
import ChatList from '../../components/ChatList/ChatList';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux-hooks';
import {
  selectIsConfirmCode,
  selectIsConnect,
} from '../../redux/telegram/telegram.selectors';
import ConnectChats from '../../components/ConnectChats/ConnectChats';
import styles from './Chats.module.css';
import { disconnectChats } from '../../redux/telegram/telegram.thunks';

const Chats: FC = () => {
  const dispatch = useAppDispatch();
  const isConnectUser = useAppSelector(selectIsConnect);
  const isConfirmUser = useAppSelector(selectIsConfirmCode);
  return (
    <div className={styles.chats_container}>
      {!isConfirmUser ? (
        <h2 className={styles.chats_title}>Connect your Telegram account</h2>
      ) : (
        <h2 className={styles.chats_title}>Telegram chats</h2>
      )}
      {isConnectUser ? <ChatList /> : <ConnectChats />}
      {isConnectUser && (
        <button
          type="button"
          className={styles.disconnect_button}
          onClick={() => dispatch(disconnectChats())}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default Chats;
