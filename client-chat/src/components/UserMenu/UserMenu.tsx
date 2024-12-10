import React, { FC } from 'react';
import { useAuth } from '../../utils/hooks/useAuth';
import { useAppDispatch } from '../../utils/hooks/redux-hooks';
import styles from './UserMenu.module.css';
import { logout } from '../../redux/auth/auth.thunks';

const UserMenu: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  return (
    <div className={styles.wrapper}>
      <p className={styles.username}>Welcome, {user.username}👋</p>
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
