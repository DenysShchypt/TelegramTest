import { FC } from 'react';
import styles from './AuthNav.module.css';
import { NavLink } from 'react-router-dom';

const AuthNav: FC = () => {
  return (
    <div className={styles.nav_wrap}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
        to="/register"
      >
        Register
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
        to="/login"
      >
        Log In
      </NavLink>
    </div>
  );
};

export default AuthNav;
