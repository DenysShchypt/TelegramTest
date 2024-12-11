import { FC } from 'react';
import ChatList from '../../components/ChatList/ChatList';
import { useAppSelector } from '../../utils/hooks/redux-hooks';
import { selectIsConnect } from '../../redux/telegram/telegram.selectors';
import ConnectChats from '../../components/ConnectChats/ConnectChats';
import styles from './Chats.module.css';

const Chats: FC = () => {
  const connect = useAppSelector(selectIsConnect);

  return (
    <div className={styles.chats_container}>
      {!connect && (
        <h2 className={styles.chats_title}>Connect your Telegram account</h2>
      )}

      {connect ? <ChatList /> : <ConnectChats />}
    </div>
  );
};

export default Chats;
