import { FC } from 'react';
import { useAuth } from '../../utils/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux-hooks';
import styles from './UserMenu.module.css';
import { logout } from '../../redux/auth/auth.thunks';
import { selectIsConnect } from '../../redux/telegram/telegram.selectors';
import { disconnectChats } from '../../redux/telegram/telegram.thunks';

const UserMenu: FC = () => {
  const dispatch = useAppDispatch();
  const connect = useAppSelector(selectIsConnect);
  const { user } = useAuth();

  return (
    <div className={styles.wrapper}>
      <p className={styles.username}>Welcome, {user.username}👋</p>
      {connect && (
        <button
          type="button"
          className={styles.button_out}
          onClick={() => dispatch(disconnectChats())}
        >
          Disconnect Telegram
        </button>
      )}
      <button
        type="button"
        className={styles.button_out}
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;
