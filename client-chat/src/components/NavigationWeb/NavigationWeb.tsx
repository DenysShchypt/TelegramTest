import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavigationWeb.module.css';
import { useAuth } from '../../utils/hooks/useAuth';

const NavigationWeb: FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <nav className={styles.nav_wrap}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
        to="/"
      >
        Home
      </NavLink>
      {isLoggedIn && (
        <NavLink
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          to="/chats"
        >
          Chats
        </NavLink>
      )}
    </nav>
  );
};

export default NavigationWeb;
